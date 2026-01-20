import React, { useEffect, useState, useContext } from 'react';
import { QuestionnaireContext, LocationContext, BeadThemeContext } from './QuestionnaireWindow';

function DataChecker({ questions }) {

    const { questionnaireData } = useContext(QuestionnaireContext);
    const { locationVal } = useContext(LocationContext);
    const { indicatorBeads, setIndicatorBeads } = useContext(BeadThemeContext);
    const [questionCompleted, setQuestionCompleted] = useState(false);
    const [completedQuestions, setCompletedQuestions] = useState([false, false, false]);
    const keys = [];

    useEffect(() => {
        if (!completedQuestions[locationVal]) {
            indicatorBeads[locationVal] = "#B33";
            setIndicatorBeads((prev) => ([...indicatorBeads]));
            setQuestionCompleted(false);
        }
    }, [locationVal])
    
    console.log("Questions: ", questions);
    
    function keySearch(value, key) {
        // console.log("Key List");
        // console.dir(key);
        if (key.length === 0) {
            // console.log('returning', value);
            return value;
        }
        const searchKey = key.shift();
        // console.log("Search Key:", searchKey);
        // console.log("Located value: ", value[searchKey]);
        return keySearch(value[searchKey], key);
    }
    
    function parseKeys(keys) {
        if (!Array.isArray(keys[0])) {
            // console.log("RETURNING KEY VALUE", keys)
            return keys;
        }
        const currentVal = keys[0];
        // console.log("Current Value of Keys", currentVal);
        return parseKeys(currentVal);
    }
    
    
    useEffect(() => {
        // keys = new Array();
        for (const question of questions) {
            const key = [...question.checkFor];
            keys.push(key);
        }
        
        console.log("Checking for ", keys);
        for (const key of keys) {
            // console.log("key");
            // console.dir(key);
            
            const parse = [...key];
            const returnedKeySet = parseKeys(parse);
            const keyArray = [...returnedKeySet];
            const value = keySearch(questionnaireData, keyArray);
            console.log('value', value);
            if (Array.isArray(value) && value.length === 0 || !value) {
                setQuestionCompleted(false);   
                indicatorBeads[locationVal] = "#B33";
                completedQuestions[locationVal] = false;
                setCompletedQuestions([...completedQuestions]);
                setIndicatorBeads((prev) => ([...indicatorBeads]));
                return;
            };
        }
        
        // Empty the keys list
        // while (keys.length > 0) {
            //     keys.pop();
        // }
        

        setQuestionCompleted(true);
        
        completedQuestions[locationVal] = true;
        setCompletedQuestions([...completedQuestions]);

    }, [questionnaireData]);
    
    useEffect(() => {
        if (questionCompleted) {
            indicatorBeads[locationVal] = "#3E3";
            setIndicatorBeads((prev) => ([...indicatorBeads]));
        }
        // console.log(questionCompleted);
    }, [questionCompleted])

    return null;
}

export default DataChecker;