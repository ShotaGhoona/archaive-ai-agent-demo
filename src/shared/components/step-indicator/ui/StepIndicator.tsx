import { Check } from "lucide-react";
import { cn } from "@/shared";
import { StepIndicatorProps } from "../model";

export function StepIndicator({
  steps,
  currentStep,
  className,
}: StepIndicatorProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between w-full">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isUpcoming = currentStep < step.id;

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-initial">
              {/* ステップアイコンとタイトル */}
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <div
                  className={cn(
                    "flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 text-xs sm:text-sm font-medium transition-colors flex-shrink-0",
                    {
                      "border-green-500 bg-green-500 text-white": isCompleted,
                      "border-primary bg-primary text-white": isCurrent,
                      "border-white bg-white text-gray-500": isUpcoming,
                    },
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-3 w-3 sm:h-5 sm:w-5" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>

                {/* ステップタイトル */}
                <div
                  className={cn(
                    "text-xs sm:text-sm font-bold transition-colors",
                    "hidden sm:block", // スマホでは非表示
                    {
                      "text-green-600": isCompleted,
                      "text-primary": isCurrent,
                      "text-gray-500": isUpcoming,
                    },
                  )}
                >
                  {step.title}
                </div>
              </div>

              {/* 接続線 */}
              {index < steps.length - 1 && (
                <div
                  className={cn("flex-1 h-0.5 mx-2 sm:mx-4 transition-colors", {
                    "bg-green-500": currentStep > step.id,
                    "bg-gray-300": currentStep <= step.id,
                  })}
                />
              )}
            </div>
          );
        })}
      </div>
      
      {/* スマホ用の現在のステップタイトル表示 */}
      <div className="mt-2 text-center sm:hidden">
        <div className="text-xs font-medium text-gray-600">
          {steps.find(step => step.id === currentStep)?.title || ""}
        </div>
      </div>
    </div>
  );
}