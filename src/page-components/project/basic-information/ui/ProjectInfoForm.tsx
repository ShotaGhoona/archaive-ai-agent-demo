"use client";
import { Clock } from "lucide-react";
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/shared/shadcnui";
import { SectionConfig, FieldConfig, ProjectData } from "../data";

interface FormFieldProps {
  field: FieldConfig;
  value: string;
  onChange: (key: keyof ProjectData, value: string) => void;
}

function FormField({ field, value, onChange }: FormFieldProps) {
  const handleChange = (newValue: string) => {
    if (!field.locked) {
      onChange(field.key, newValue);
    }
  };

  const renderField = () => {
    const isDisabled = field.locked;
    
    switch (field.type) {
      case 'input':
        return (
          <Input
            type={field.inputType || 'text'}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={isDisabled}
            className={isDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          />
        );
      
      case 'select':
        return (
          <Select
            value={value}
            onValueChange={handleChange}
            disabled={isDisabled}
          >
            <SelectTrigger className={`w-full ${isDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'textarea':
        return (
          <Textarea
            value={value || ""}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows}
            disabled={isDisabled}
            className={isDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">
        {field.label}
      </Label>
      {renderField()}
    </div>
  );
}

interface FormSectionProps {
  section: SectionConfig;
  data: ProjectData;
  onChange: (key: keyof ProjectData, value: string) => void;
}

function FormSection({ section, data, onChange }: FormSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
      <div className="grid grid-cols-12 gap-4">
        {section.fields.map((field) => (
          <div 
            key={field.key} 
            style={{ gridColumn: `span ${field.spanCol}` }}
          >
            <FormField
              field={field}
              value={data[field.key] as string}
              onChange={onChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

interface ProjectInfoFormProps {
  formData: ProjectData;
  fieldConfig: SectionConfig[];
  onChange: (key: keyof ProjectData, value: string) => void;
}

export default function ProjectInfoForm({ formData, fieldConfig, onChange }: ProjectInfoFormProps) {
  return (
    <div className="border-r bg-white flex flex-col">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* 動的にセクションを生成 */}
        {fieldConfig.map((section, index) => (
          <FormSection 
            key={index}
            section={section}
            data={formData}
            onChange={onChange}
          />
        ))}
      </div>
      
      {/* 更新履歴 - 下部固定 */}
      <div className="border-t bg-gray-50 p-4">
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900 flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            更新履歴
          </h3>
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">作成者:</span>
              <span className="font-medium">{formData.lastUpdatedBy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">作成日時:</span>
              <span className="font-medium">
                {new Date(formData.lastUpdatedAt).toLocaleDateString('ja-JP')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">最終更新者:</span>
              <span className="font-medium">{formData.lastUpdatedBy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">最終更新日時:</span>
              <span className="font-medium">
                {new Date(formData.lastUpdatedAt).toLocaleDateString('ja-JP')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}