import { UploadedFile, FileStack } from "../model/type";

/**
 * スタック操作のビジネスロジック
 * 
 * 含まれる機能:
 * - スタック作成 (createStackFromSelection) - 複数ファイルを1つのスタックに統合
 * - スタック解除 (unstackFiles) - スタックを解除して個別ファイルに戻す
 * - スタック削除 (removeStack) - スタック内全ファイルをゴミ箱へ移動
 * - スタック選択切り替え (toggleStackSelection)
 * 
 * 全てピュアな関数として実装、副作用なし
 */
export class StackOperations {
  // ファイルをスタックに統合
  static createStackFromSelection(
    uploadedFiles: UploadedFile[],
    fileStacks: FileStack[],
    selectedFiles: string[],
    selectedStacks: string[]
  ): {
    updatedFiles: UploadedFile[];
    updatedStacks: FileStack[];
    newStackId: string;
  } {
    const totalSelectedItems = selectedFiles.length + selectedStacks.length;
    if (totalSelectedItems < 2) {
      return {
        updatedFiles: uploadedFiles,
        updatedStacks: fileStacks,
        newStackId: ""
      };
    }

    const selectedIndividualFiles = uploadedFiles.filter(f => selectedFiles.includes(f.id));
    const selectedStackFiles = fileStacks
      .filter(s => selectedStacks.includes(s.id))
      .flatMap(s => s.files);
    const allFilesToStack = [...selectedIndividualFiles, ...selectedStackFiles];

    const newStackId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newStack: FileStack = {
      id: newStackId,
      files: allFilesToStack.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
      createdAt: new Date()
    };

    return {
      updatedFiles: uploadedFiles.filter(f => !selectedFiles.includes(f.id)),
      updatedStacks: [...fileStacks.filter(s => !selectedStacks.includes(s.id)), newStack],
      newStackId
    };
  }

  // スタックを解除してファイルを個別に戻す
  static unstackFiles(
    uploadedFiles: UploadedFile[],
    fileStacks: FileStack[],
    selectedStacks: string[],
    stackId: string
  ): {
    updatedFiles: UploadedFile[];
    updatedStacks: FileStack[];
    updatedSelectedStacks: string[];
  } {
    const stackToUnstack = fileStacks.find(s => s.id === stackId);
    if (!stackToUnstack) {
      return {
        updatedFiles: uploadedFiles,
        updatedStacks: fileStacks,
        updatedSelectedStacks: selectedStacks
      };
    }

    return {
      updatedFiles: [...uploadedFiles, ...stackToUnstack.files],
      updatedStacks: fileStacks.filter(s => s.id !== stackId),
      updatedSelectedStacks: selectedStacks.filter(sId => sId !== stackId)
    };
  }

  // スタック削除（ファイルをゴミ箱へ）
  static removeStack(
    fileStacks: FileStack[],
    trashedFiles: UploadedFile[],
    selectedStacks: string[],
    stackId: string
  ): {
    updatedStacks: FileStack[];
    updatedTrashed: UploadedFile[];
    updatedSelectedStacks: string[];
  } {
    const stackToRemove = fileStacks.find(s => s.id === stackId);
    if (!stackToRemove) {
      return {
        updatedStacks: fileStacks,
        updatedTrashed: trashedFiles,
        updatedSelectedStacks: selectedStacks
      };
    }

    return {
      updatedStacks: fileStacks.filter(s => s.id !== stackId),
      updatedTrashed: [...trashedFiles, ...stackToRemove.files],
      updatedSelectedStacks: selectedStacks.filter(sId => sId !== stackId)
    };
  }

  // スタック選択切り替え
  static toggleStackSelection(
    currentSelected: string[],
    stackId: string
  ): string[] {
    return currentSelected.includes(stackId)
      ? currentSelected.filter(sId => sId !== stackId)
      : [...currentSelected, stackId];
  }
}