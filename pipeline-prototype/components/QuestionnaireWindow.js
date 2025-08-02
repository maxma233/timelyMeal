import { useState, createContext, useEffect } from "react";
import { View, Text } from "react-native";
import QuestionnaireMap from "./QuestionnaireMap";
import FoodTypeSelector from "./FoodTypeSelector";
import DurationSelector from "./DurationSelector";
import MealSelector from "./MealSelector"
import PreferenceWindow from "./PreferenceWindow";
import CravingWindow from "./CravingWindow";
import BackButton from "./BackButton";
import { PageIndicator } from 'react-native-page-indicator';
import ScheduleSelector from "./ScheduleSelector";

export const LocationContext = createContext();

const DEFAULT_QUESTIONNAIRE = ['How would you like to eat?',
    'How long do you need the plan to be?',
    'How many meals per day?',
    'Preferences?',
    'What are you craving?',
    // 'What is the budget?',
    'Do you need help scheduling?'];

function QuestionnaireWindow() {
    const [locationVal, setLocationVal] = useState(4);
    const [foodType, setFoodType] = useState('');
    const [duration, setDuration] = useState(0);
    const [numMeals, setNumMeals] = useState(0);
    const [preferences, setPreferences] = useState({ ethnicCuisines: [], dishes: [], restaurants: [] });
    const [budget, setBudget] = useState(0);
    const [schedulingFlag, setSchedulingFlag] = useState(false);
    const [scheduleAhead, setScheduleAhead] = useState(null);

    // const renderedQuestions = () => {

    //     switch (questionNum) {
    //         case (0):
    //             return <FoodTypeSelector foodTypeSetter={setFoodType} />
    //         case (1):
    //             return <DurationSelector durationSetter={setDuration} />

    //     }
    // }

    return (
        <View style={{ width: '75vw' }}>


            <QuestionnaireMap locationVal={locationVal} />

            <View>

                <LocationContext value={{ locationVal, setLocationVal }}>

                    <div style={{ display: 'flex' }}>
                        <BackButton />
                        <Text style={{ fontSize: '2.3rem' }}>
                            {DEFAULT_QUESTIONNAIRE[locationVal]}
                        </Text>
                    </div>


                    <View style={{ alignSelf: 'flex-start', left: 0, display: 'flex', flexDirection: 'row', gap: '20px' }}>
                        <PageIndicator style={{ alignSelf: 'center' }} vertical={true} count={DEFAULT_QUESTIONNAIRE.length} current={locationVal} />

                        <View style={{ display: 'flex', flexDirection: 'row', gap: '20px', margin: 'auto', width: '100%', justifyContent: 'space-evenly' }}>
                            <FoodTypeSelector foodTypeSetter={setFoodType} locationVal={locationVal} locationSetter={setLocationVal} />
                            <DurationSelector durationVal={duration} durationSetter={setDuration} locationVal={locationVal} locationSetter={setLocationVal} />
                            <MealSelector mealSetter={setNumMeals} locationVal={locationVal} locationSetter={setLocationVal} />
                            <PreferenceWindow preferences={preferences} preferenceSetter={setPreferences} locationVal={locationVal} locationSetter={setLocationVal} />
                            <CravingWindow preferences={preferences} preferenceSetter={setPreferences} />
                            <ScheduleSelector scheduleAhead={scheduleAhead} setScheduleAhead={setScheduleAhead} />
                        </View>
                    </View>

                </LocationContext>


            </View>


        </View >
    );
}

export default QuestionnaireWindow;
