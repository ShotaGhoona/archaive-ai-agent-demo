export interface BlueprintFile {
  id: string;
  name: string;
  description: string;
  size: number;
  type: string;
  imageUrl: string;
  createdAt: string;
  isActive?: boolean;
}

export interface BlueprintView {
  id: string;
  name: string;
  description: string;
  viewType: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
}