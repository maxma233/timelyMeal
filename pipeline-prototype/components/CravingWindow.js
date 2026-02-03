import React, { useEffect, useState, useRef, useContext, createContext, useCallback } from 'react';
import { View, StyleSheet, TextInput, Button, Pressable, Animated, Text, VirtualizedList, Platform, useWindowDimensions } from 'react-native';
// import { ShoppingBasket03Icon, ListViewIcon, AddToListIcon } from 'hugeicons-react';
import { List } from '../assets/images.js';
import ListTransition from '../components/ListTransition.js';
import QuantityInput from './QuantityInput';
import Icon from 'react-native-vector-icons/Ionicons';
import { Grid } from 'react-virtualized';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import { LocationContext, QuestionnaireContext } from './QuestionnaireWindow.js';
import { ButtonContext } from '../App.js';

export const ElementContext = createContext(null);

function CravingWindow() {

    const parentThemeContext = useContext(ButtonContext);

    const modelEndpoint = process.env.EXPO_PUBLIC_MODEL_HOST_ENDPOINT;

    const [shoppingCart, setShoppingCart] = useState(null);
    const [listSelect, setListSelect] = useState('dishes');
    const [toggleCart, setToggleCart] = useState(false);
    const [componentLoaded, setComponentLoaded] = useState(false);
    const [newDish, setNewDish] = useState({ id: undefined, name: undefined, type: undefined });
    const [newRestaurant, setNewRestaurant] = useState({ id: undefined, name: undefined, type: undefined });
    const animatedValue = useRef(new Animated.Value(0)).current;

    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const drawerWidth = Math.min(360, Math.max(280, screenWidth - 24));
    const drawerHeight = Math.min(520, Math.max(340, Math.round(screenHeight * 0.7)));

    const [listHeight, setListHeight] = useState(0);
    // const ref = useRef(null);

    const searchRef = useRef(null);
    // const searchTextBox = useRef(null);

    const DISH_LIST_COLOR = '#A12';
    const RESTAURANT_LIST_COLOR = '#882';

    // Location information
    const { locationVal, setLocationVal } = useContext(LocationContext);
    const { questionnaireData, setQuestionnaireData } = useContext(QuestionnaireContext);
    
    const getRandomId = () => {
        return Math.floor(Math.random() * 1000000);
    }

    useEffect(() => {

        const keys = Object.keys(questionnaireData.preferences);
        const recreatedDishes = new Object({ dishes: [], restaurants: [] });
        const typeDictionary = { 'dishes': 'DISH', 'restaurants': 'RESTAURANT'};

        for (const key of keys) {
            if (recreatedDishes[key] && Array.isArray(recreatedDishes[key])) {
                questionnaireData.preferences[key].map((item, index) => {
                    const newItem = {
                        id: getRandomId(),
                        name: item,
                        type: typeDictionary[key]
                    };
                    recreatedDishes[key].push(newItem);
                })
            }
        }

        setShoppingCart({...recreatedDishes});

    }, []);

    const handleTransitionWindow = useCallback((reference) => {
        
        if (reference) {
            setComponentLoaded(true);
            console.log("Component has loaded!");
            setListHeight(reference.clientHeight);
        }
    }, [])

    const goToScheduleSelector = () => {
        setLocationVal(5);
    }

    useEffect(() => {

        if (shoppingCart === null) {
            return;
        }

        console.log("Current cart: ", shoppingCart);


        const keys = Object.keys(shoppingCart);
        const normalizedData = new Object({ dishes: [], restaurants: [] });

        for (const key of keys) {
            
            shoppingCart[key].map((item, index) => {
                normalizedData[key].push(item.name);
            });
        }

        setQuestionnaireData((prev) => {
            return ({
                ...prev,
                preferences: { ...prev.preferences, ...normalizedData},
            });
        });

    }, [shoppingCart]);

    useEffect(() => {
        const cartTagIsRestaurant = newDish.id === undefined;
        const resetValues = { id: undefined, name: undefined, tag: undefined }
        const addItem = (listType) => {
            console.log("New Item: ", newDish);
            console.log("List type:", listType);

            // Have to first access the preferences from thee questionnaireData before any mutation
            // setQuestionnaireData(prev => ({
            //     ...prev,
            //     preferences: {
            //         ...prev.preferences, // All previous preference instances
            //         // Using a dynamic variable, you can encapsulate it in '[]' to evaluate the attribute name during runtime
            //         // Also, grabbing the rest of the preferences on the provided listType and adding the new item
            //         [listType]: [...prev.preferences[listType], (cartTagIsRestaurant ? newRestaurant.name : newDish.name)]
            //     } 
            // }));

            setShoppingCart((prev) => ({
                ...prev,
                [listType]: [...prev[listType], (cartTagIsRestaurant ? newRestaurant : newDish)]
            }));

            console.log("Added to cart: ", (cartTagIsRestaurant ? newRestaurant : newDish));
            // console.log("Current cart: ", questionnaireData.preferences);

            if (searchRef.current.text) {
                // console.log('reset search ref text value!');
                searchRef.current.clear();

            }

            cartTagIsRestaurant ? setNewRestaurant(resetValues) : setNewDish(resetValues);
        }

        if (newDish.id === undefined && newRestaurant.id === undefined) {
            return;
        }

        addItem(cartTagIsRestaurant ? "restaurants" : "dishes");
    }, [newDish, newRestaurant])

    // VirtualizedList helper functions
    const getItem = (data, index) => data[index];
    const getItemCount = (data) => data.length;

    const addToCart = async (e) => {

        if (searchRef.current === null) {
            throw new Error("The reference for the craving window is missing!");
        }

        let searchValue = searchRef.current.text || '';

        if (!searchValue.trim()) {
            console.log('There is nothing in the text box');
            return;
        }

        searchValue = searchValue.trim();

        console.log(`Sending ${searchValue} to server!`);
        try {
            const response = await fetch(`http://${modelEndpoint}/classify_dish`,
                {
                    method: "POST",
                    // mode: "cors",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ "text": searchValue })
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
                throw new Error(`The model did not parse out anything from the provided input ${searchValue}`);
            }

            if (Array.isArray(items)) {
                items.forEach(element => {
                    const newItem = {
                        id: getRandomId(),
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
                        {questionnaireData.preferences.dishes.length != 0 && (
                            <Text style={styles.badge}>
                                {questionnaireData.preferences.dishes.length}
                            </Text>
                        )}
                        <Text style={[styles.tab, styles.tabLeft, { backgroundColor: DISH_LIST_COLOR }]}>Dishes</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => { setListSelect('restaurants') }}
                    >
                        {questionnaireData.preferences.restaurants.length != 0 && (
                            <Text style={styles.badge}>
                                {questionnaireData.preferences.restaurants.length}
                            </Text>
                        )}
                        <Text style={[styles.tab, styles.tabRight, { backgroundColor: RESTAURANT_LIST_COLOR }]}>Restaurants</Text>
                    </Pressable>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', padding: 10, backgroundColor: list == 'dishes' ? DISH_LIST_COLOR : RESTAURANT_LIST_COLOR }}>
                    {list == 'dishes' && <Text style={{ width: '50%', alignSelf: 'center', textAlign: 'center' }}>Quantity</Text>}
                    <Text style={{ width: '50%', alignSelf: 'center', textAlign: 'center' }}>{list == 'dishes' ? 'Dish Name' : 'Restaurant Name'}</Text>
                </View>

                {/* VirtualizedList for displaying the active list of dishes */}
                <VirtualizedList
                    // data={list == 'dishes' ? questionnaireData.preferences['dishes'] : questionnaireData.preferences['restaurants']}
                    data={list == 'dishes' ? shoppingCart['dishes']: shoppingCart['restaurants']}
                    getItem={getItem}
                    getItemCount={getItemCount}
                    keyExtractor={item => item.id}
                    style={{ flex: 1, width: '100%' }}
                    contentContainerStyle={{ flexGrow: 1 }}
                    // showsVerticalScrollIndicator={true}
                    // nestedScrollEnabled={true}

                    renderItem={({ item }) => (
                        <View
                            style={{ padding: 10, width: '100%' }}
                        >
                            <CravingListElement item={item} showQuantity={list == 'dishes' ? true : false} shoppingCart={shoppingCart} setShoppingCart={setShoppingCart} />
                        </View>
                    )}
                />
            </View >
        );

    }

    if (shoppingCart === null) {
        return null;
    }

    return (
        <View style={styles.window}>

            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1 }}>

                <TextInput
                    style={styles.searchInput}
                    placeholder={"Chicken Alfredo"}
                    placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                    ref={searchRef}
                    // Save the value of the text into the reference
                    onChangeText={(e) => (searchRef.current.text = e)}
                // onChangeText={setCraving}
                // value={}
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

            {/* Add Next button */}
            <View style={styles.nextButton}>
                <Button
                    onPress={goToScheduleSelector}
                    // title={(questionnaireData.preferences.dishes.length + questionnaireData.preferences.restaurants.length) > 0 ? 'Next' : 'Skip' }
                    title={(shoppingCart['dishes'].length + shoppingCart['restaurants'].length) > 0 ? 'Next' : 'Skip' }
                    color={parentThemeContext.color}>
                </Button>
            </View>

            <ElementContext.Provider value={{
                listHeight,
                setListHeight,
                componentLoaded,
                toggleCart
            }}>

                <ListTransition
                    style={{
                        position: Platform.OS === 'web' ? 'fixed' : 'absolute',
                        bottom: 0,
                        right: Platform.OS === 'web' ? '20%' : 12,
                        backgroundColor: 'powderblue',
                        borderRadius: 24,
                    }}>
                    <View
                        style={{ width: drawerWidth, height: drawerHeight }}
                        ref={handleTransitionWindow}
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

            </ElementContext.Provider>

        </View>
    );
}

function CravingListElement({ item, showQuantity, shoppingCart, setShoppingCart}) {

    // const { questionnaireData, setQuestionnaireData } = useContext(QuestionnaireContext);

    console.log("item: ", item);
    const listElement = item;

    const id = item.id;
    const [quantity, setQuantity] = useState(1);

    const deleteItem = (type) => {
        const shoppingCartListPtr = type === 'DISH' ? 'dishes' : 'restaurants';

        // console.log('shopping cart', questionnaireData.preferences)
        console.log('shopping cart');
        console.log(shoppingCart);

        // const updatedList = questionnaireData.preferences[shoppingCartListPtr].filter((value, index) => (value.id !== id));
        const updatedList = shoppingCart[shoppingCartListPtr].filter((value, index) => (value.id !== id));

        setShoppingCart((prev) => ({ 
            ...prev, 
            [shoppingCartListPtr]: [...updatedList]
        }));

        // console.log(questionnaireData.preferences);
        console.log(shoppingCart);
    }

    return (
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%', padding: 10, paddingLeft: 5 }}>

            {showQuantity ? (
                <View style={{ flex: 1, alignSelf: 'center' }}>
                    <QuantityInput quantity={quantity} setQuantity={setQuantity} onButtonDeletion={() => deleteItem(listElement.type)} />
                </View>
            ) :

                <Pressable
                    onPress={() => { deleteItem(listElement.type) }}
                    style={{ padding: 10, backgroundColor: '#f0f0f0' }}
                >
                    <Icon name='trash' type="material" size={20} color="#333" />
                </Pressable>

            }

            <View style={{ flex: 1, paddingLeft: 5 }}>
                <Text style={{ textAlign: 'center' }}>
                    {item.name}
                </Text>
            </View>

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
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 1,
        backgroundColor: '#F44322',
        borderRadius: 20,
        color: '#FFF',
        width: 20,
        height: 20,
        textAlign: 'center',
        textAlignVertical: 'center',
        lineHeight: 20,
        overflow: 'hidden',
    },
    tab: {
        fontSize: 18,
        paddingHorizontal: 18,
        paddingVertical: 10,
        textAlign: 'center',
        color: '#FFF',
    },
    tabLeft: {
        borderTopLeftRadius: 24,
    },
    tabRight: {
        borderTopRightRadius: 24,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRightWidth: Platform.OS === 'web' ? 1 : 0,
        borderColor: '#000',
    },
});