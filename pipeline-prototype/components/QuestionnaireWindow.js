// import { useEffect } from "react";
import { useState } from "react";
import { View, Text } from "react-native";
import QuestionnaireMap from "./QuestionnaireMap";
import FoodTypeSelector from "./FoodTypeSelector";
import DurationSelector from "./DurationSelector";
import MealSelector from "./MealSelector"

const DEFAULT_QUESTIONNAIRE = ['How would you like to eat?',
    'How long do you need the plan to be?',
    'How many meals per day?',
    'Preferences?',
    'What are you craving?',
    'What is the budget?',
    'Do you need help scheduling?'];

function QuestionnaireWindow() {
    const [locationVal, setLocationVal] = useState(0);
    const [foodType, setFoodType] = useState('');
    const [duration, setDuration] = useState(0);
    const [numMeals, setNumMeals] = useState(0);
    const [preferences, setPreferences] = useState({ ethnicCuisines: [], dishes: [], restaurants: [] });
    const [budget, setBudget] = useState(0);
    const [schedulingFlag, setSchedulingFlag] = useState(false);

    // const renderedQuestions = () => {

    //     switch (questionNum) {
    //         case (0):
    //             return <FoodTypeSelector foodTypeSetter={setFoodType} />
    //         case (1):
    //             return <DurationSelector durationSetter={setDuration} />

    //     }
    // }

    return (
        <View>

            <QuestionnaireMap locationVal={locationVal} />

            <Text style={{ fontSize: '2.3rem', alignSelf: 'flex-start' }}>
                {DEFAULT_QUESTIONNAIRE[locationVal]}
            </Text>

            <FoodTypeSelector foodTypeSetter={setFoodType} locationVal={locationVal} locationSetter={setLocationVal} />
            <DurationSelector durationVal={duration} durationSetter={setDuration} locationVal={locationVal} locationSetter={setLocationVal} />
            <MealSelector numMeals={numMeals} mealSetter={setNumMeals} locationVal={locationVal} locationSetter={setLocationVal} />


        </View>
    );
}

export default QuestionnaireWindow;
