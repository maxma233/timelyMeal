import React, { createContext, useRef, useContext, useEffect, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { ElementContext } from './CravingWindow.js';

const DEFAULT_START_Y = 50;
const DEFAULT_ANIMATION_TIMING = 2000;

function ListTransition(props) {
    const parentContext = useContext(ElementContext);
    const currentY = useRef(new Animated.Value(0)).current;

    const listHeightOffset = -parentContext.listHeight + DEFAULT_START_Y;
    const startPosition = listHeightOffset;
    const endY = 0;

    useEffect(() => {

        const showAnimate = () => {
            Animated.timing(currentY, {
                toValue: startPosition,
                duration: DEFAULT_ANIMATION_TIMING,
                useNativeDriver: true,
            }).start();
        }

        const hideAnimate = () => {
            Animated.timing(currentY, {
                toValue: endY,
                duration: DEFAULT_ANIMATION_TIMING,
                useNativeDriver: true
            }).start();
        }

        if (!parentContext.componentLoaded) {
            return;
        }

        parentContext.toggleCart ? showAnimate() : hideAnimate();

    }, [parentContext.toggleCart]);

    return (
        <Animated.View // Special animatable View
            style={{
                ...props.style,
                // left: currentX,
                bottom: startPosition,
                transform: [{ translateY: currentY }],
            }}>
            {props.children}
        </Animated.View >
    );
};

export default ListTransition;
