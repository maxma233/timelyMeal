import { useState, useMemo } from 'react';
import { View } from 'react-native';

import { PlanGenerationContext } from '../Context/PlanGenerationContext';
import { planGeneratorStyles } from '../../lib/styles/plan_generation_styles';
import { PlanGenerationProps } from '../../lib/types/plan_generation_types';
import { GeneratingPlanToast } from '../Context/PlanGenerationContext';


export function PlanGenerationProvider({ children }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFloatingToast, setShowFloatingToast] = useState(false);

  const value: PlanGenerationProps = useMemo(
    () => ({
      isGenerating,
      setIsGenerating,
      showFloatingToast,
      setShowFloatingToast,
    }),
    [isGenerating, showFloatingToast],
  );

  return (
    <PlanGenerationContext.Provider value={value} >
      <View style={planGeneratorStyles.childContainer}> {children} </View>
      < GeneratingPlanToast isVisible={isGenerating && showFloatingToast} />
    </PlanGenerationContext.Provider>
  );
}
