import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';

const ListTransition = props => {

    // const animatedValue = useRef(new Animated.Value(0)).current;
    // const currentX = useRef(new Animated.Value(0)).current;
    // const endX = 150;

    const listTransitionHeight = -150 - props.listHeight;
    console.log(listTransitionHeight);

    const currentY = useRef(new Animated.Value(listTransitionHeight)).current;
    const endY = 0;

    console.log(currentY);
    console.log(props);

    useEffect(() => {
        Animated.timing(currentY, {
            toValue: endY,
            duration: 2000,
            useNativeDriver: true,
        }).start();
    }, [currentY]);

    return (
        <Animated.View // Special animatable View
            style={{
                ...props.style,
                // left: currentX,
                bottom: currentY,
            }}>
            {props.children}
        </Animated.View>
    );
};

export default ListTransition;
