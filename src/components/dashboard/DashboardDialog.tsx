import Dialog from "@/src/ui/Dialog";
import Button from "@/src/ui/Button";
import styled from "styled-components";

const Title = styled.h2`
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 10px;
`;

const Description = styled.p`
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 20px;
`;

const Warning = styled.div`
  color: ${(props) => props.theme.colors.danger};
  border-radius: 4px;
  margin-bottom: 20px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  margin-bottom: 0.25rem; // 4px
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
`;

interface EditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  editName: string;
  setEditName: (name: string) => void;
  onSave: () => void;
  isSaving: boolean;
}

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  onDelete: () => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  isDeleteEnabled: boolean;
}

const EditDialog: React.FC<EditDialogProps> = ({
  isOpen,
  onClose,
  projectName,
  editName,
  setEditName,
  onSave,
  isSaving,
}) => (
  <Dialog isOpen={isOpen} onClose={onClose}>
    <h2>更改專案名稱</h2>
    <Input
      value={editName}
      onChange={(e) => setEditName(e.target.value)}
      placeholder={projectName}
    />
    <ButtonWrapper>
      <Button $variant="outlined" onClick={onClose}>
        取消
      </Button>
      <Button onClick={onSave} disabled={isSaving}>
        {isSaving ? "保存中..." : "保存"}
      </Button>
    </ButtonWrapper>
  </Dialog>
);

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  onClose,
  projectName,
  onDelete,
  inputValue,
  setInputValue,
  isDeleteEnabled,
}) => (
  <Dialog isOpen={isOpen} onClose={onClose}>
    <Title>確認刪除</Title>
    <Description>此項目將被刪除，包括所有相關的設置。</Description>
    <Warning>警告：此操作不可撤銷，請確認您確定要執行此操作。</Warning>
    <Input
      type="text"
      placeholder={`請輸入網站名稱 ${projectName} 以繼續：`}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
    />
    <p>確定要刪除 "{projectName}" 嗎？</p>
    <ButtonWrapper>
      <Button $variant="outlined" onClick={onClose}>
        取消
      </Button>
      <Button onClick={onDelete} disabled={!isDeleteEnabled}>
        確認刪除
      </Button>
    </ButtonWrapper>
  </Dialog>
);

export { EditDialog, DeleteDialog };
