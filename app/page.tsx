import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import React from "react";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <h2>Main Content</h2>
        <p>This is the main content of the home page.</p>
      </main>
      <Footer />
    </>
  );
}
