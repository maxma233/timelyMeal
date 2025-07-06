import { Button, View } from "react-native"

function MealSelector(props) {

    const { mealSetter, locationVal, locationSetter } = props;


    const mealHandler = (mealVal) => {
        mealSetter(mealVal);
        locationSetter(locationVal + 1);
    }

    if (locationVal !== 2) {
        return (
            <></>
        );
    }

    return (
        <>
            <Button onPress={() => mealHandler(2)} title='2 Meals'></Button>
            <Button onPress={() => mealHandler(3)} title='3 Meals'></Button>
            <Button onPress={() => mealHandler(4)} title='4 Meals'></Button>
        </>
    );

}

export default MealSelector;