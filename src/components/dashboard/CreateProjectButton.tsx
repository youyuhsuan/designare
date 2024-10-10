"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import Button from "@/src/ui/Button";
import {
  CreateProjectButtonProps,
  CreateProjectInfoProps,
  ProjectType,
} from "@/src/types/projectTypes";

const getDefaultScreenshotUrl = (type: ProjectType) => {
  switch (type) {
    case "template":
      return "/public/images/template-project-screenshot.png";
    case "blank":
    default:
      return "/public/images/blank-project-screenshot.png";
  }
};

const CreateProjectButton: React.FC<CreateProjectButtonProps> = ({
  type = "blank",
  initialName = "Untitled",
  buttonText = "建立新網站",
  screenshotUrl,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const projectData: CreateProjectInfoProps = {
        name: initialName,
        type,
        status: "active",
        screenshotUrl: screenshotUrl || getDefaultScreenshotUrl(type),
      };
      const response = await fetch("/api/projects", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });
      if (!response.ok) {
        throw new Error(
          `Create project failed with status: ${response.status}`
        );
      }
      const date = await response.json();
      const router = useRouter();
      router.push(`/website/${date.projectId}`);
    } catch (error) {
      console.error(
        "Unknown error occurred while creating project",
        error as Error
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button $variant="outlined" onClick={handleClick} disabled={isLoading}>
      {isLoading ? "Loading..." : buttonText}
    </Button>
  );
};

export default CreateProjectButton;
