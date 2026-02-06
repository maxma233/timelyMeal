export interface PlanGenerationProps {
  isGenerating: boolean;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  showFloatingToast: boolean;
  setShowFloatingToast: React.Dispatch<React.SetStateAction<boolean>>;
}
