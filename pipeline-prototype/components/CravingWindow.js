import React, { useEffect, useState, useRef, useContext, createContext } from 'react';
import { View, StyleSheet, TextInput, Button, Pressable, Image, Animated, Text, VirtualizedList } from 'react-native';
import { ShoppingBasket03Icon, ListViewIcon, AddToListIcon } from 'hugeicons-react';
import { List } from '../assets/images.js';
import ListTransition from '../components/ListTransition.js';
import QuantityInput from './QuantityInput';
import Icon from 'react-native-vector-icons/Ionicons';
import { Grid } from 'react-virtualized';


export const ElementContext = createContext(null);

function CravingWindow({ preferences, preferenceSetter, locationVal, locationSetter }) {

    const [craving, setCraving] = useState('');
    const [shoppingCart, setShoppingCart] = useState({ dishes: [], restaurants: [] });
    const [toggleCart, setToggleCart] = useState(false);
    const [componentLoaded, setComponentLoaded] = useState(false);
    const animatedValue = useRef(new Animated.Value(0)).current;

    const [listHeight, setListHeight] = useState(0);
    const ref = useRef(null);
    const searchRef = useRef(null);


    useEffect(() => {

        setComponentLoaded(true);

        if (ref.current) {
            console.log("Component has loaded!");
            setListHeight(ref.current.clientHeight);
        }
    }, []);

    if (locationVal !== 4) {
        return;
    }

    // VirtualizedList helper functions
    const getItem = (data, index) => data[index];
    const getItemCount = (data) => data.length;


    const addToCart = (e) => {

        if (!craving.trim()) {
            console.log('There is nothing in the text box');
            return;
        }

        const newDish = { id: undefined, name: undefined };
        newDish.id = Date.now().toString();
        newDish.name = craving;

        console.log("New Dish: ", newDish);

        shoppingCart.dishes.push(newDish);

        console.log("Added to cart: ", craving);
        console.log("Current cart: ", shoppingCart);
        setCraving('');
        console.log("Text element", e);
        searchRef.current.value = '';
    }

    const toggleShoppingCart = (e) => {
        setToggleCart(!toggleCart);
        console.log("Opening the list!");
    }

    const loadList = () => {

        return (
            <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflowY: 'scroll', textAlign: 'center' }}>
                <Text style={{ fontSize: '1.5rem', padding: '10px', width: '100%', textAlign: 'center' }}>Dishes</Text>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                    <Text>Quantity</Text>
                    <Text style={{ textAlign: 'left' }}>Dish Name</Text>
                </View>

                {/* VirtualizedList for displaying the active list */}
                <VirtualizedList
                    data={shoppingCart["dishes"]}
                    getItem={getItem}
                    getItemCount={getItemCount}
                    keyExtractor={item => item.id}
                    style={{ width: '100%' }}

                    renderItem={({ item }) => (
                        <View
                            style={{ fontSize: '1.2rem', padding: '10px', margin: 0, width: '100%' }}
                        >
                            <CravingListElement item={item} shoppingCart={shoppingCart} setShoppingCart={setShoppingCart} />
                        </View>
                    )}
                />


                {/* {shoppingCart.dishes.map((value, index) => (
                    <View
                        key={index}
                        style={{ fontSize: '1.2rem', padding: '10px', margin: 0, width: '100%' }}
                    >
                        <CravingListElement name={value} shoppingCart={shoppingCart} setShoppingCart={setShoppingCart} />
                    </View>
                ))} */}
            </View>
        );

    }


    return (
        <View style={styles.window}>

            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1 }}>

                <TextInput
                    style={{ padding: '20px', borderRightWidth: '1px', borderColor: '#000', }}
                    placeholder={"Chicken Alfredo"}
                    placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                    ref={searchRef}
                    onChangeText={setCraving}
                    value={craving}
                >
                </TextInput>

                <Pressable
                    style={styles.shoppingBag}
                    onPress={toggleShoppingCart}>
                    <List />
                </Pressable>

            </View>

            <View style={styles.addButton}>
                <Button
                    onPress={addToCart}
                    title={"Add"}
                    color={'#841522'}>
                </Button>

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
                    <View
                        style={{ width: 300, height: 450 }}
                        ref={ref}
                    >
                        <Pressable
                            onPress={toggleShoppingCart}
                        >
                            <Text style={{ fontSize: 28, textAlign: 'center', margin: 10 }}>
                                Items
                            </Text>
                        </Pressable>

                        {toggleShoppingCart && loadList()}

                    </View>
                </ListTransition>

            </ElementContext>


        </View>
    );

}

function CravingListElement({ item, shoppingCart, setShoppingCart }) {


    console.log("item: ", item);
    const listElement = item;

    const id = item.id;
    const [quantity, setQuantity] = useState(1);

    const deleteItem = () => {
        console.log('shopping cart', shoppingCart)

        const updatedList = shoppingCart["dishes"].filter((value, index) => (value.id !== id));

        setShoppingCart({ ...shoppingCart, dishes: [...updatedList] });
        console.log(shoppingCart);
    }


    return (
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%', padding: 10 }}>

            <View style={{ flex: 1 }}>
                <QuantityInput quantity={quantity} setQuantity={setQuantity} onButtonDeletion={deleteItem} />
            </View>

            <View style={{ flex: 1 }}>
                <Text style={{ textAlign: 'left' }}>
                    {item.name}
                </Text>
            </View>

            {/* <Pressable
                onPress={deleteItem}
            >
                <Icon name='trash' type='material' size={15} color="#333"></Icon>
            </Pressable> */}

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