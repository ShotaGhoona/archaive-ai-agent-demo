import { UploadedFile, FileStack, FileUploadData } from '../model';

/**
 * ファイル操作のビジネスロジック
 *
 * 含まれる機能:
 * - ファイル追加 (addFiles)
 * - ファイル削除・ゴミ箱移動 (removeFile, removeSelectedFiles)
 * - ゴミ箱からの復元 (restoreFile, restoreSelectedFiles)
 * - ゴミ箱からの完全削除 (permanentlyDeleteFiles)
 * - 全選択・選択切り替え (selectAllItems, toggleSelection)
 *
 * 全てピュアな関数として実装、副作用なし
 */
export class FileOperations {
  // ファイル追加
  static addFiles(
    currentFiles: UploadedFile[],
    newFiles: FileUploadData[],
  ): UploadedFile[] {
    const filesWithId = newFiles.map((file) => ({
      ...file,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    }));

    return [...currentFiles, ...filesWithId];
  }

  // ファイル削除（ゴミ箱へ移動）
  static removeFile(
    uploadedFiles: UploadedFile[],
    trashedFiles: UploadedFile[],
    selectedFiles: string[],
    fileId: string,
  ): {
    updatedFiles: UploadedFile[];
    updatedTrashed: UploadedFile[];
    updatedSelected: string[];
  } {
    const fileToRemove = uploadedFiles.find((f) => f.id === fileId);
    if (!fileToRemove) {
      return {
        updatedFiles: uploadedFiles,
        updatedTrashed: trashedFiles,
        updatedSelected: selectedFiles,
      };
    }

    return {
      updatedFiles: uploadedFiles.filter((f) => f.id !== fileId),
      updatedTrashed: [...trashedFiles, fileToRemove],
      updatedSelected: selectedFiles.filter((fId) => fId !== fileId),
    };
  }

  // 選択ファイル一括削除
  static removeSelectedFiles(
    uploadedFiles: UploadedFile[],
    trashedFiles: UploadedFile[],
    fileStacks: FileStack[],
    selectedFiles: string[],
    selectedStacks: string[],
  ): {
    updatedFiles: UploadedFile[];
    updatedTrashed: UploadedFile[];
    updatedStacks: FileStack[];
  } {
    const filesToRemove = uploadedFiles.filter((f) =>
      selectedFiles.includes(f.id),
    );
    const stacksToRemove = fileStacks.filter((s) =>
      selectedStacks.includes(s.id),
    );
    const stackFilesToRemove = stacksToRemove.flatMap((s) => s.files);
    const allFilesToRemove = [...filesToRemove, ...stackFilesToRemove];

    return {
      updatedFiles: uploadedFiles.filter((f) => !selectedFiles.includes(f.id)),
      updatedStacks: fileStacks.filter((s) => !selectedStacks.includes(s.id)),
      updatedTrashed: [...trashedFiles, ...allFilesToRemove],
    };
  }

  // ゴミ箱ファイル完全削除
  static permanentlyDeleteFiles(
    trashedFiles: UploadedFile[],
    selectedFiles: string[],
  ): UploadedFile[] {
    return trashedFiles.filter((f) => !selectedFiles.includes(f.id));
  }

  // ファイル復元
  static restoreFile(
    uploadedFiles: UploadedFile[],
    trashedFiles: UploadedFile[],
    selectedFiles: string[],
    fileId: string,
  ): {
    updatedFiles: UploadedFile[];
    updatedTrashed: UploadedFile[];
    updatedSelected: string[];
  } {
    const fileToRestore = trashedFiles.find((f) => f.id === fileId);
    if (!fileToRestore) {
      return {
        updatedFiles: uploadedFiles,
        updatedTrashed: trashedFiles,
        updatedSelected: selectedFiles,
      };
    }

    return {
      updatedFiles: [...uploadedFiles, fileToRestore],
      updatedTrashed: trashedFiles.filter((f) => f.id !== fileId),
      updatedSelected: selectedFiles.filter((fId) => fId !== fileId),
    };
  }

  // 選択ファイル一括復元
  static restoreSelectedFiles(
    uploadedFiles: UploadedFile[],
    trashedFiles: UploadedFile[],
    selectedFiles: string[],
  ): {
    updatedFiles: UploadedFile[];
    updatedTrashed: UploadedFile[];
  } {
    const filesToRestore = trashedFiles.filter((f) =>
      selectedFiles.includes(f.id),
    );

    return {
      updatedFiles: [...uploadedFiles, ...filesToRestore],
      updatedTrashed: trashedFiles.filter((f) => !selectedFiles.includes(f.id)),
    };
  }

  // 全選択処理
  static selectAllItems(
    uploadedFiles: UploadedFile[],
    trashedFiles: UploadedFile[],
    fileStacks: FileStack[],
    viewMode: 'uploaded' | 'trash',
  ): {
    selectedFiles: string[];
    selectedStacks: string[];
  } {
    if (viewMode === 'uploaded') {
      return {
        selectedFiles: uploadedFiles.map((f) => f.id),
        selectedStacks: fileStacks.map((s) => s.id),
      };
    } else {
      return {
        selectedFiles: trashedFiles.map((f) => f.id),
        selectedStacks: [],
      };
    }
  }

  // 選択切り替え
  static toggleSelection(currentSelected: string[], itemId: string): string[] {
    return currentSelected.includes(itemId)
      ? currentSelected.filter((id) => id !== itemId)
      : [...currentSelected, itemId];
  }
}
