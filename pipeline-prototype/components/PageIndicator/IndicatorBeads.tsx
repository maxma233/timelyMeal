import React, { useContext } from "react";
import {
    Animated,
    StyleSheet,
    View,
    ViewStyle,
    ViewProps,
    Pressable,
} from "react-native";
// import { LocationContext } from "../QuestionnaireWindow";

interface IndicatorProps extends ViewProps {
    gap: number;
    size: number;
    color: string;
    index: number;
    scale: number;
    opacity: number;
    vertical: boolean;
    activeColor: string;
    borderRadius: number;
    animatedValue: Animated.Value | ReturnType<Animated.Value["interpolate"]>;
}

const IndicatorBeads = ({
    gap,
    size,
    color,
    index,
    scale,
    opacity,
    vertical,
    activeColor,
    borderRadius,
    animatedValue,
}: IndicatorProps) => {

    // const { locationVal, setLocationVal } = useContext(LocationContext);

    const overlay = activeColor !== color;

    const rootStyles: ViewStyle = {
        [vertical ? "marginVertical" : "marginHorizontal"]: gap / 2,
    };

    const scaleTransform = animatedValue.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [1, scale, 1],
        extrapolate: "clamp",
    });

    const baseStyles: Animated.AnimatedProps<ViewStyle> = {
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: borderRadius,
        transform: [{ scale: scaleTransform }],
        opacity: animatedValue.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [opacity, overlay ? 0 : 1, opacity],
            extrapolate: "clamp",
        }),
    };

    const overlayStyles: Animated.AnimatedProps<ViewStyle> = {
        ...baseStyles,
        ...StyleSheet.absoluteFillObject,
        backgroundColor: activeColor,
        opacity: animatedValue.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [0, 1, 0],
            extrapolate: "clamp",
        }),
    };

    return (
        // <Pressable onPress={() => setLocationVal(index)}>
            <View style={rootStyles}>
                <Animated.View style={baseStyles} />
                {overlay && <Animated.View style={overlayStyles} />}
            </View>
        // </Pressable>
    );
};

export default React.memo(IndicatorBeads);
