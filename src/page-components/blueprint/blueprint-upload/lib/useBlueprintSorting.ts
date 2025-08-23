import { useState, useCallback } from 'react';
import { BlueprintSortingState, ProjectAssignment, BlueprintProject, UploadedFile, FileStack, DragItem } from '../model';

export function useBlueprintSorting() {
  const [state, setState] = useState<BlueprintSortingState>({
    files: [],
    fileStacks: [],
    projects: [],
    assignments: [],
    selectedFiles: [],
    selectedStacks: [],
    trashedFiles: []
  });

  // プロジェクトに割り当て済みの図面IDを取得
  const getAssignedFileIds = useCallback(() => {
    return new Set(state.assignments.map(a => a.fileId));
  }, [state.assignments]);

  // 未割り当ての図面を取得
  const getUnassignedFiles = useCallback(() => {
    const assignedIds = getAssignedFileIds();
    return state.files.filter(file => !assignedIds.has(file.id));
  }, [state.files, getAssignedFileIds]);

  // プロジェクトに割り当てられた図面を取得
  const getProjectFiles = useCallback((projectId: string) => {
    const projectAssignments = state.assignments.filter(a => a.projectId === projectId);
    const fileIds = projectAssignments.map(a => a.fileId);
    return state.files.filter(file => fileIds.includes(file.id));
  }, [state.files, state.assignments]);

  // 新しいプロジェクトを作成
  const createProject = useCallback((files: UploadedFile[]) => {
    const projectId = `project-${Date.now()}`;
    const projectCount = state.projects.length + 1;
    
    const newProject: BlueprintProject = {
      id: projectId,
      name: `案件${projectCount}`,
      fileCount: files.length,
      createdAt: new Date()
    };

    const newAssignments: ProjectAssignment[] = files.map(file => ({
      fileId: file.id,
      projectId: projectId,
      assignedAt: new Date()
    }));

    setState(prev => ({
      ...prev,
      projects: [newProject, ...prev.projects], // 最新を上に（LIFO）
      assignments: [...prev.assignments, ...newAssignments]
    }));

    return projectId;
  }, [state.projects.length]);

  // 既存プロジェクトに図面を追加
  const addFilesToProject = useCallback((projectId: string, files: UploadedFile[]) => {
    const newAssignments: ProjectAssignment[] = files.map(file => ({
      fileId: file.id,
      projectId: projectId,
      assignedAt: new Date()
    }));

    setState(prev => ({
      ...prev,
      assignments: [...prev.assignments, ...newAssignments],
      projects: prev.projects.map(project => 
        project.id === projectId 
          ? { ...project, fileCount: project.fileCount + files.length }
          : project
      )
    }));
  }, []);

  // プロジェクトから図面を削除
  const removeFilesFromProject = useCallback((projectId: string, fileIds: string[]) => {
    setState(prev => ({
      ...prev,
      assignments: prev.assignments.filter(a => 
        !(a.projectId === projectId && fileIds.includes(a.fileId))
      ),
      projects: prev.projects.map(project => 
        project.id === projectId 
          ? { ...project, fileCount: Math.max(0, project.fileCount - fileIds.length) }
          : project
      )
    }));
  }, []);

  // ドラッグアイテムから図面リストを取得
  const getFilesFromDragItem = useCallback((dragItem: DragItem): UploadedFile[] => {
    if (dragItem.type === 'file') {
      return dragItem.files;
    } else {
      // stack の場合
      const stack = state.fileStacks.find(s => s.id === dragItem.id);
      return stack ? stack.files : [];
    }
  }, [state.fileStacks]);

  // ドロップ処理：新プロジェクト作成
  const handleDropToNewProject = useCallback((dragItem: DragItem) => {
    const files = getFilesFromDragItem(dragItem);
    if (files.length === 0) return;

    // 既存のプロジェクトから図面を削除
    const fileIds = files.map(f => f.id);
    state.projects.forEach(project => {
      const projectFileIds = getProjectFiles(project.id).map(f => f.id);
      const filesToRemove = fileIds.filter(id => projectFileIds.includes(id));
      if (filesToRemove.length > 0) {
        removeFilesFromProject(project.id, filesToRemove);
      }
    });

    // 新しいプロジェクトを作成
    createProject(files);

    // スタックをドロップした場合はスタックを削除
    if (dragItem.type === 'stack') {
      setState(prev => ({
        ...prev,
        fileStacks: prev.fileStacks.filter(stack => stack.id !== dragItem.id),
        selectedStacks: prev.selectedStacks.filter(id => id !== dragItem.id)
      }));
    }

    // 選択状態をクリア
    setState(prev => ({
      ...prev,
      selectedFiles: prev.selectedFiles.filter(id => !fileIds.includes(id))
    }));
  }, [getFilesFromDragItem, getProjectFiles, removeFilesFromProject, createProject, state.projects]);

  // ドロップ処理：既存プロジェクトに追加
  const handleDropToProject = useCallback((dragItem: DragItem, targetProjectId: string) => {
    const files = getFilesFromDragItem(dragItem);
    if (files.length === 0) return;

    // 既存のプロジェクトから図面を削除（元の場所から移動）
    const fileIds = files.map(f => f.id);
    state.projects.forEach(project => {
      if (project.id === targetProjectId) return; // 移動先は除外
      
      const projectFileIds = getProjectFiles(project.id).map(f => f.id);
      const filesToRemove = fileIds.filter(id => projectFileIds.includes(id));
      if (filesToRemove.length > 0) {
        removeFilesFromProject(project.id, filesToRemove);
      }
    });

    // ターゲットプロジェクトに図面を追加
    addFilesToProject(targetProjectId, files);

    // スタックをドロップした場合はスタックを削除
    if (dragItem.type === 'stack') {
      setState(prev => ({
        ...prev,
        fileStacks: prev.fileStacks.filter(stack => stack.id !== dragItem.id),
        selectedStacks: prev.selectedStacks.filter(id => id !== dragItem.id)
      }));
    }

    // 選択状態をクリア
    setState(prev => ({
      ...prev,
      selectedFiles: prev.selectedFiles.filter(id => !fileIds.includes(id))
    }));
  }, [getFilesFromDragItem, getProjectFiles, removeFilesFromProject, addFilesToProject, state.projects]);

  // プロジェクト名を更新
  const updateProjectName = useCallback((projectId: string, name: string) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(project => 
        project.id === projectId ? { ...project, name } : project
      )
    }));
  }, []);

  // プロジェクトを削除
  const deleteProject = useCallback((projectId: string) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== projectId),
      assignments: prev.assignments.filter(a => a.projectId !== projectId)
    }));
  }, []);

  // 基本的な状態更新メソッド
  const updateFiles = useCallback((files: UploadedFile[]) => {
    setState(prev => ({ ...prev, files }));
  }, []);

  const updateFileStacks = useCallback((fileStacks: FileStack[]) => {
    setState(prev => ({ ...prev, fileStacks }));
  }, []);

  const updateSelectedFiles = useCallback((selectedFiles: string[]) => {
    setState(prev => ({ ...prev, selectedFiles }));
  }, []);

  const updateSelectedStacks = useCallback((selectedStacks: string[]) => {
    setState(prev => ({ ...prev, selectedStacks }));
  }, []);

  const updateTrashedFiles = useCallback((trashedFiles: UploadedFile[]) => {
    setState(prev => ({ ...prev, trashedFiles }));
  }, []);

  return {
    state,
    // 計算済みデータ
    getUnassignedFiles,
    getProjectFiles,
    getAssignedFileIds,
    // プロジェクト操作
    createProject,
    addFilesToProject,
    removeFilesFromProject,
    updateProjectName,
    deleteProject,
    // ドラッグ&ドロップ
    handleDropToNewProject,
    handleDropToProject,
    getFilesFromDragItem,
    // 基本的な状態更新
    updateFiles,
    updateFileStacks,
    updateSelectedFiles,
    updateSelectedStacks,
    updateTrashedFiles,
  };
}