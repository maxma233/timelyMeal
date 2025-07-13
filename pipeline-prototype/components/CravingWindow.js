import React, { useEffect, useState, useRef, useContext, createContext } from 'react';
import { View, StyleSheet, TextInput, Button, Pressable, Image, Animated, Text } from 'react-native';
import { ShoppingBasket03Icon, ListViewIcon, AddToListIcon } from 'hugeicons-react';
import { List } from '../assets/images.js'
import ListTransition from '../components/ListTransition.js'

export const ElementContext = createContext(null);

function CravingWindow({ preferences, preferenceSetter, locationVal, locationSetter }) {

    const [craving, SetCraving] = useState('');
    const [shoppingCart, setShoppingCart] = useState({ dishes: [], restaurants: [] });
    const [toggleCart, setToggleCart] = useState(false);
    const [componentLoaded, setComponentLoaded] = useState(false);
    const animatedValue = useRef(new Animated.Value(0)).current;

    const [listHeight, setListHeight] = useState(0);
    const ref = useRef(null);

    useEffect(() => {

        setComponentLoaded(true);

        if (ref.current) {
            console.log("Component has loaded!");
            setListHeight(ref.current.clientHeight);
        }
    }, []);

    // Makes sure when you back up down the list of questions 
    // it makes sure the showCart toggle is false so the list 
    // does not pop back up
    useEffect(() => {
        if (locationVal !== 4) {
            setShowCart(false);
        }
    }, [locationVal])

    if (locationVal !== 4) {
        return;
    }

    const clickHandler = (e) => {
        console.log("Clicked!");
    }

    const toggleShoppingCart = (e) => {
        setToggleCart(!toggleCart);
        console.log("Opening the list!");
    }

    return (
        <View style={styles.window}>

            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1 }}>

                <TextInput
                    style={{ padding: '20px', borderRightWidth: '1px', borderColor: '#000', }}
                    placeholder={"Chicken Alfredo"}
                    onChangeText={SetCraving}>
                </TextInput>

                <Pressable
                    style={styles.shoppingBag}
                    onPress={toggleShoppingCart}>
                    <List />
                </Pressable>

            </View>

            <View style={styles.addButton}>
                <Button
                    onPress={clickHandler}
                    title={"Add"}
                    color={'#841522'}>
                </Button>

            </View>

            {/* {showCart &&
            } */}

            <View style={{ zIndex: -1, position: 'absolute', width: 300, height: 450, opacity: 0 }}
                ref={ref}>
                <Text style={{ fontSize: 28, textAlign: 'center', margin: 10 }}>
                    Items
                </Text>
            </View>

            <ElementContext value={{
                listHeight,
                setListHeight,
                componentLoaded,
                toggleCart
            }}>

                <ListTransition
                    // listHeight={listHeight}
                    style={{
                        position: 'fixed',
                        bottom: 0,
                        right: '20%',
                        backgroundColor: 'powderblue',
                        borderRadius: 24,
                    }}>
                    <View style={{ width: 300, height: 450 }}>
                        <Pressable
                            onPress={toggleShoppingCart}
                        >
                            <Text style={{ fontSize: 28, textAlign: 'center', margin: 10 }}>
                                Items
                            </Text>
                        </Pressable>
                    </View>
                </ListTransition>

            </ElementContext>


        </View>
    );

}

export default CravingWindow;

const styles = StyleSheet.create({
    window: {
        backgroundColor: '#FFF',
        display: 'flex',
    },
    addButton: {
        backgroundColor: '#841522',
    },
    shoppingBag: {
        backgroundColor: 'transparent',

    },
});