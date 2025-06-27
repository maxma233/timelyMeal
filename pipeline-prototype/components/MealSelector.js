import { Text, View, Button } from "react-native"

function MealSelector({ numMeals, mealSetter, locationVal, locationSetter }) {

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
            <Button title='2 Meals' onPress={(e) => mealHandler(2)}></Button>
            <Button title='3 Meals' onPress={(e) => mealHandler(3)}></Button>
            <Button title='4 Meals' onPress={(e) => mealHandler(4)}></Button>
        </>
    );

}

export default MealSelector;