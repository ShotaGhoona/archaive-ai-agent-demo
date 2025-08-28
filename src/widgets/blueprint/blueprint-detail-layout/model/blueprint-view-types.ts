export interface BlueprintView {
  id: string;
  name: string;
  description: string;
  viewType: "front" | "side" | "top" | "section" | "detail" | "annotated";
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
}