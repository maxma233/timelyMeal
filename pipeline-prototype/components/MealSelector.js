import { Button, View } from "react-native";
import { useContext } from "react";
import { LocationContext, QuestionnaireContext } from "./QuestionnaireWindow";
import { ButtonContext } from "../App";

function MealSelector() {
    
    const { locationVal, setLocationVal } = useContext(LocationContext);
    const { questionnaireData, setQuestionnaireData } = useContext(QuestionnaireContext);
    const parentThemeContext = useContext(ButtonContext);
    const selectedMeals = questionnaireData?.numMeals || null;

    const mealHandler = (mealVal) => {
        setQuestionnaireData((prev) => ({ ...prev, numMeals: mealVal}))
    }

    const isSelected = (buttonVal) => {
        return selectedMeals === buttonVal; 
    }

    return (
        <>
            <View style={{ opacity: isSelected(2) || selectedMeals === null ? 1 : 0.5}}>
                <Button
                    color={parentThemeContext.color} 
                    onPress={() => mealHandler(2)} 
                    title='2 Meals' 
                    />
            </View>
            <View style={{ opacity: isSelected(3) || selectedMeals === null ? 1 : 0.5}}>
                <Button 
                    color={parentThemeContext.color}
                    onPress={() => mealHandler(3)} 
                    title='3 Meals' 
                    />
            </View>
            <View style={{ opacity: isSelected(4) || selectedMeals === null ? 1 : 0.5}}>
                <Button 
                    color={parentThemeContext.color}
                    onPress={() => mealHandler(4)} 
                    title='4 Meals' 
                    />
            </View>
        </>
    );

}

export default MealSelector;