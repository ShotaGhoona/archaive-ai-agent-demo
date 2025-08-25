"use client";
import React from "react";
import { Button, Input } from "@/shared";
import { Save } from "lucide-react";
import { BasicInformationFormProps } from "../model";
import { basicInputFields, useBasicInformationForm } from "../lib";

export function BasicInformationForm({ initialData, onSave, className = "" }: BasicInformationFormProps) {
  const { formData, isModified, handleInputChange, handleSave } = useBasicInformationForm(initialData);

  const onSaveClick = () => {
    handleSave(onSave);
  };

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {basicInputFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {field.label}
              </label>
              <Input
                value={formData[field.key] || ''}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                readOnly={field.readOnly}
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t">
        <Button
          onClick={onSaveClick}
          disabled={!isModified}
          className="w-full gap-2"
          variant={isModified ? "default" : "outline"}
        >
          <Save className="h-4 w-4" />
          基本情報を保存
        </Button>
      </div>
    </div>
  );
}