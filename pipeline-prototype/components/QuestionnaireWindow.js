import { useState, createContext, useEffect, useRef } from "react";
import { View, Text } from "react-native";
import FoodTypeSelector from "./FoodTypeSelector";
import DurationSelector from "./DurationSelector";
import MealSelector from "./MealSelector"
import PreferenceWindow from "./PreferenceWindow";
import CravingWindow from "./CravingWindow";
import NavButton from "./NavButton";
import { PageIndicator } from './PageIndicator/PageIndicator';
import ScheduleSelector from "./ScheduleSelector";
import QuestionBlock from "./QuestionBlock";
import DataChecker from './DataChecker';

export const LocationContext = createContext();
export const QuestionnaireContext = createContext();
export const BeadThemeContext = createContext();

export const DEFAULT_QUESTIONNAIRE = [
    [
        { question: 'Type of Food:', component: <FoodTypeSelector />, checkFor: ["foodType"] }, 
        { question: 'Duration (Days)?', component: <DurationSelector />, checkFor: ["duration"] },
        { question: 'Meals per day?', component: <MealSelector />, checkFor: ["numMeals"] },
    ],
    [
        { question: 'Preferences?', component: <PreferenceWindow />, checkFor: ["preferences", "ethnicCuisines"] }
    ],
    [
        { question: 'What are you craving?', component: <CravingWindow />, checkFor: [["preferences", "dishes"], ["preferences", "restaurants"]] }
    ],
    // 'What is the budget?',
    // 'Do you need help scheduling?'
];

const DEFAULT_QUESTIONNAIRE_DATA_STATE = {
        foodType: '', 
        duration: 0, 
        numMeals: 0, 
        preferences: { ethnicCuisines: [], dishes: [], restaurants: [] },
    };

function QuestionnaireWindow() {
    
    const [locationVal, setLocationVal] = useState(0);
    const [questionnaireData, setQuestionnaireData] = useState(DEFAULT_QUESTIONNAIRE_DATA_STATE);
    const [indicatorBeads, setIndicatorBeads] = useState(new Array(DEFAULT_QUESTIONNAIRE.length).fill("#333"));

    useEffect(() => {
        console.log("Questionnaire Data", questionnaireData)







    }, [questionnaireData]);

    return (
        <View style={{ width: '75vw' }}>
            <View>

                <LocationContext value={{ locationVal, setLocationVal }}>
                    <QuestionnaireContext value={{ questionnaireData, setQuestionnaireData }}>
                        <BeadThemeContext value={{ indicatorBeads, setIndicatorBeads }}>
                            <DataChecker questions={DEFAULT_QUESTIONNAIRE[locationVal]}/>
                            <View style={{ alignSelf: 'center', display: 'flex', position: 'relative', flexDirection: 'row', gap: '20px' }}>
                                <View style={{width: 'fit-content', position: 'absolute', left: '-5rem', top: 0, display: 'flex', flexDirection: 'row'}}>
                                </View>

                                    <View style={{ display: 'flex', flexDirection: 'col', gap: '20px', margin: 'auto', width: '100%', justifyContent: 'space-evenly' }}>
                                        <View style={{ display: 'flex', flexDirection: 'row', gap: '10px', justifyContent: 'center' }}>
                                            <NavButton direction="left"/>
                                                <PageIndicator style={{ }} vertical={false} count={DEFAULT_QUESTIONNAIRE.length} current={locationVal} beadReferences={indicatorBeads} />
                                            <NavButton direction="right"/>
                                        </View>
                                        <QuestionBlock questions={DEFAULT_QUESTIONNAIRE[locationVal]} />
                                    </View>

                            </View>
                        </BeadThemeContext>
                    </QuestionnaireContext>
                </LocationContext>
            </View>
        </View >
    );
}

export default QuestionnaireWindow;
