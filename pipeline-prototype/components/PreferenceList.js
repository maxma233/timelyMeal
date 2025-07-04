import React, { useEffect, useState } from "react";
import { Button, Pressable, StyleSheet, Text, View, ScrollView } from "react-native";
import BouncyCheckBox from "react-native-bouncy-checkbox";
import BouncyButton from "./BouncyButton";
import { TextInput } from "react-native-paper";

const DEFAULT_CUISINE_LIST = ['American', 'Mexican', 'Asian', 'Italian']
// const DEFAULT_NUM_OPTIONS = 4

function PreferenceList({ preferences, preferenceSetter }) {

    const [showAddWindow, setShowAddWindow] = useState(false);
    const [currentList, setCurrentList] = useState({ list: [...DEFAULT_CUISINE_LIST] });
    const [itemName, setItemName] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);

    console.log(preferences);

    const handleSelection = (item, isSelected) => {
        let updatedSelection;
        if (isSelected) {
            updatedSelection = [...selectedItems, item];
        } else {
            updatedSelection = selectedItems.filter(selectedItems => selectedItems != item);
        }
        setSelectedItems(updatedSelection);

        preferenceSetter(prev => ({
            ...prev,
            ethnicCuisines: updatedSelection
        }));

        console.log(preferences);

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
            setItemName('');
            // setShowAddWindow(false);
        } else {
            throw new Error("Adding empty string to list!");
        }

        console.log(currentList);

    }

    const loadList = () => {

        return (
            <View>
                {currentList.list.map((item, index) => (
                    <View key={index} style={{ display: "flex" }}>
                        <PressableButton
                            title={item}
                            onSelectionChange={(isSelected) => handleSelection(item, isSelected)} />
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
                    placeholder="enter new cuisine type"
                    style={styles.TextInput}
                    value={itemName}
                    onChangeText={(value) => setItemName(value)}
                />
                <View style={{ display: "flex" }}>
                    <Button
                        title="Close"
                        onPress={() => setShowAddWindow(false)}
                    />
                    <Button
                        title="Add"
                        onPress={() => addItem()}
                    />
                </View>

            </View>
        );
    }

    return (
        <View>
            <ScrollView
                style={styles.list}
            // showsVerticalScrollIndicator={true}
            // showsHorizontalScrollIndicator={false}
            >
                {loadList()}
                {!showAddWindow &&
                    <Button
                        title={"Add"}
                        onPress={() => {
                            setShowAddWindow(!showAddWindow)
                        }}
                    />
                }

            </ScrollView>
            {showAddWindow && popOutWindow()}
        </View>
    );

}

function PressableButton(PreferenceProps) {

    const { title, onSelectionChange } = PreferenceProps;
    const [toggle, setToggle] = useState('false');
    const name = title;
    const [isSelected, setIsSelected] = useState(false);

    // console.log(`${title}, ${key}`);
    const clickHandler = (message) => {

        console.log("Message from child", message);

        const newSelection = !isSelected;
        setIsSelected(newSelection);
        onSelectionChange(newSelection);
        console.log(`${title} is now ${newSelection ? 'selected' : 'unselected'}`);
    }


    return (
        <>
            <View style={styles.preferenceButton}>
                {/* <Pressable onPress={clickHandler}> */}
                <BouncyButton title={title} onButtonClick={clickHandler} />
                {/* </Pressable> */}
            </View>
        </>

    );

}

const styles = StyleSheet.create({
    popOutWindow: {

    },
    list: {
        maxHeight: 200,
    },
    preferenceButton: {
        // padding: 10,
        borderRadius: 8,
        backgroundColor: "#FFF",
        width: 200,
    }
});

export default PreferenceList;