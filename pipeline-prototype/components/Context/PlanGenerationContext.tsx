import React, { createContext, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { planGeneratorStyles } from '../../lib/styles/plan_generation_styles';
import { PlanGenerationProps } from '../../lib/types/plan_generation_types'

export const PlanGenerationContext = createContext({
  isGenerating: false,
  setIsGenerating: () => { },
  showFloatingToast: false,
  setShowFloatingToast: () => { },
} as PlanGenerationProps);

export function GeneratingPlanToast({ isVisible }) {
  const steamAnim = useRef(new Animated.Value(0)).current;
  const bowlAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  // note from dev: AI gen animation, review
  useEffect(() => {
    if (!isVisible) {
      steamAnim.stopAnimation();
      bowlAnim.stopAnimation();
      floatAnim.stopAnimation();
      steamAnim.setValue(0);
      bowlAnim.setValue(0);
      floatAnim.setValue(0);
      return;
    }

    const steamLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(steamAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(steamAnim, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );

    const bowlLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(bowlAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(bowlAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );

    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    );

    steamLoop.start();
    bowlLoop.start();
    floatLoop.start();

    return () => {
      steamLoop.stop();
      bowlLoop.stop();
      floatLoop.stop();
    };
  }, [isVisible, steamAnim, bowlAnim, floatAnim]);

  if (!isVisible) {
    return null;
  }

  const steamOpacity = steamAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 1],
  });

  const steamTranslateY = steamAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [26, 0],
  });

  const bowlScale = bowlAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });

  const labelOpacity = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.8],
  });

  return (
    <View style={planGeneratorStyles.toastContainer} pointerEvents="box-none">
      <Animated.View
        style={[
          planGeneratorStyles.toast,
          {
            opacity: labelOpacity,
            transform: [{
              translateY: floatAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -4],
              })
            }],
          },
        ]}
      >
        <View style={planGeneratorStyles.foodIllustration}>
          <Animated.View
            style={[
              planGeneratorStyles.steam,
              {
                opacity: steamOpacity,
                transform: [{ translateY: steamTranslateY }],
              },
            ]}
          />
          <Animated.View style={[planGeneratorStyles.bowl, { transform: [{ scale: bowlScale }] }]}>
            <View style={planGeneratorStyles.liquid} />
          </Animated.View>
        </View>
        <View style={planGeneratorStyles.textGroup}>
          <Text style={planGeneratorStyles.toastTitle}>Generating your plan</Text>
          <Text style={planGeneratorStyles.toastSubtitle}>Hang tight while we cook up your favorites.</Text>
        </View>
      </Animated.View>
    </View>
  );
}
