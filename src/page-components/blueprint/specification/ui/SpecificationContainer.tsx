"use client";

import { useState } from "react";
import { DocumentDetailViewContainer } from "@/shared/view/document-detail-view";
import { SpecificationData } from "../model";
import { specificationData as initialSpecificationData } from "../data";
import { createSpecificationDetailConfig } from "../lib";

export function SpecificationContainer() {
  const [specifications] = useState<SpecificationData[]>(initialSpecificationData as SpecificationData[]);
  const config = createSpecificationDetailConfig();

  return (
    <DocumentDetailViewContainer
      data={specifications}
      config={config}
    />
  );
}