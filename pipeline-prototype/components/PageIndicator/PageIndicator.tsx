import React, { useEffect, useRef, useContext } from 'react';
import {
  Animated,
  Easing,
  EasingFunction,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { LocationContext } from '../QuestionnaireWindow';

import { clamp, evenPixelRound } from './helpers';
import IndicatorMorse from './IndicatorMorse';
import IndicatorBeads from './IndicatorBeads';
import IndicatorTrain from './IndicatorTrain';

import { BeadThemeContext } from '../QuestionnaireWindow';

enum Variants {
  MORSE = 'morse',
  BEADS = 'beads',
  TRAIN = 'train',
}

export interface PageIndicatorProps extends ViewProps {
  count: number;
  variant?: `${Variants}`;
  current?: number | Animated.Value | ReturnType<Animated.Value['interpolate']>;
  gap?: number;
  size?: number;
  color?: string;
  scale?: number;
  opacity?: number;
  dashSize?: number;
  duration?: number;
  vertical?: boolean;
  activeColor?: string;
  borderRadius?: number;
  easing?: EasingFunction;

  beadReferences: any[];
}

export const PageIndicator = ({
  count,
  variant = Variants.BEADS,
  current = 0,
  gap = 20,
  size = 10,
  color = 'black',
  scale = 1.5,
  opacity = 0.5,
  dashSize,
  duration = 500,
  vertical = false,
  activeColor = color,
  borderRadius,
  easing = Easing.out(Easing.cubic),
  style,
  ...props
}: PageIndicatorProps) => {

  const { locationVal, setLocationVal } = useContext(LocationContext);
  const { indicatorBeads } = useContext(BeadThemeContext);
  console.dir(indicatorBeads);

  const pixelSize = evenPixelRound(size);
  const pixelDashSize = evenPixelRound(dashSize ?? pixelSize * 4);
  const pixelBorderRadius = clamp(borderRadius ?? pixelSize / 2, 0, pixelSize / 2);

  const shouldAnimate = typeof current === 'number';
  const flexDirection = vertical ? 'column' : 'row';
  const animatedValue = useRef(
    shouldAnimate ? new Animated.Value(clamp(current, 0, count)) : current,
  ).current;

  useEffect(() => {
    if (shouldAnimate) {
      Animated.timing(animatedValue as Animated.Value, {
        toValue: clamp(current, 0, count),
        duration,
        easing,
        useNativeDriver: true,
      }).start();
    }
  }, [shouldAnimate, animatedValue, current, count, duration, easing]);

  const trainDashSize = Math.max(pixelDashSize, pixelSize);
  const morseDashSize = Math.max(pixelDashSize, pixelSize * 2);
  const rootStyle: StyleProp<ViewStyle> = [styles.root, style, { flexDirection }];

  if (variant === Variants.MORSE) {
    rootStyle.push({
      [vertical ? 'height' : 'width']: morseDashSize + pixelSize * (count - 1) + gap * count,
    });
  }

  return (
    <View {...props} style={rootStyle}>
      {[...Array(count).keys()].map((index) =>
        {
          const component = 
            (
              variant === Variants.BEADS ? (
                <Pressable style={{ zIndex: 50 }} key={index} onPress={() => {setLocationVal(index)}} >
                  <IndicatorBeads
                    // key={index}
                    gap={gap}
                    size={pixelSize}
                    color={indicatorBeads[index]}
                    index={index}
                    scale={scale}
                    vertical={vertical}
                    activeColor={indicatorBeads[index]}
                    opacity={clamp(opacity, 0, 1)}
                    borderRadius={pixelBorderRadius}
                    animatedValue={animatedValue}
                  />
                </Pressable>
              ) : variant === Variants.TRAIN ? (
                <IndicatorTrain
                  key={index}
                  gap={gap}
                  size={size}
                  color={color}
                  index={index}
                  vertical={vertical}
                  activeColor={activeColor}
                  dashSize={trainDashSize}
                  opacity={clamp(opacity, 0, 1)}
                  borderRadius={pixelBorderRadius}
                  animatedValue={animatedValue}
                />
              ) : (
                <IndicatorMorse
                  key={index}
                  gap={gap}
                  size={pixelSize}
                  color={color}
                  count={count}
                  index={index}
                  vertical={vertical}
                  activeColor={activeColor}
                  dashSize={morseDashSize}
                  opacity={clamp(opacity, 0, 1)}
                  borderRadius={pixelBorderRadius}
                  animatedValue={animatedValue}
                />
              )
            )
          return component;
        }
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
