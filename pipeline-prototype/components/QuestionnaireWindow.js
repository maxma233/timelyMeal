import { useState, createContext, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import FoodTypeSelector from "./FoodTypeSelector";
import MealSelector from "./MealSelector"
import PreferenceWindow from "./PreferenceWindow";
import CravingWindow from "./CravingWindow";
import NavButton from "./NavButton";
import { PageIndicator } from './PageIndicator/PageIndicator';
import ScheduleSelector from "./ScheduleSelector";
import QuestionBlock from "./QuestionBlock";
import DataChecker from './DataChecker';
import OverviewPage from "./OverviewPage";

export const LocationContext = createContext();
export const QuestionnaireContext = createContext();
export const BeadThemeContext = createContext();

export const DEFAULT_QUESTIONNAIRE = [
    [
        { questions: ['Type of Food:'], component: <FoodTypeSelector />, checkFor: ["foodType"] }, 
        { questions: ['Meals per day?'], component: <MealSelector />, checkFor: ["numMeals"] },
    ],
    [
        { questions: ['Preferences?'], component: <PreferenceWindow />, checkFor: ["preferences", "ethnicCuisines"] }
    ],
    [
        { questions: ['Cravings?', 'Restaurant names?'], component: <CravingWindow />, checkFor: [["preferences", "dishes"], ["preferences", "restaurants"]] }
    ],
    // 'What is the budget?',
    // 'Do you need help scheduling?'
];

const DEFAULT_QUESTIONNAIRE_DATA_STATE = {
        foodType: '', 
        numMeals: 0, 
        preferences: { ethnicCuisines: [], dishes: [], restaurants: [] },
    };

function QuestionnaireWindow({ setIsLoadingPlanRequest }) {
    
    const [locationVal, setLocationVal] = useState(0);
    const [questionnaireData, setQuestionnaireData] = useState(DEFAULT_QUESTIONNAIRE_DATA_STATE);
    const [indicatorBeads, setIndicatorBeads] = useState(new Array(DEFAULT_QUESTIONNAIRE.length).fill("#333"));

    useEffect(() => {
        console.log("Questionnaire Data", questionnaireData)
    }, [questionnaireData]);

    // useEffect(() => {
    //     if (setIsLoadingPlanRequest) console.log('setIsLoadingPlanRequest prop received');
    // }, [setIsLoadingPlanRequest]);

    return (
        <View style={styles.outer}>
            <LocationContext.Provider value={{ locationVal, setLocationVal }}>
                <QuestionnaireContext.Provider value={{ questionnaireData, setQuestionnaireData }}>
                    <BeadThemeContext.Provider value={{ indicatorBeads, setIndicatorBeads }}>
                        {locationVal < DEFAULT_QUESTIONNAIRE.length && (
                            <DataChecker questions={DEFAULT_QUESTIONNAIRE[locationVal]} />
                        )}

                        <View style={styles.card}>
                            {locationVal < DEFAULT_QUESTIONNAIRE.length ? (
                                <View style={styles.inner}>
                                    <View style={styles.headerRow}>
                                        <NavButton direction="left" />
                                        <PageIndicator
                                            vertical={false}
                                            count={DEFAULT_QUESTIONNAIRE.length}
                                            current={locationVal}
                                            beadReferences={indicatorBeads}
                                        />
                                        <NavButton direction="right" />
                                    </View>

                                    <QuestionBlock questions={DEFAULT_QUESTIONNAIRE[locationVal]} />
                                </View>
                            ) : (
                                <OverviewPage setIsLoadingPlanRequest={setIsLoadingPlanRequest} />
                            )}
                        </View>
                    </BeadThemeContext.Provider>
                </QuestionnaireContext.Provider>
            </LocationContext.Provider>
        </View>
    );
}

export default QuestionnaireWindow;

const styles = StyleSheet.create({
    outer: {
        width: '100%',
        alignSelf: 'center',
        maxWidth: 900,
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    card: {
        width: '100%',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
    },
    inner: {
        width: '100%',
        gap: 16,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 6,
    },
});
