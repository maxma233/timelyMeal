import React, { useEffect, useState, useContext } from 'react';
import { QuestionnaireContext, LocationContext, BeadThemeContext } from './QuestionnaireWindow';

function DataChecker({ questions }) {

    const { questionnaireData } = useContext(QuestionnaireContext);
    const { locationVal } = useContext(LocationContext);
    const { indicatorBeads, setIndicatorBeads } = useContext(BeadThemeContext);
    
    console.log("Questions: ", questions);
    
    const getValueByPath = (data, path) => {
        return path.reduce((acc, key) => (acc ? acc[key] : undefined), data);
    };

    const isValueFilled = (value) => {
        if (Array.isArray(value)) {
            return value.length > 0;
        }
        return Boolean(value);
    };

    useEffect(() => {
        const checks = questions.flatMap((question) => {
            const checkFor = question.checkFor;
            if (!checkFor) return [];
            return Array.isArray(checkFor[0]) ? checkFor : [checkFor];
        });

        const isComplete = checks.every((path) => {
            const value = getValueByPath(questionnaireData, [...path]);
            return isValueFilled(value);
        });

        setIndicatorBeads((prev) => {
            const next = [...prev];
            next[locationVal] = isComplete ? "#3E3" : "#B33";
            return next;
        });
    }, [questionnaireData, locationVal, questions, setIndicatorBeads]);

    return null;
}

export default DataChecker;