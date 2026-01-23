import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import AutoScroll from "@homielab/react-native-auto-scroll";
import { Pressable } from "react-native";

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


    useEffect(() => {
        const reshuffle = () => {
            imageShuffler(
                shuffleToggle ? IMAGE_SOURCES_2 : IMAGE_SOURCES,
                shuffleToggle ? IMAGE_NAMES_2 : IMAGE_NAMES
            );
        }

        setTimeout(() => setShuffleToggle(!shuffleToggle), DEFAULT_DELAY);
        reshuffle();

        if (IMAGE_NAMES[0] === IMAGE_NAMES_2[IMAGE_NAMES_2.length - 1] || IMAGE_NAMES_2[0] === IMAGE_NAMES[IMAGE_NAMES.length - 1])
            reshuffle();


    }, [shuffleToggle])



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

    /* Component returns */
    return (
        <View>
            <AutoScroll
                duration={DEFAULT_DELAY * 2}
                delay={0}
                endPaddingWidth={0}
            >

                {loadImageList()}

            </AutoScroll>

        </View >

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