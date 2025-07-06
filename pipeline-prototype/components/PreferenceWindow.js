import React, { useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import PreferenceList from "./PreferenceList";

function PreferenceWindow({ preferences, preferenceSetter, locationVal, locationSetter }) {

    // const [showList, setShowList] = useState(false);

    const clickHandler = (e) => {
        locationSetter(locationVal + 1);
    }

    if (locationVal !== 3) {
        return;
    }


    return (

        <View style={styles.container}>

            <PreferenceList preferences={preferences} preferenceSetter={preferenceSetter} />
            <View style={styles.buttonContainer}>

                <Button
                    onPress={clickHandler}
                    title="confirm"
                    color="#841522"
                />

            </View>

        </View>

    );

}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // position: 'relative',
        margin: 'auto',
        width: '75vw'


    },
    buttonContainer: {
        zIndex: 10 | undefined,
        position: 'fixed',
        right: '15%',
        bottom: '5%',
        minWidth: 100,

    },
})

export default PreferenceWindow;