"use client";

import { useState } from "react";
import { DocumentDetailViewContainer } from "@/shared/view/document-detail-view";
import { BlueprintSpecificationDataInterface, blueprintSpecificationData } from "@/dummy-data/blueprint";
import { createSpecificationDetailConfig } from "../lib";

export function SpecificationContainer() {
  const [specifications] = useState<BlueprintSpecificationDataInterface[]>(blueprintSpecificationData as BlueprintSpecificationDataInterface[]);
  const config = createSpecificationDetailConfig();

  return (
    <DocumentDetailViewContainer
      data={specifications}
      config={config}
    />
  );
}