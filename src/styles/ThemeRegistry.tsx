"use client";

import React, { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";
import { ThemeProvider } from "@/src/styles/ThemeProvider";

function ThemeRegistry({ children }: { children: React.ReactNode }) {
  // Only create stylesheet once with lazy initial state
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  // Use Next.js's useServerInsertedHTML for server-side style injection
  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  // For client-side rendering, simply wrap with ThemeWrapper
  if (typeof window !== "undefined") {
    return <ThemeProvider>{children}</ThemeProvider>;
  }

  // For server-side rendering, use StyleSheetManager to collect styles
  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      <ThemeProvider>{children}</ThemeProvider>
    </StyleSheetManager>
  );
}

export default ThemeRegistry;
