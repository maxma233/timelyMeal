import { Button, View } from "react-native";
import { useContext, useState} from "react" 
import {LocationContext, QuestionnaireContext} from "./QuestionnaireWindow";
import { ButtonContext } from "../App";

const FoodTypeSelector = () => {
    const {locationVal, setLocationVal} = useContext(LocationContext);
    const {questionnaireData, setQuestionnaireData} = useContext(QuestionnaireContext);
    const parentThemeContext = useContext(ButtonContext);
    const [buttonSelected, setButtonSelected] = useState(null);

    const foodHandler = (name) => {
        setQuestionnaireData(prev => ({...prev, foodType: name}))
    }

    return (
        <>
            <View style={{ opacity: buttonSelected === 'Takeout' || buttonSelected === null ? 1 : 0.5}}>
                <Button
                    color={parentThemeContext.color}
                    
                    title="Takeout"
                    onPress={() => {
                        setButtonSelected('Takeout')
                        foodHandler('Takeout')
                    }}
                />
            </View>
            <View style={{ opacity: buttonSelected === 'Homemade' || buttonSelected === null ? 1 : 0.5}}>
                <Button
                    color={parentThemeContext.color}
                    title="Homemade"
                    onPress={() => {
                        setButtonSelected('Homemade')
                        foodHandler('Homemade')
                    }}
                />
            </View>


        </>
    );
}

export default FoodTypeSelector;