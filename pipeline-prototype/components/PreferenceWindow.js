import React, { useState, useContext } from "react";
import { Button, StyleSheet, View } from "react-native";
import PreferenceList from "./PreferenceList";
import {LocationContext, QuestionnaireContext} from "./QuestionnaireWindow";
import { ButtonContext } from "../App";

function PreferenceWindow() {
    const {locationVal, setLocationVal} = useContext(LocationContext);
    const {questionnaireData, setQuestionnaireData} = useContext(QuestionnaireContext);
    const parentButtonContext = useContext(ButtonContext);

    const clickHandler = (e) => {
        setLocationVal(locationVal + 1);
    }

    return (

        <View style={styles.container}>
            <View style={styles.preferenceListContainer}>
                <PreferenceList compact />
            </View>
            <View style={styles.nextButtonContainer}>
                <Button
                    onPress={clickHandler}
                    title={"next"}
                    color={parentButtonContext.color}
                    
                    
                />
            </View>

        </View>

    );

}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        position: 'relative',
        // margin: 'auto',
        width: '100%',
        // height: '100%',

    },
    preferenceListContainer: {
        position: 'relative',
        zIndex: 1,
    },
    nextButtonContainer: {
        marginTop: 32,
        paddingBottom: 12,
        position: 'relative',
        zIndex: 0,
    },
    // buttonContainer: {
    //     zIndex: 10,
    //     position: 'absolute',
    //     top: 0,
    //     right: '-5rem',
    //     // right: '15%',
    //     // bottom: '5%',
    //     minWidth: 100,
    // },
})

export default PreferenceWindow;