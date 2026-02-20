import React, { useEffect, useRef, useState, useContext } from "react";
import {
    Animated,
    Button,
    Dimensions,
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

function PreferenceList({ compact = false } = {}) {
    const parentButtonContext = useContext(ButtonContext);
    const {questionnaireData, setQuestionnaireData} = useContext(QuestionnaireContext);
    const [showAddWindow, setShowAddWindow] = useState(false);

    const panelAnim = useRef(new Animated.Value(0)).current;
    const drawerWidth = Math.min(420, Math.max(280, Math.round(Dimensions.get('window').width * 0.82)));
    const drawerHeight = Dimensions.get('window').height;

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
    const currentListSaveState = useRef({ list: DEFAULT_CUISINE_LIST, selected: [] });
    const [itemName, setItemName] = useState('');
    const [selectedItems, setSelectedItems] = useState([...questionnaireData.preferences.ethnicCuisines]);

    
    const handleSelection = (item, isSelected) => {
        let updatedSelection;
        const noneFlag = item === DEFAULT_NO_PREFERENCE_WORD;

        if (noneFlag && isSelected) {
            updatedSelection = [DEFAULT_NO_PREFERENCE_WORD];
            currentListSaveState.current = {
                list: currentList.list,
                selected: selectedItems,
            };
            setCurrentList({ list: updatedSelection });
        } else if (noneFlag && !isSelected) {
            updatedSelection = currentListSaveState.current.selected ?? [];
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
                list: [trimmedName, ...prevList.list]
            }));
            handleSelection(trimmedName, true);
            setItemName('');
            setShowAddWindow(false);
        } else {
            throw new Error("Adding unnecessary value to list");
        }

        console.log(currentList);

    }

    const loadList = () => {

        return (
            <View style={[styles.itemsContainer, compact && styles.itemsContainerCompact]}>
                {currentList.list.map((item, index) => (
                    <View key={index} style={{ display: "flex" }}>
                        <PressableButton
                            title={item}
                            color="red"
                            onSelectionChange={(isSelected) => handleSelection(item, isSelected)} 
                            prefilled={questionnaireData.preferences.ethnicCuisines.includes(item)}
                            compact={compact}
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
                            setShowAddWindow(false);
                        }}
                    />
                </View>

            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={[styles.content, compact && styles.contentCompact]}>
                <ScrollView
                    style={[styles.list, compact && styles.listCompact]}
                // showsVerticalScrollIndicator={true}
                // showsHorizontalScrollIndicator={false}
                >
                    {loadList()}

                </ScrollView>

                <View style={[styles.customArea, compact && styles.customAreaCompact]}>
                    <View style={styles.customButtonRow}>
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={showAddWindow ? "Hide custom preferences" : "Show custom preferences"}
                            onPress={() => {
                                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                setShowAddWindow((prev) => !prev);
                            }}
                            style={({ pressed }) => [
                                styles.plusButton,
                                compact && styles.plusButtonCompact,
                                pressed && { opacity: 0.8 },
                            ]}
                        >
                            <Text style={styles.plusButtonText}>{showAddWindow ? '×' : '+'}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>

            <Animated.View
                pointerEvents={showAddWindow ? 'auto' : 'none'}
                style={[
                    styles.drawer,
                    {
                        width: drawerWidth,
                        height: drawerHeight,
                        opacity: panelAnim,
                        transform: [
                            {
                                translateX: panelAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [-(drawerWidth + 32), 0],
                                }),
                            },
                        ],
                    },
                ]}
            >
                {popOutWindow()}
            </Animated.View>
        </View>
    );

}

function PressableButton(PreferenceProps) {

    const { title, onSelectionChange, prefilled, compact } = PreferenceProps;
    const [isSelected, setIsSelected] = useState(prefilled);

    // console.log(`${title}, ${key}`);
    const clickHandler = (nextChecked) => {
        const newSelection = typeof nextChecked === 'boolean' ? nextChecked : !isSelected;
        setIsSelected(newSelection);
        onSelectionChange(newSelection);
    };


    return (
        <>
            <View style={styles.preferenceButton}>
                {/* <Pressable onPress={clickHandler}> */}
                <BouncyButton
                    title={title}
                    onButtonClick={clickHandler}
                    isPreFilled={prefilled}
                    checked={isSelected}
                    compact={compact}
                />
                {/* </Pressable> */}
            </View>
        </>

    );

}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignSelf: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    content: {
        width: '100%',
        maxWidth: 420,
        alignSelf: 'center',
    },
    contentCompact: {
        width: '75%',
        maxWidth: 315,
    },
    customArea: {
        width: '100%',
        maxWidth: 420,
        alignSelf: 'center',
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    customAreaCompact: {
        maxWidth: 315,
        paddingHorizontal: 8,
        paddingBottom: 8,
    },
    customButtonRow: {
        width: '100%',
        alignSelf: 'center',
        alignItems: 'flex-start',
    },
    plusButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#9342f5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    plusButtonCompact: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    plusButtonText: {
        color: '#FFF',
        fontSize: 22,
        lineHeight: 22,
        fontWeight: '700',
    },
    drawer: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
        backgroundColor: '#787575ff',
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 24,
    },
    popOutWindow: {
        width: '100%',
        maxWidth: 420,
        alignSelf: 'center',
        paddingVertical: 10,
        backgroundColor: '#787575ff',

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
        marginVertical: 6,
    },
    listCompact: {
        maxHeight: 100,
        marginVertical: 4,
    },
    itemsContainer: {
        gap: 6,
        padding: 16,
    },
    itemsContainerCompact: {
        gap: 4,
        padding: 10,
    },
    preferenceButton: {
        // padding: 10,
        borderRadius: 8,
        backgroundColor: "#FFF",
        width: '100%',
    }
});

export default PreferenceList;