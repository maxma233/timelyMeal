import { Button, View } from "react-native";
import { useContext, useState } from "react";
import { LocationContext, QuestionnaireContext } from "./QuestionnaireWindow";
import { ButtonContext } from "../App";

function MealSelector() {
    
    const { locationVal, setLocationVal } = useContext(LocationContext);
    const { questionnaireData, setQuestionnaireData } = useContext(QuestionnaireContext);
    const [ buttonSelected, setButtonSelected ] = useState(null);
    const parentThemeContext = useContext(ButtonContext);

    const mealHandler = (mealVal) => {
        setButtonSelected(mealVal);
        setQuestionnaireData((prev) => ({ ...prev, numMeals: mealVal}))
    }

    const isSelected = (buttonVal) => {
        return buttonSelected === buttonVal; 
    }

    return (
        <>
            <View style={{ opacity: isSelected(2) || buttonSelected === null ? 1 : 0.5}}>
                <Button
                    color={parentThemeContext.color} 
                    onPress={() => mealHandler(2)} 
                    title='2 Meals' 
                    />
            </View>
            <View style={{ opacity: isSelected(3) || buttonSelected === null ? 1 : 0.5}}>
                <Button 
                    color={parentThemeContext.color}
                    onPress={() => mealHandler(3)} 
                    title='3 Meals' 
                    />
            </View>
            <View style={{ opacity: isSelected(4) || buttonSelected === null ? 1 : 0.5}}>
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