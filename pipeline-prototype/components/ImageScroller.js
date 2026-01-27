import React, { useEffect, useRef, useState } from "react";
import { Image, Platform, ScrollView, StyleSheet, View } from "react-native";
import { Pressable } from "react-native";

let AutoScroll = null;
if (Platform.OS !== 'web') {
    // AutoScroll is not reliably supported on web
    AutoScroll = require('@homielab/react-native-auto-scroll').default;
}

const IMAGE_SOURCES = [require('./../assets/burger.png'),
require('./../assets/friedChicken.png'),
require('./../assets/pasta.png'),
require('./../assets/pizza.png'),
require('./../assets/ramen.png'),
require('./../assets/sandwich.png'),
require('./../assets/sushi.png'),
require('./../assets/tacos.png'),
require('./../assets/steak.webp'),
require('./../assets/cocktail.jpeg'),
];

const IMAGE_NAMES = ['burger', 'friedChicken', 'pasta', 'pizza', 'ramen', 'sandwich', 'sushi', 'tacos', 'steak', 'cocktail'];
const IMAGE_SOURCES_2 = [...IMAGE_SOURCES];
const IMAGE_NAMES_2 = [...IMAGE_NAMES];

const DEFAULT_DELAY = 8000;


function ImageScroller() {
    const [shuffleToggle, setShuffleToggle] = useState(false);

    const scrollRef = useRef(null);
    const contentWidthRef = useRef(0);
    const viewportWidthRef = useRef(0);
    const scrollXRef = useRef(0);


    useEffect(() => {
        const reshuffle = () => {
            imageShuffler(
                shuffleToggle ? IMAGE_SOURCES_2 : IMAGE_SOURCES,
                shuffleToggle ? IMAGE_NAMES_2 : IMAGE_NAMES
            );
        }

        const timeoutId = setTimeout(() => setShuffleToggle(!shuffleToggle), DEFAULT_DELAY);
        reshuffle();

        if (IMAGE_NAMES[0] === IMAGE_NAMES_2[IMAGE_NAMES_2.length - 1] || IMAGE_NAMES_2[0] === IMAGE_NAMES[IMAGE_NAMES.length - 1])
            reshuffle();


        return () => clearTimeout(timeoutId);
    }, [shuffleToggle])

    useEffect(() => {
        if (Platform.OS !== 'web') return;

        const intervalMs = 16;
        const stepPx = 1; // ~60px/sec

        const id = setInterval(() => {
            const maxX = Math.max(0, contentWidthRef.current - viewportWidthRef.current);
            if (!scrollRef.current || maxX <= 0) return;

            scrollXRef.current += stepPx;
            if (scrollXRef.current > maxX) scrollXRef.current = 0;

            scrollRef.current.scrollTo({ x: scrollXRef.current, animated: false });
        }, intervalMs);

        return () => clearInterval(id);
    }, []);



    const loadImageList = () => {
        return (
            <View style={{ display: 'flex', flexDirection: 'row', borderTopWidth: 4, borderBottomWidth: 4, borderColor: '#000' }}>
                {/* First Scroller */}
                {IMAGE_SOURCES.map((item, index) => {
                    return (
                        <View key={index}>
                            <FoodImage
                                name={IMAGE_NAMES[index]}
                                item={item}
                                index={index}>
                            </FoodImage>

                        </View>
                    );

                })}
                {/* Second Scroller */}
                {IMAGE_SOURCES_2.map((item, index) => {
                    return (
                        <View key={index}>
                            <FoodImage
                                name={IMAGE_NAMES_2[index]}
                                item={item}
                                index={index}>
                            </FoodImage>

                        </View>
                    );

                })}

            </View>

        );
    };

    const imageShuffler = (imageSRC, imageName) => {
        for (let i = imageSRC.length - 1; i >= 1; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [imageSRC[i], imageSRC[j]] = [imageSRC[j], imageSRC[i]];
            [imageName[i], imageName[j]] = [imageName[j], imageName[i]];
        }
    }

    const imageList = loadImageList();

    /* Component returns */
    if (Platform.OS === 'web' || !AutoScroll) {
        return (
            <ScrollView
                ref={scrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                onContentSizeChange={(w) => {
                    contentWidthRef.current = w;
                }}
                onLayout={(e) => {
                    viewportWidthRef.current = e?.nativeEvent?.layout?.width ?? 0;
                }}
                scrollEventThrottle={16}
            >
                {imageList}
            </ScrollView>
        );
    }

    return (
        <View>
            <AutoScroll duration={DEFAULT_DELAY * 2} delay={0} endPaddingWidth={0}>
                {imageList}
            </AutoScroll>
        </View>
    );
}


function FoodImage({ name, item, index }) {

    const DEFAULT_BORDER_COLOR = 'rgba(0, 0, 0, 0)';
    const DEFAULT_BORDER_WIDTH = 0;

    const title = name;
    const [borderColor, setBorderColor] = useState(DEFAULT_BORDER_COLOR);
    const [borderWidth, setBorderWidth] = useState(DEFAULT_BORDER_WIDTH);

    const clickHandler = (e) => {
        console.log(`Clicked on :${title}!`);
    }

    return (
        <View
            style={{ borderColor: borderColor, borderWidth: borderWidth }}
        >
            <Pressable
                onPress={clickHandler}
            // onHoverIn={() => {
            //     setBorderColor('#5c0');
            //     setBorderWidth('1px');
            // }}
            // onHoverOut={() => {
            //     setBorderColor(DEFAULT_BORDER_COLOR);
            //     setBorderWidth(DEFAULT_BORDER_WIDTH);
            // }}
            >
                <Image
                    style={styles.image}
                    source={item}
                />
            </Pressable>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
    },
    image: {
        width: 192,
        height: 150,
        marginRight: 0,
        marginLeft: 0,
        padding: 0
    },
    scrolling1: {
        width: 400,
        padding: 10,
        marginBottom: 10,
    },
    scrolling2: {
        backgroundColor: "red",
        width: 400,
        padding: 10,
        marginBottom: 10,
    },
    welcome: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        margin: 10,
    },
});

export default ImageScroller;