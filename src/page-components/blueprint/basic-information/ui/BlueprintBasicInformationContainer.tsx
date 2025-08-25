"use client";
import React from "react";
import { BlueprintDetailLayout, blueprintData, BasicInformationForm } from "@/widgets";

export function BlueprintBasicInformationContainer() {
  return (
    <BlueprintDetailLayout>
      <BasicInformationForm 
        initialData={blueprintData.basicInformation || {}}
      />
    </BlueprintDetailLayout>
  );
}