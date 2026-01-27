import React, { useContext, useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { DEFAULT_QUESTIONNAIRE, QuestionnaireContext, LocationContext } from './QuestionnaireWindow.js';
import { Button } from 'react-native-elements';

function OverviewPage({ save }) {

    const [loadedQuestions, setLoadedQuestions] = useState(false);

    const { questionnaireData } = useContext(QuestionnaireContext);
    const { setLocationVal } = useContext(LocationContext);

    const { width } = useWindowDimensions();
    const titleSize = Math.max(22, Math.min(34, Math.round(width * 0.065)));
    
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

            <ScrollView contentContainerStyle={styles.container}>

                <Text
                    style={[styles.title, { fontSize: titleSize }]}
                >
                    Overview of Food Plan
                </Text>
            
                <View
                    style={styles.list}
                >

                    {Object.keys(questionnaireData).map((keyValue, index) => {
                        if (questionnaireData[keyValue] instanceof Object) {
                            return (
                                <View
                                    key={`${keyValue}${index}`}
                                    style={styles.nestedGroup}
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
                                                    style={styles.rowPressable}
                                                >
                                                    <Text style={styles.rowText}>
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
                                    <Pressable
                                        style={styles.rowPressable}
                                        onPress={() => {
                                        console.log(`Pressed question: ${keyValue}`)
                                        setLocationVal(questionIndex)        
                                    }}>
                                        <Text
                                            style={styles.rowText}
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
                        save(questionnaireData);
                    }}
                />

            </ScrollView>
        </>
    );

}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: 8,
        paddingHorizontal: 4,
        gap: 14,
    },
    title: {
        fontWeight: '600',
        color: '#000',
    },
    list: {
        width: '100%',
        gap: 10,
    },
    nestedGroup: {
        width: '100%',
        gap: 10,
    },
    rowPressable: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 12,
        backgroundColor: '#FFF',
    },
    rowText: {
        fontSize: 16,
        color: '#000',
    },
    submitButton: {
        width: '80%',
        alignSelf: 'center',
        marginTop: 8,
    },
});

export default OverviewPage;