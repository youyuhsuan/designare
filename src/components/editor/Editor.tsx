import CollapsedSidebar from "@/src/components/editor/CollapsedSidebar";
import EditorNavbar from "@/src/components/editor/EditorNavbar";
import styled from "styled-components";

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function Editor() {
  return (
    <EditorContainer>
      <EditorNavbar />
      <div>
        <CollapsedSidebar />
      </div>
    </EditorContainer>
  );
}
