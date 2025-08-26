"use client";
import { useState } from "react";
import { StepIndicator, Button, ResizableLayout, ResizablePanel, ResizableHandle } from "@/shared";
import { quotationResizableLayoutConfig } from "../lib";
import { FormData } from "../model";
import { QuotationPreview, QuotationProjectInfoStep, QuotationBlueprintInfoStep, QuotationCompanyInfoStep } from "../ui";

export function QuotationContainer() {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const steps = [
    { id: 1, title: "案件情報入力" },
    { id: 2, title: "図面別見積もり" },
    { id: 3, title: "自社情報確認" }
  ];

  const [formData, setFormData] = useState<FormData>({
    clientName: "",
    honorific: "御中",
    quotationNumber: "",
    issueDate: "",
    validUntil: "",
    tableRows: [{
      id: "1",
      productName: "",
      unitPrice: "",
      quantity: "",
      unit: "",
      taxRate: "",
      detail: "",
    }],
    remarks: "",
    companyInfo: {
      name: "株式会社STAR UP",
      phone: "080-4760-5129",
      address: "〒602-8061 京都府京都市上京区甲斐守町97西陣産業創造會館109"
    }
  });

  return (
    <ResizableLayout config={quotationResizableLayoutConfig} className="h-full">
      <ResizablePanel index={0}>
        <div className="h-full overflow-hidden flex flex-col">
          <div className="p-4">
            <StepIndicator 
              steps={steps} 
              currentStep={currentStep}
            />
          </div>
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-auto">
              {currentStep === 1 && <QuotationProjectInfoStep formData={formData} setFormData={setFormData} />}
              {currentStep === 2 && <QuotationBlueprintInfoStep formData={formData} setFormData={setFormData} />}
              {currentStep === 3 && <QuotationCompanyInfoStep formData={formData} setFormData={setFormData} />}
            </div>
            <div className="p-4">
              <div className="flex justify-between">
                <Button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  variant="outline"
                >
                  前へ
                </Button>
                <Button
                  onClick={nextStep}
                  disabled={currentStep === steps.length}
                >
                  {currentStep === steps.length ? '完了' : '次へ'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ResizablePanel>
      
      <ResizableHandle />
      
      <ResizablePanel index={1}>
        <div className="h-full overflow-hidden">
          <QuotationPreview formData={formData} />
        </div>
      </ResizablePanel>
    </ResizableLayout>
  );
}