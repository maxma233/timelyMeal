import { View, StyleSheet } from "react-native";
import { ArrowLeft } from "lucide-react-native";

function BackButton({ locationVal, locationSetter }) {

    const clickHandler = (event) => {
        if (locationVal === 0) {
            return;
        }
        locationSetter(locationVal - 1);

        console.log(`Location Value: ${locationVal}`);
    }

    return (

        <View style={styles.backButton}>

            <button
                onClick={clickHandler}
            >
                <ArrowLeft size={20} color="#000" />
            </button>


        </View>

    );

}

export default BackButton;

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