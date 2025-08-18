export interface RelatedBlueprint {
  id: string;
  name: string;
  filename: string;
  status: 'completed' | 'in_progress' | 'pending';
  imageUrl: string;
  isActive: boolean;
}

export interface RelatedBlueprintsData {
  projectId: string;
  projectName: string;
  relatedBlueprints: RelatedBlueprint[];
}