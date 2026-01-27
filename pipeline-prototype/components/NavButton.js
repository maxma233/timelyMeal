import { View, StyleSheet, Pressable } from "react-native";
import { useContext } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react-native";
import { LocationContext } from "./QuestionnaireWindow";
import { DEFAULT_QUESTIONNAIRE } from "./QuestionnaireWindow";

function NavButton({ direction = "left"}) {

    const { locationVal, setLocationVal } = useContext(LocationContext);
    const isNegative = direction === "left";
    const increment = isNegative ? -1 : 1;

    const clickHandler = (event) => {
        // Allow navigating to the overview page (locationVal === DEFAULT_QUESTIONNAIRE.length)
        // and back from it.
        const maxLocation = DEFAULT_QUESTIONNAIRE.length;
        setLocationVal(Math.min(Math.max(0, locationVal + increment), maxLocation));
    }

    return (

        <View style={styles.backButton}>
            <Pressable
                accessibilityRole="button"
                hitSlop={10}
                style={styles.pressable}
                onPress={clickHandler}
            >
                {isNegative ? (
                    <ArrowLeft size={22} color="#000" />
                ) : (
                    <ArrowRight size={22} color="#000" />
                )}
            </Pressable>
        </View>

    );

}

export default NavButton;

const styles = StyleSheet.create({
    backButton: {
        backgroundColor: "transparent",
        padding: 6,
        borderRadius: 50,
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    }
    ,
    pressable: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});