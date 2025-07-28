import React, { useEffect, useState, useRef, useContext, createContext } from 'react';
import { View, StyleSheet, TextInput, Button, Pressable, Image, Animated, Text, VirtualizedList } from 'react-native';
import { ShoppingBasket03Icon, ListViewIcon, AddToListIcon } from 'hugeicons-react';
import { List } from '../assets/images.js';
import ListTransition from '../components/ListTransition.js';
import QuantityInput from './QuantityInput';
import Icon from 'react-native-vector-icons/Ionicons';
import { Grid } from 'react-virtualized';
import { createIconSetFromFontello } from 'react-native-vector-icons';

export const ElementContext = createContext(null);

function CravingWindow({ preferences, preferenceSetter, locationVal, locationSetter }) {

    const [craving, setCraving] = useState('');
    const [shoppingCart, setShoppingCart] = useState({ dishes: [], restaurants: [] });
    const [listSelect, setListSelect] = useState('dishes');
    const [toggleCart, setToggleCart] = useState(false);
    const [componentLoaded, setComponentLoaded] = useState(false);
    const [newDish, setNewDish] = useState({ id: undefined, name: undefined, type: undefined });
    const [newRestaurant, setNewRestaurant] = useState({ id: undefined, name: undefined, type: undefined });
    const animatedValue = useRef(new Animated.Value(0)).current;

    const [listHeight, setListHeight] = useState(0);
    const ref = useRef(null);
    const searchRef = useRef(null);

    const DISH_LIST_COLOR = '#A12';
    const RESTAURANT_LIST_COLOR = '#882';

    useEffect(() => {
        const cartTagIsRestaurant = newDish.id === undefined;
        const resetValues = { id: undefined, name: undefined, tag: undefined }
        const addItem = (listType) => {
            console.log("New Item: ", newDish);
            console.log("List type:", listType);

            setShoppingCart(prevCart => ({
                ...prevCart,
                // dishes: [...prevCart.dishes, newDish]
                [listType]: [...prevCart[listType], (cartTagIsRestaurant ? newRestaurant : newDish)]
            }));
            // shoppingCart.dishes.push(newDish);

            console.log("Added to cart: ", (cartTagIsRestaurant ? newRestaurant.name : newDish.name));
            console.log("Current cart: ", shoppingCart);

            setCraving('');
            if (searchRef.current) {
                searchRef.current.clear();
            }

            cartTagIsRestaurant ? setNewRestaurant(resetValues) : setNewDish(resetValues);
        }

        if (newDish.id === undefined && newRestaurant.id === undefined) {
            return;
        }

        addItem(cartTagIsRestaurant ? "restaurants" : "dishes");
    }, [newDish, newRestaurant])


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


    const addToCart = async (e) => {

        if (!craving.trim()) {
            console.log('There is nothing in the text box');
            return;
        } else {
            setCraving(craving.trim());
        }

        console.log(`Sending ${craving} to server!`);
        try {
            const response = await fetch('http://127.0.0.1:5000/classify_dish',
                {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ "text": craving })
                });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const items = data['Message'];
            const tag = data['Type'];

            console.log(data, items, tag);

            if (items[0] === "") {
                // Nothing was returned from the model
                console.log('sending error!');
                throw new Error(`The model did not parse out anything from the provided input ${craving}`);
            }

            if (Array.isArray(items)) {
                items.forEach(element => {
                    const newItem = {
                        id: Date.now().toString(),
                        name: element,
                        type: tag
                    };

                    tag == 'DISH' ? setNewDish(newItem) : setNewRestaurant(newItem);
                });
            }

        } catch (error) {
            console.error('Error sending request to server:', error);
        }
    }

    const toggleShoppingCart = (e) => {
        setToggleCart(!toggleCart);
        console.log("Opening the list!");
    }

    const loadList = (list) => {

        return (
            <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1, height: '100%' }}>
                <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                    <Pressable
                        onPress={() => { setListSelect('dishes') }}
                    >
                        {/* Type notification */}
                        {shoppingCart.dishes.length != 0 && <Text style={{ position: 'absolute', top: 0, right: 0, zIndex: 1, backgroundColor: '#F44322', borderRadius: '40px', color: '#FFF', width: '20px', textAlign: 'center', aspectRatio: 1 / 1, }}>{shoppingCart.dishes.length}</Text>}
                        <Text style={{ fontSize: '1.5rem', flex: 1, paddingHorizontal: '25px', textAlign: 'center', backgroundColor: DISH_LIST_COLOR, borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }}>Dishes</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => { setListSelect('restaurants') }}
                    >
                        {shoppingCart.restaurants.length != 0 && <Text style={{ position: 'absolute', top: 0, right: 0, zIndex: 1, backgroundColor: '#F44322', borderRadius: '40px', color: '#FFF', width: '20px', textAlign: 'center', aspectRatio: 1 / 1, }}>{shoppingCart.restaurants.length}</Text>}
                        <Text style={{ fontSize: '1.5rem', flex: 1, paddingHorizontal: '25px', textAlign: 'center', backgroundColor: RESTAURANT_LIST_COLOR, borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }}>Restaurants</Text>
                    </Pressable>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', padding: 10, backgroundColor: list == 'dishes' ? DISH_LIST_COLOR : RESTAURANT_LIST_COLOR }}>
                    {list == 'dishes' && <Text style={{ width: '50%', alignSelf: 'center', textAlign: 'center' }}>Quantity</Text>}
                    <Text style={{ width: '50%', alignSelf: 'center', textAlign: 'center' }}>{list == 'dishes' ? 'Dish Name' : 'Restaurant Name'}</Text>
                </View>

                {/* VirtualizedList for displaying the active list of dishes */}
                <VirtualizedList
                    data={list == 'dishes' ? shoppingCart['dishes'] : shoppingCart['restaurants']}
                    getItem={getItem}
                    getItemCount={getItemCount}
                    keyExtractor={item => item.id}
                    style={{ flex: 1, width: '100%' }}
                    contentContainerStyle={{ flexGrow: 1 }}
                    // showsVerticalScrollIndicator={true}
                    // nestedScrollEnabled={true}

                    renderItem={({ item }) => (
                        <View
                            style={{ fontSize: '1.2rem', padding: '10px', margin: 0, width: '100%' }}
                        >
                            <CravingListElement item={item} shoppingCart={shoppingCart} setShoppingCart={setShoppingCart} showQuantity={list == 'dishes' ? true : false} />
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
            </View >
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
                        style={{ width: 350, height: 500 }}
                        ref={ref}
                    >
                        <Pressable
                            onPress={toggleShoppingCart}
                        >
                            <Text style={{ fontSize: 28, textAlign: 'center', margin: 10 }}>
                                Items
                            </Text>
                        </Pressable>

                        {toggleShoppingCart && loadList(listSelect)}

                    </View>
                </ListTransition>

            </ElementContext>


        </View>
    );

}

function CravingListElement({ item, shoppingCart, setShoppingCart, showQuantity }) {


    console.log("item: ", item);
    const listElement = item;

    const id = item.id;
    const [quantity, setQuantity] = useState(1);

    const deleteItem = (type) => {
        const shoppingCartListPtr = type === 'DISH' ? 'dishes' : 'restaurants';

        console.log('shopping cart', shoppingCart)

        const updatedList = shoppingCart[shoppingCartListPtr].filter((value, index) => (value.id !== id));

        setShoppingCart({ ...shoppingCart, [shoppingCartListPtr]: [...updatedList] });
        console.log(shoppingCart);
    }


    return (
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%', padding: 10, paddingLeft: 5 }}>

            {showQuantity ? (
                <View style={{ flex: 1, alignSelf: 'center' }}>
                    <QuantityInput quantity={quantity} setQuantity={setQuantity} onButtonDeletion={deleteItem} />
                </View>
            ) :

                <Pressable
                    onPress={() => { deleteItem(listElement.tag) }}
                    style={{ padding: 10, backgroundColor: '#f0f0f0', borderRadius: 5 }}
                >
                    <Icon name='trash' type="material" size={10} color="#333" />
                </Pressable>

            }



            <View style={{ flex: 1, paddingLeft: 5 }}>
                <Text style={{ textAlign: 'center' }}>
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