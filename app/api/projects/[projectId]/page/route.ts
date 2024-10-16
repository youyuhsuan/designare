import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/src/libs/token";
import { projectDB } from "@/src/libs/db/projectDB";

// Fetch project page data
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
    const projectPage = await projectDB.selectProjectPage(
      payload?.sub as string,
      params.projectId as string
    );
    return NextResponse.json(projectPage, { status: 200 });
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
