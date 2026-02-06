import React from "react";
import {
    StyleSheet,
    Text,
    View,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

function BouncyButton({ title, onButtonClick, isPreFilled, checked, compact = false }) {
    const [checkboxState, setCheckboxState] = React.useState(isPreFilled ? true : false);
    const isCheckedValue = typeof checked === 'boolean' ? checked : checkboxState;


    return (
        <View style={styles.container}>
            <View style={[styles.checkboxesContainer, compact && styles.checkboxesContainerCompact]}>
                <View style={styles.titleCheckboxRow}>
                    <Text style={[styles.titleText, compact && styles.titleTextCompact]} numberOfLines={1}>
                        {title}
                    </Text>
                    <BouncyCheckbox
                        disableText
                        fillColor="#9342f5"
                        size={compact ? 18 : 20}
                        iconStyle={{ borderColor: '#9342f5' }}
                        isChecked={isCheckedValue}
                        onPress={(nextChecked) => {
                            setCheckboxState(nextChecked);
                            onButtonClick?.(nextChecked);
                        }}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    checkboxesContainer: {
        padding: 16,
        width: '100%',
    },
    checkboxesContainerCompact: {
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    titleCheckboxRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
    },
    titleTextCompact: {
        fontSize: 14,
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