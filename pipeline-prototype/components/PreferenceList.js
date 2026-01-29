import React, { useEffect, useRef, useState, useContext } from "react";
import {
    Animated,
    Button,
    LayoutAnimation,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    UIManager,
    View,
} from "react-native";
import BouncyButton from "./BouncyButton";
import { TextInput } from "react-native-paper";
import { QuestionnaireContext } from "./QuestionnaireWindow";
import { ButtonContext } from "../App";

const DEFAULT_NO_PREFERENCE_WORD = 'None';
const DEFAULT_CUISINE_LIST = [DEFAULT_NO_PREFERENCE_WORD, 'American', 'Mexican', 'Asian', 'Italian']
// const DEFAULT_NUM_OPTIONS = 4

function PreferenceList() {
    const parentButtonContext = useContext(ButtonContext);
    const {questionnaireData, setQuestionnaireData} = useContext(QuestionnaireContext);
    const [showAddWindow, setShowAddWindow] = useState(false);

    const panelAnim = useRef(new Animated.Value(0)).current;

    const filteredDefault = DEFAULT_CUISINE_LIST.filter((item) => {
         return !questionnaireData.preferences.ethnicCuisines.includes(item) && !questionnaireData.preferences.ethnicCuisines.includes(DEFAULT_NO_PREFERENCE_WORD);
    } );
    // console.log("Filtered list: ",filteredDefault);

    useEffect(() => {
        console.log("Ethnic Cuisines: ",questionnaireData.preferences.ethnicCuisines);
    }, [questionnaireData.preferences.ethnicCuisines])

    useEffect(() => {
        if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }, []);

    // const [currentList, setCurrentList] = useState({ list: [...DEFAULT_CUISINE_LIST] });
    const [currentList, setCurrentList] = useState({ list: [...questionnaireData.preferences.ethnicCuisines, ...filteredDefault, ] });
    const currentListSaveState = useRef({ list: DEFAULT_CUISINE_LIST });
    const [itemName, setItemName] = useState('');
    const [selectedItems, setSelectedItems] = useState([...questionnaireData.preferences.ethnicCuisines]);

    const handleSelection = (item, isSelected) => {
        let updatedSelection;
        const noneFlag = item === DEFAULT_NO_PREFERENCE_WORD;

        if (noneFlag && isSelected) {
            updatedSelection = [DEFAULT_NO_PREFERENCE_WORD];
            setCurrentList((prev) => {
                currentListSaveState.current = prev;
                return { list: updatedSelection } 
            });
        } else if (noneFlag && !isSelected) {
            updatedSelection = [];            
            setCurrentList({ list: currentListSaveState.current.list ?? [] });
        } else if (isSelected) {
            // const noneFlag = selectedItems.includes["None"] || item === "None";
            // console.log(noneFlag, selectedItems.includes["None"]);
            // updatedSelection = noneFlag ? [item === "None" ? item : undefined] : [...selectedItems, item];
            updatedSelection = [...selectedItems, item];
        } else {
            updatedSelection = selectedItems.filter(
                (selectedItems) => selectedItems != item
            );
        }
        setSelectedItems(updatedSelection);

        setQuestionnaireData((prev) => ({
           ...prev,
            preferences: {
                ...prev.preferences,
                ethnicCuisines: updatedSelection,
            }
        }));

        console.log('preferences: ', questionnaireData.preferences)
    }

    console.log(`Current List: ${currentList.list}`);

    useEffect(() => {
        Animated.timing(panelAnim, {
            toValue: showAddWindow ? 1 : 0,
            duration: 180,
            useNativeDriver: true,
        }).start();
    }, [panelAnim, showAddWindow]);

    const addItem = () => {

        const trimmedName = itemName.trim();

        if (trimmedName && trimmedName !== DEFAULT_NO_PREFERENCE_WORD && !currentList.list.includes(trimmedName)) {
        
            setCurrentList((prevList) => ({
                list: [...prevList.list, trimmedName]
            }));
            handleSelection(trimmedName, true);
            setItemName('');
            // setShowAddWindow(false);
        } else {
            throw new Error("Adding unnecessary value to list");
        }

        console.log(currentList);

    }

    const loadList = () => {

        return (
            <View style={styles.itemsContainer}>
                {currentList.list.map((item, index) => (
                    <View key={index} style={{ display: "flex" }}>
                        <PressableButton
                            title={item}
                            color="red"
                            onSelectionChange={(isSelected) => handleSelection(item, isSelected)} 
                            prefilled={questionnaireData.preferences.ethnicCuisines.includes(item)}
                            />
                    </View>
                ))}
            </View>
        )
    }

    const popOutWindow = () => {
        return (
            <View style={styles.popOutWindow}>
                <Text>Hello! Add new preference here:</Text>
                <TextInput
                    placeholder="Enter new cuisine type"
                    style={{ marginBottom: 8 }}
                    value={itemName}
                    onChangeText={(value) => setItemName(value)}
                />
                <View style={styles.popOutButtons}>
                    <Button
                        title="Close"
                        color={parentButtonContext.color}
                        onPress={() => {
                            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                            setShowAddWindow(false);
                        }}
                    />
                    <Button
                        title="Add"
                        color={parentButtonContext.color}
                        onPress={() => {
                            addItem();
                            // handleSelection(, true);
                        }}
                    />
                </View>

            </View>
        );
    }

    return (
        <View style={{ width: '100%', alignSelf: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <ScrollView
                style={styles.list}
            // showsVerticalScrollIndicator={true}
            // showsHorizontalScrollIndicator={false}
            >
                {loadList()}

            </ScrollView>

            <View style={styles.customArea}>
                <View style={styles.customButtonRow}>
                    <Button
                        title={showAddWindow ? "Hide custom preferences" : "Custom preferences"}
                        color={'purple'}
                        onPress={() => {
                            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                            setShowAddWindow((prev) => !prev);
                        }}
                    />
                </View>

                <Animated.View
                    pointerEvents={showAddWindow ? 'auto' : 'none'}
                    style={[
                        styles.customPanel,
                        {
                            maxHeight: showAddWindow ? 220 : 0,
                            opacity: panelAnim,
                            transform: [
                                {
                                    translateY: panelAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [-8, 0],
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    {popOutWindow()}
                </Animated.View>
            </View>
        </View>
    );

}

function PressableButton(PreferenceProps) {

    const { title, onSelectionChange, prefilled } = PreferenceProps;
    const [toggle, setToggle] = useState('false');
    const name = title;
    const [isSelected, setIsSelected] = useState(prefilled);

    // console.log(`${title}, ${key}`);
    const clickHandler = (message) => {

        // console.log("Message from child", message);

        const newSelection = !isSelected;
        setIsSelected(newSelection);
        onSelectionChange(newSelection);
        // console.log(`${title} is now ${newSelection ? 'selected' : 'unselected'}`);
    }


    return (
        <>
            <View style={styles.preferenceButton}>
                {/* <Pressable onPress={clickHandler}> */}
                <BouncyButton title={title} onButtonClick={clickHandler} isPreFilled={prefilled} />
                {/* </Pressable> */}
            </View>
        </>

    );

}

const styles = StyleSheet.create({
    customArea: {
        width: '100%',
        maxWidth: 420,
        alignSelf: 'center',
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    customButtonRow: {
        width: '100%',
        alignSelf: 'center',
    },
    customPanel: {
        overflow: 'hidden',
        width: '100%',
    },
    popOutWindow: {
        width: '100%',
        maxWidth: 420,
        alignSelf: 'center',
        paddingVertical: 10,
    },
    popOutButtons: {
        width: '100%',
        maxWidth: 260,
        alignSelf: 'center',
        gap: 10,
    },
    list: {
        maxHeight: 200,
        width: '100%',
        marginVertical: 12,
    },
    itemsContainer: {
        gap: 6,
        padding: 16,
    },
    preferenceButton: {
        // padding: 10,
        borderRadius: 8,
        backgroundColor: "#FFF",
        width: '100%',
    }
});

export default PreferenceList;