using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Microsoft.IdentityModel.Tokens;

using System.Text.Json;
using System.Text;
using System.Reflection;

using Serilog;
using Serilog.Events;

using Resend;
using Log = Serilog.Log;

using backend.Data;
using backend.Middleware;
using backend.Configuration;
using backend.Services;
using backend.Filters;
using backend.Helpers;

var builder = WebApplication.CreateBuilder(args);

// Builder setting
// Configure Serilog logger by reading settings from configuration files (appsettings.json)
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .CreateLogger();

// Replace the default logging provider with Serilog
builder.Host.UseSerilog();

// Configure http client
builder.Services.AddHttpClient();

// Configure MVC controllers with JSON serialization options
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Example: "FirstName" becomes "firstName" in JSON
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });

// Generate a new RSA key pair (for system initialization only)
// RsaKeyHelper.SaveKeyPairToFiles("public_key.pem", "private_key.pem");

// Configure JWT Bearer authentication scheme
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            // Load RSA public key for token validation
            IssuerSigningKey = new RsaSecurityKey(
                RsaKeyHelper.LoadPublicKey(builder.Configuration)
            )
        };
    });

// Configure global validation error handling for API controllers
builder.Services.ConfigureApiValidation();

// Register application services for dependency injection
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
builder.Services.AddScoped<ITokenBlacklistService, TokenBlacklistService>();
builder.Services.AddScoped<ITokenRepository, TokenRepository>();
builder.Services.AddSingleton<IOAuthService, OAuthService>();
builder.Services.AddScoped<ICookieService, CookieService>();
builder.Services.AddScoped<IStorageService, AzureBlobStorageService>();
builder.Services.AddScoped<IShrineService, ShrineService>();
builder.Services.AddResend(options =>
{
    options.ApiToken = builder.Configuration["Resend:ApiKey"]!;
});
builder.Services.AddScoped<IEmailService, ResendEmailService>();

// Configure Swagger API documentation generation
builder.Services.AddSwaggerGen(c =>
{
    // Basic Swagger document information
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Designare API",
        Version = "1.0.0",
        Description = "Designare RESTful API Documentation",
        Contact = new OpenApiContact
        {
            Name = "You Yu hsuan",
            Email = string.Empty,
            Url = new Uri("https://github.com/youyuhsuan")
        },
        License = new OpenApiLicense
        {
            Name = "MIT License",
            Url = new Uri("https://opensource.org/licenses/MIT")
        }
    });

    // JWT Bearer token authentication configuration for Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme."
    });

    // Add custom operation filter to handle authorization requirements in Swagger UI
    c.OperationFilter<AuthorizeCheckOperationFilter>();

    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    c.IncludeXmlComments(xmlPath);
});

// Configure CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000", "http://localhost:8080", "http://localhost:5286")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .WithExposedHeaders("X-Pagination");
    });
});

// Configure Entity Framework with SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Register global error handling middleware for all environments
app.UseMiddleware<GlobalErrorHandlingMiddleware>();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    // Enable Swagger documentation and UI for development
    app.UseSwagger();
    app.UseSwaggerUI(c =>
      {
          c.SwaggerEndpoint("/swagger/v1/swagger.json", "Designare API V1");
      });

    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await context.Database.MigrateAsync();
    await DataSeeder.SeedShrinesAsync(context, app.Logger);
}
else
{
    // The default HSTS value is 30 days.
    // You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

// Enable HTTPS redirection
app.UseHttpsRedirection();

// Apply CORS policy to allow cross-origin requests from frontend
app.UseCors("AllowFrontend");

// Enable authentication and authorization middleware
app.UseAuthentication();
app.UseAuthorization();

// Map Web API controller endpoints
app.MapControllers();

try
{
    Log.Information("Application starting");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application failed to start");
}
finally
{
    Log.Information("Application shutdown complete");
    Log.CloseAndFlush();
}