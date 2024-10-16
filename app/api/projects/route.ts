import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/src/libs/token";
import { projectDB } from "@/src/libs/db/projectDB";
import createProjectInfo from "@/src/libs/createProjectInfo";
import {
  ProjectStatus,
  ProjectType,
  ProjectUrlOptions,
} from "@/src/types/projectTypes";

// Create project
export async function POST(request: NextRequest) {
  const encryptedToken = request.cookies.get("token")?.value;
  if (!encryptedToken) {
    return NextResponse.json({ error: "No token found" }, { status: 401 });
  }
  try {
    const decryptedToken = JSON.parse(encryptedToken as string);
    const payload = await verifyToken(decryptedToken.token.accessToken);
    if (!payload) {
      return NextResponse.json(
        { error: "Token is not valid" },
        { status: 401 }
      );
    }
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const urlOptions: ProjectUrlOptions = {
      customUrl: body?.customUrl,
      customThumbnailUrl: body?.customThumbnailUrl,
    };

    // Generate basic project metadata
    const projectInfo = createProjectInfo(
      payload.sub as string,
      body.name,
      body.type as ProjectType,
      body.status as ProjectStatus,
      body?.parentTemplateId,
      body.screenshotUrl || "",
      urlOptions
    );
    const newProjectId = await projectDB.insertProjectInfo(projectInfo);
    return NextResponse.json(
      { ...projectInfo, projectId: newProjectId },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Unknown error occurred in creating project API",
      error as Error
    );
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json(
      { error: "Create project API internal server error" },
      { status: 500 }
    );
  }
}

// select All Projects
export async function GET(request: NextRequest) {
  const encryptedToken = request.cookies.get("token")?.value;
  if (!encryptedToken) {
    return NextResponse.json({ error: "No token found" }, { status: 401 });
  }
  try {
    const decryptedToken = JSON.parse(encryptedToken as string);
    const payload = await verifyToken(decryptedToken.token.accessToken);
    if (!payload) {
      return NextResponse.json(
        { error: "Token is not valid" },
        { status: 401 }
      );
    }
    const projects = await projectDB.selectAllProjectsMetadata(
      payload?.sub as string
    );
    return NextResponse.json(
      { success: true, projects: projects },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Unknown error occurred in selecting all projects API",
      error as Error
    );
    return NextResponse.json(
      { error: "Select all projects API internal server error" },
      { status: 500 }
    );
  }
}
