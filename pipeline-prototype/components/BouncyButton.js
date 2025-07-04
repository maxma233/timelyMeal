import React from "react";
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import RNBounceable from "@freakycoder/react-native-bounceable";

function BouncyButton({ title, onButtonClick }) {
    let bouncyCheckboxRef = BouncyCheckbox;
    const [checkboxState, setCheckboxState] = React.useState(false);
    const value = title;

    const clickHandler = (isChecked) => {

        onButtonClick("Bouncy Button clicked");

        console.log(`Checked ${value}:: ${isChecked}`)
        // Alert.alert(`Checked:: ${isChecked}`);
    }


    return (
        <SafeAreaView
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {/* <View style={{ ...styles.checkboxesContainer, ...{ display: "flex" } }}> */}
            <View style={styles.checkboxesContainer}>
                <View style={styles.titleCheckboxRow}>
                    <Text style={styles.titleText}>{title}</Text>
                    <BouncyCheckbox
                        ref={bouncyCheckboxRef}
                        disableText
                        fillColor="#9342f5"
                        size={20}
                        iconImageStyle={styles.iconImageStyle}
                        iconStyle={{ borderColor: '#9342f5' }}
                        onPress={isChecked => {
                            clickHandler(isChecked);
                        }}

                    />
                </View>

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    checkboxesContainer: {
        padding: 16,
        width: '100%',
    },
    titleCheckboxRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    titleText: {
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
    },
    checkboxSyntheticContainer: {
        alignItems: 'center',
    },
    syntheticButton: {
        backgroundColor: '#9342f5',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
});

export default BouncyButton;