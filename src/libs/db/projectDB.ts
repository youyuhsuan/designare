import { firebaseDB } from "@/src/configs/firebaseClient";
import {
  doc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  getDoc,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import type { ProjectMetadata, ProjectInfo } from "@/src/types/projectTypes";
import {
  projectInfoConverter,
  projectMetadataConverter,
} from "@/src/libs/db/converter";
import { FirebaseError } from "firebase/app";

// Collection Setting
const PROJECTS_COLLECTION = "projects";
const WEBSITE_PROJECT_COLLECTION = "website_project";

const projectDB = {
  async insertProject(projectInfo: ProjectInfo): Promise<string> {
    const projectsRef = collection(
      firebaseDB,
      PROJECTS_COLLECTION,
      projectInfo.userId,
      WEBSITE_PROJECT_COLLECTION
    ).withConverter(projectInfoConverter);
    try {
      if (!projectInfo.projectId || !projectInfo.name || !projectInfo.userId) {
        throw new Error("Missing required fields in projectInfo");
      }
      const docRef = await addDoc(projectsRef, projectInfo);
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
        throw new Error("Unknown error occurred while inserting project");
      }
    }
  },
  async selectProject(
    userId: string,
    projectId: string
  ): Promise<ProjectInfo | null> {
    const projectRef = doc(
      firebaseDB,
      PROJECTS_COLLECTION,
      userId,
      WEBSITE_PROJECT_COLLECTION,
      projectId
    ).withConverter(projectInfoConverter);
    try {
      const docSnap = await getDoc(projectRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error("Unknown error:", error as Error);
      throw new Error(
        "Unknown error occured while selecting project",
        error as Error
      );
    }
  },
  async selectAllProjects(userId: string): Promise<ProjectMetadata[] | null> {
    const projectsRef = collection(
      firebaseDB,
      PROJECTS_COLLECTION,
      userId,
      WEBSITE_PROJECT_COLLECTION
    ).withConverter(projectMetadataConverter);
    try {
      const querySnapshot = await getDocs(projectsRef);
      if (querySnapshot.empty) {
        return [];
      }
      const projects = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          projectId: doc.id,
        };
      });
      return projects;
    } catch (error) {
      console.error("Error in selectAllProjects:", error);
      if (error instanceof FirebaseError) {
        console.error("Firebase error code:", error.code);
        console.error("Firebase error message:", error.message);
        throw new Error(
          `Firebase error while querying projects: ${error.message}`
        );
      } else if (error instanceof Error) {
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        throw new Error(`Error while querying projects: ${error.message}`);
      } else {
        console.error("Unknown error:", error);
        throw new Error("Unknown error occurred while querying projects");
      }
    }
  },
  async deleteProject(userId: string, projectId: string): Promise<void> {
    const projectRef = doc(
      firebaseDB,
      PROJECTS_COLLECTION,
      userId,
      WEBSITE_PROJECT_COLLECTION,
      projectId
    ).withConverter(projectInfoConverter);
    try {
      await deleteDoc(projectRef);
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
    const projectRef = doc(
      firebaseDB,
      PROJECTS_COLLECTION,
      userId,
      WEBSITE_PROJECT_COLLECTION,
      projectId
    ).withConverter(projectInfoConverter);
    try {
      await updateDoc(projectRef, { name: newName });
      const updatedProject = await this.selectProject(userId, projectId);
      return updatedProject;
    } catch (error) {
      throw new Error(
        "Unknown error occurred while updating project name",
        error as Error
      );
    }
  },
};

export { projectDB };
