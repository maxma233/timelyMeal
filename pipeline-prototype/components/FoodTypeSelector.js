import { Button, View } from "react-native";

const FoodTypeSelector = ({ foodTypeSetter, locationVal, locationSetter }) => {

    const foodHandler = (name) => {
        foodTypeSetter(name);
        locationSetter(locationVal + 1);
    }

    if (locationVal !== 0) {
        return (
            <></>
        );
    }

    return (
        <>
            <Button
                title="Takeout"
                onPress={() => {
                    foodHandler('Takeout')
                }}
            />
            <Button
                title="Homemade"
                onPress={() => {
                    foodHandler('Homemade')
                }}
            />


        </>
    );
}

export default FoodTypeSelector;