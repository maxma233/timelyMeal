import { View, StyleSheet, } from "react-native";
import { useContext } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react-native";
import { LocationContext } from "./QuestionnaireWindow";
import { DEFAULT_QUESTIONNAIRE } from "./QuestionnaireWindow";

function NavButton({ direction = "left"}) {

    const { locationVal, setLocationVal } = useContext(LocationContext);
    const isNegative = direction === "left";
    const increment = isNegative ? -1 : 1;

    const clickHandler = (event) => {
        setLocationVal(Math.min(Math.max(0, locationVal + increment), DEFAULT_QUESTIONNAIRE.length - 1));
    }

    return (

        <View style={styles.backButton}>
            <button
                onClick={() => {clickHandler()}}
                >
                {isNegative ? (
                    <ArrowLeft size={10} color="#000" />
                ) : (
                    <ArrowRight size={10} color="#000" />
                )}
            </button>
        </View>

    );

}

export default NavButton;

const styles = StyleSheet.create({
    backButton: {
        backgroundColor: "transparent",
        padding: 10,
        borderRadius: 50,
        width: 50,
        height: 50,
        alignItems: 'center',
    }
});