import { View, Text, Button } from "react-native";
import Slider from "@react-native-community/slider";
import { Input } from "react-native-elements";

function DurationSelector({ durationVal, durationSetter, locationVal, locationSetter }) {

    const durationHandler = (e) => {
        durationSetter(e.target.value);
        // console.log(durationVal);
    }

    const submitHandler = (e) => {
        if (durationVal === 0) {
            return;
        }

        locationSetter(locationVal + 1);
    }

    if (locationVal !== 1) {
        return (
            <></>
        );
    }

    return (
        <>
            <input type='number' min={1} max={30} onChange={durationHandler} value={durationVal}></input>
            <Button title='Next' onPress={submitHandler} />
        </>
    );

}

export default DurationSelector;