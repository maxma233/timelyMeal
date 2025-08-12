import React, { useEffect, useState, useContext} from "react";
import { Button, Pressable, StyleSheet, Text, View, ScrollView } from "react-native";
import BouncyCheckBox from "react-native-bouncy-checkbox";
import BouncyButton from "./BouncyButton";
import { TextInput } from "react-native-paper";
import {LocationContext, QuestionnaireContext} from "./QuestionnaireWindow";
import { ButtonContext } from "../App";

const DEFAULT_CUISINE_LIST = ['American', 'Mexican', 'Asian', 'Italian']
// const DEFAULT_NUM_OPTIONS = 4

function PreferenceList() {
    const parentButtonContext = useContext(ButtonContext);
    const {questionnaireData, setQuestionnaireData} = useContext(QuestionnaireContext);
    const [showAddWindow, setShowAddWindow] = useState(false);

    const filteredDefault = DEFAULT_CUISINE_LIST.filter((item) => !questionnaireData.preferences.ethnicCuisines.includes(item));
    // console.log("Filtered list: ",filteredDefault);

    useEffect(() => {
        console.log("Ethnic Cuisines: ",questionnaireData.preferences.ethnicCuisines);
    }, [questionnaireData.preferences.ethnicCuisines])

    // const [currentList, setCurrentList] = useState({ list: [...DEFAULT_CUISINE_LIST] });
    const [currentList, setCurrentList] = useState({ list: [...questionnaireData.preferences.ethnicCuisines, ...filteredDefault, ] });
    const [itemName, setItemName] = useState('');
    const [selectedItems, setSelectedItems] = useState([...questionnaireData.preferences.ethnicCuisines]);

    const handleSelection = (item, isSelected) => {
        let updatedSelection;
        if (isSelected) {
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

        if (showAddWindow) {
            // console.log("True!");
            // console.log(parent);
            popOutWindow();
        } else {
            // console.log("False!");
        }

    }, [showAddWindow]);

    const addItem = () => {

        if (itemName.trim()) {

            setCurrentList((prevList) => ({
                list: [...prevList.list, itemName.trim()]
            }));
            handleSelection(itemName.trim(), true);
            setItemName('');
            // setShowAddWindow(false);
        } else {
            throw new Error("Adding empty string to list!");
        }

        console.log(currentList);

    }

    const loadList = () => {

        return (
            <View style={{ gap: '2px', padding: '20px' }}>
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
                    style={{ marginBottom: '5px' }}
                    value={itemName}
                    onChangeText={(value) => setItemName(value)}
                />
                <View style={{ display: "flex", gap: '2px', width: '75%', alignSelf: 'center' }}>
                    <Button
                        title="Close"
                        color={parentButtonContext.color}
                        onPress={() => setShowAddWindow(false)}
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
            {!showAddWindow &&
                <View style={{ width: 'fit-content', alignSelf: 'center' }}>
                    <Button
                        title={"custom preference"}
                        color={parentButtonContext.color}
                        onPress={() => {
                            setShowAddWindow(!showAddWindow)
                        }}
                    />
                </View>
            }
            {showAddWindow && popOutWindow()}
        </View>
    );

}

function PressableButton(PreferenceProps) {

    const { title, onSelectionChange, prefilled } = PreferenceProps;
    const [toggle, setToggle] = useState('false');
    const name = title;
    const [isSelected, setIsSelected] = useState(false);

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
    popOutWindow: {
        width: '50%',
        alignSelf: 'center',
    },
    list: {
        maxHeight: 200,
        width: '100%',
        marginVertical: '1rem',
    },
    preferenceButton: {
        // padding: 10,
        borderRadius: 8,
        backgroundColor: "#FFF",
        width: '100%',
    }
});

export default PreferenceList;