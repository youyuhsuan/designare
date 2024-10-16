# [Designare](https://designare.com)

_An intuitive platform for effortlessly creating professional websites without coding._

## Description
Designare is a powerful no-code platform that empowers anyone to create professional-looking websites without writing a single line of code. Drag-and-drop components, customize themes, and publish your site in minutes. Elevate your online presence with Designare.

## Requirement

## Environment Variables (.env)

This project uses `.env` files to manage environment variables. Create a `.env.local` file at the root of your project and populate it with your environment variables, following the examples below.

**Important:** Make sure to add `.env.local` to your `.gitignore` file to prevent sensitive information from being committed to version control.

### Firebase Admin SDK Settings

- `FIREBASE_ADMIN_PRIVATE_KEY_ID`: Your Firebase service account private key ID.
- `FIREBASE_ADMIN_PRIVATE_KEY`: Your Firebase service account private key. **Note:** This value often includes newline characters, ensure these are handled correctly.
- `FIREBASE_ADMIN_CLIENT_EMAIL`: Your Firebase service account client email address.
- `FIREBASE_ADMIN_CLIENT_ID`: Your Firebase service account client ID.
- `FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL`: Firebase Authentication provider X509 certificate URL.
- `FIREBASE_ADMIN_CLIENT_X509_CERT_URL`: Firebase client X509 certificate URL.

**How to obtain Firebase Admin SDK settings:**

1.  Go to the Firebase Console and create a project.
2.  In "Project settings" > "Service accounts", generate a new private key.
3.  Copy the contents of the key file to your `.env.local` file and set the corresponding environment variable names.

### Firebase Client SDK Settings

- `NEXT_PUBLIC_FIREBASE_API_KEY`: Your Firebase Web API Key.
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Your Firebase Authentication domain.
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Your Firebase Project ID.
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Your  
  Firebase Storage bucket.
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase  
  Cloud Messaging sender ID.
- `NEXT_PUBLIC_FIREBASE_APP_ID`: Your Firebase App ID.
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`: Your Firebase Measurement ID (optional).

**How to obtain Firebase Client SDK settings:**

1.  Go to the Firebase Console and create a project.
2.  In "Project settings" > "General", find the "Your apps" section.
3.  Click on the "Web" icon to get the Firebase configuration values for your web app.

### JWT

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API

[API Designare Docs](http://localhost:3000/api-doc)

## Test Account

You can use the following account to explore the application:

| Account             | Password |
| ------------------- | -------- |
| example@example.com | example  |

**Note:**

- This account is for testing purposes only.
- The data in this account may be reset periodically.

## Firestore Security Rules

This project uses Firestore security rules to protect user data.

**Important:**

- By default, the database starts in test mode with open access for easy setup.
- **You MUST update the security rules within 30 days to restrict access and protect your data.**
- After 30 days, proper security rules are required to read and write data.

For detailed information and examples of how to configure the rules, refer to the [`firestore.rules`](https://firebase.google.com/docs/firestore/security/get-started?authuser=0) file in the project.
