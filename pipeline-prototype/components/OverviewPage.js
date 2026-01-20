import React, { useContext, useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { DEFAULT_QUESTIONNAIRE, QuestionnaireContext, LocationContext } from './QuestionnaireWindow.js';
import { Button, Header } from 'react-native-elements';

function OverviewPage({ setIsLoadingPlanRequest }) {

    const { questionnaireData, setQuestionnaireData } = useContext(QuestionnaireContext);
    const { locationVal, setLocationVal } = useContext(LocationContext);
    
    const [loadedQuestions, setLoadedQuestions] = useState(false);
    
    const surveyQuestions = useRef(null);

    useEffect(() => {

        const listOfQuestions = [];
        let questionIndex = 0;
    
        for (const questions of [...DEFAULT_QUESTIONNAIRE]) {
            for (const questionObject of questions) {
                questionObject['questions'].map((questionSentence, index) => {
                    listOfQuestions.push({ question: questionSentence, locationIndex: questionIndex }); 
                    console.log(questionSentence);
                });
            }
            console.log("question index is:", questionIndex);
            questionIndex++;
        }

        surveyQuestions.current = [...listOfQuestions];
        setLoadedQuestions(true);

    }, [])

    const getQuestionName = () => {
        return surveyQuestions.current.shift() ?? 'Unknown Question';
    }

    if (!surveyQuestions.current) {
        return null;
    }

    return (
        <>
            {/* <Header
                centerComponent={{ text: 'Overview of Food Plan', style: styles.title}}
                containerStyle={styles.headerContainer}
            /> */}

            <View
                style={{ display: 'flex', flexDirection: 'column', textAlign: 'left'}}
            >

                <Text
                    style={{ 
                        fontSize: '4rem',
                        fontWeight: '400',
                        fontFamily: 'arial',
                    }}
                >
                    Overview of Food Plan
                </Text>
            
                <View
                    style={{ display: 'flex', flexDirection: 'column', fontSize: '2rem', gap: '1rem' }}
                >

                    {Object.keys(questionnaireData).map((keyValue, index) => {
                        if (questionnaireData[keyValue] instanceof Object) {
                            return (
                                <View
                                    key={`${keyValue}${index}`}
                                    style={{ display: 'inherit', flexDirection: 'inherit', gap: 'inherit' }}                    
                                >
                                    {Object.keys(questionnaireData[keyValue]).map((nestedKeyValue, index) => {
                                        
                                        const valueIsPopulated = Array.isArray(questionnaireData[keyValue][nestedKeyValue]) 
                                        && questionnaireData[keyValue][nestedKeyValue].length > 0; 
                                        
                                        const questionObject = getQuestionName();
                                        const questionIndex = questionObject['locationIndex'];
                                        console.log(questionObject);
                                        
                                        return (
                                            <View 
                                            key={`${nestedKeyValue}${index}`}
                                            >
                                                <Pressable
                                                    onPress={() => {
                                                        console.log(`Pressed question: question: ${questionObject['question']}, locationIndex: ${questionIndex}`);
                                                        setLocationVal(questionIndex);
                                                    }}
                                                >
                                                    <Text style ={{ fontSize: 'inherit'}}>
                                                        {questionObject['question']} {valueIsPopulated ? questionnaireData[keyValue][nestedKeyValue].join(', ') : 'Nothing Selected'}
                                                    </Text>
                                                </Pressable>
                                            </View>  
                                        );
                                    })}
                                </View>
                            );
                        } else {
                            console.log('got a keyVal!', keyValue);

                            const questionObject = getQuestionName();
                            const questionIndex = questionObject['locationIndex'];
                            console.log(questionObject);

                            return (
                                <View
                                key={`${keyValue}${index}`}
                                >
                                    <Pressable onPress={() => {
                                        console.log(`Pressed question: ${keyValue}`)
                                        setLocationVal(questionIndex)        
                                    }}>
                                        <Text
                                            style={{ fontSize: 'inherit '}}
                                        >
                                            {questionObject['question']} {questionnaireData[keyValue] ? (Array.isArray(questionnaireData[keyValue]) ? questionnaireData[keyValue].map(item => item.name).join(', ') : questionnaireData[keyValue]) : 'Nothing Selected'}
                                        </Text>
                                    </Pressable>
                                </View>
                            );
                        }
                    })}
                    
                </View>

                <Button 
                    style={styles.submitButton}
                    color='#c63e26ff'
                    title = "Sent to Model"
                    onPress = {() => {
                        console.log("Sending data to model...", questionnaireData);
                        setIsLoadingPlanRequest(true);
                    }}
                />

            </View>
        </>
    );

}

const styles = StyleSheet.create({
    submitButton: {
        width: '80%',
    },
    container:{
        flex: 1,
        padding:20,
    },
    title:{
        fontSize:20,
        // width: 'fit-content',
        fontWeight: 'bold',
        alignSelf: 'center',
        color: '#FFF',
    },
    headerContainer:{
         backgroundColor: '#007bff',  
        justifyContent: 'center',
        alignItems: 'center',
    },

});

export default OverviewPage;