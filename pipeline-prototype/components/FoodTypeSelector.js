import { Button, View } from "react-native";
import { useContext } from "react" 
import {LocationContext, QuestionnaireContext} from "./QuestionnaireWindow";
import { ButtonContext } from "../App";

const FoodTypeSelector = () => {
    const {locationVal, setLocationVal} = useContext(LocationContext);
    const {questionnaireData, setQuestionnaireData} = useContext(QuestionnaireContext);
    const parentThemeContext = useContext(ButtonContext);
    const selectedFoodType = questionnaireData?.foodType || null;

    const foodHandler = (name) => {
        setQuestionnaireData(prev => ({...prev, foodType: name}))
    }

    return (
        <>
            <View style={{ opacity: selectedFoodType === 'Takeout' || selectedFoodType === null ? 1 : 0.5}}>
                <Button
                    color={parentThemeContext.color}
                    
                    title="Takeout"
                    onPress={() => {
                        foodHandler('Takeout')
                    }}
                />
            </View>
            <View style={{ opacity: selectedFoodType === 'Homemade' || selectedFoodType === null ? 1 : 0.5}}>
                <Button
                    color={parentThemeContext.color}
                    title="Homemade"
                    onPress={() => {
                        foodHandler('Homemade')
                    }}
                />
            </View>


        </>
    );
}

export default FoodTypeSelector;