import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/src/libs/token";
import { projectDB } from "@/src/libs/db/projectDB";

// Update project name
export async function PATCH(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const encryptedToken = req.cookies.get("token")?.value;
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
    const { newName } = await req.json();
    const projectName = await projectDB.updateProjectName(
      payload?.sub as string,
      params.projectId as string,
      newName as string
    );
    if (!projectName) {
      return NextResponse.json(
        { error: "Project mame not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Update Website metadata updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Unknown error occurred in update project name",
      error as Error
    );
    return NextResponse.json(
      { error: "Update project name API internal server error" },
      { status: 500 }
    );
  }
}

// Delete project
export async function DELETE(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const encryptedToken = req.cookies.get("token")?.value;
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
    await projectDB.deleteProject(
      payload?.sub as string,
      params.projectId as string
    );
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Unknown error occurred in deleting project API");
    return NextResponse.json(
      { error: "Delete project API internal server error" },
      { status: 500 }
    );
  }
}

// Fetch project info data
export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const encryptedToken = req.cookies.get("token")?.value;
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
    const projectData = await projectDB.selectProjectInfo(
      payload?.sub as string,
      params.projectId as string
    );
    return NextResponse.json(projectData, { status: 200 });
  } catch (error) {
    console.error(
      "Unknown error occurred in fetching project info data",
      error as Error
    );
    return NextResponse.json(
      { error: "Fetching project API internal server error" },
      { status: 500 }
    );
  }
}
