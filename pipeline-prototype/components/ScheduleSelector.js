import { useState, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LocationContext } from "./QuestionnaireWindow";

function ScheduleSelector({ scheduleAhead, setScheduleAhead }) {

    const parentContext = useContext(LocationContext);
    const { locationVal, setLocationVal } = parentContext;

    if (locationVal !== 5) {
        return;
    }

    return (
        <View style={styles.container}>


            <TouchableOpacity style={styles.button} onPress={() => { setScheduleAhead(true) }}>
                <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => { setScheduleAhead(false) }}>
                <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>

            {scheduleAhead !== null && (
                <Text style={styles.result}>
                    You selected: {scheduleAhead ? 'Yes' : 'No'}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
    },
    question: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        margin: 10,
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    result: {
        marginTop: 20,
        fontSize: 16,
        color: '#333',
    },
});

export default ScheduleSelector;