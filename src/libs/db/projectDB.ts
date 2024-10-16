import { adminFirebaseDB } from "@/src/configs/firebaseAdmin";
import type { ProjectMetadata, ProjectInfo } from "@/src/types/projectTypes";
import {
  projectInfoConverter,
  projectMetadataConverter,
} from "@/src/libs/db/converterAdmin";
import { FirebaseError } from "firebase/app";

// Collection Setting
const PROJECTS_COLLECTION = "projects";
const INFO_COLLECTION = "info";
const PAGE_COLLECTION = "page";

const projectDB = {
  // Info collection
  async insertProjectInfo(projectInfo: ProjectInfo): Promise<string> {
    try {
      if (!projectInfo.projectId || !projectInfo.name || !projectInfo.userId) {
        throw new Error("Missing required fields in projectInfo");
      }
      const projectsRef = adminFirebaseDB
        .collection(PROJECTS_COLLECTION)
        .doc(projectInfo.userId)
        .collection(INFO_COLLECTION);
      const docRef = await projectsRef.add(
        projectInfoConverter.toFirestore(projectInfo)
      );
      return docRef.id;
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error("Firebase error code:", error.code);
        console.error("Firebase error message:", error.message);
        throw new Error(
          `Firebase error while inserting project: ${error.message}`
        );
      } else if (error instanceof Error) {
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        throw new Error(`Error while inserting project: ${error.message}`);
      } else {
        console.error("Unknown error:", error as Error);
        throw new Error("Unknown error occurred while inserting project info");
      }
    }
  },
  async selectProjectInfo(
    userId: string,
    projectId: string
  ): Promise<ProjectInfo | null> {
    try {
      const projectRef = adminFirebaseDB
        .collection(PROJECTS_COLLECTION)
        .doc(userId)
        .collection(INFO_COLLECTION)
        .doc(projectId)
        .withConverter(projectInfoConverter);
      const docSnap = await projectRef.get();
      if (!docSnap.exists) {
        throw new Error(
          `Project not found for userId: ${userId} and projectId: ${projectId}`
        );
      }
      const projectData = docSnap.data();
      if (!projectData) {
        throw new Error(
          `Project data is null or undefined for userId: ${userId} and projectId: ${projectId}`
        );
      }
      return projectData;
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error("Firebase error:", error.code, error.message);
        throw new Error(
          `Firebase error while selecting project: ${error.message}`
        );
      } else {
        console.error("Unknown error:", error as Error);
        throw new Error(
          "Unknown error occured while selecting project info",
          error as Error
        );
      }
    }
  },
  async selectAllProjectsMetadata(
    userId: string
  ): Promise<ProjectMetadata[] | null> {
    try {
      const projectsRef = adminFirebaseDB
        .collection(PROJECTS_COLLECTION)
        .doc(userId)
        .collection(INFO_COLLECTION);
      const querySnapshot = await projectsRef.get();
      if (querySnapshot.empty) {
        return [];
      }
      return querySnapshot.docs.map((doc) => ({
        ...projectMetadataConverter.fromFirestore(doc),
        projectId: doc.id,
      }));
    } catch (error) {
      console.error("Error in selectAllProjectsMetadata:", error);
      if (error instanceof FirebaseError) {
        console.error("Firebase error code:", error.code);
        console.error("Firebase error message:", error.message);
        throw new Error(
          `Firebase error while querying projects: ${error.message}`
        );
      } else if (error instanceof Error) {
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        throw new Error(
          `Error while selecting all projects metadata: ${error.message}`
        );
      } else {
        console.error("Unknown error:", error);
        throw new Error(
          "Unknown error occurred while selecting all projects metadata"
        );
      }
    }
  },
  async deleteProject(userId: string, projectId: string): Promise<void> {
    try {
      const projectRef = adminFirebaseDB
        .collection(PROJECTS_COLLECTION)
        .doc(userId)
        .collection(INFO_COLLECTION)
        .doc(projectId);
      await projectRef.delete();
    } catch (error) {
      throw new Error(
        "Unknown error occured while deleting project",
        error as Error
      );
    }
  },
  async updateProjectName(
    userId: string,
    projectId: string,
    newName: string
  ): Promise<ProjectInfo | null> {
    try {
      const projectRef = adminFirebaseDB
        .collection(PROJECTS_COLLECTION)
        .doc(userId)
        .collection(INFO_COLLECTION)
        .doc(projectId);
      await projectRef.update({ name: newName });
      return this.selectProjectInfo(userId, projectId);
    } catch (error) {
      throw new Error(
        "Unknown error occurred while updating project name",
        error as Error
      );
    }
  },
  // Page collection
  // TODO:FIX withConverter converter
  async insertProgectPage(userId: string) {},
  async selectProjectPage(
    userId: string,
    projectId: string
  ): Promise<any | null> {
    try {
      const projectRef = adminFirebaseDB
        .collection(PROJECTS_COLLECTION)
        .doc(userId)
        .collection(PAGE_COLLECTION)
        .doc(projectId);
      // .withConverter(projectInfoConverter);
      const docSnap = await projectRef.get();
      return docSnap.exists ? docSnap.data() : null;
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error("Firebase error:", error.code, error.message);
        throw new Error(
          `Firebase error while selecting project: ${error.message}`
        );
      } else {
        console.error("Unknown error:", error as Error);
        throw new Error(
          "Unknown error occured while selecting project page",
          error as Error
        );
      }
    }
  },
};

export { projectDB };
