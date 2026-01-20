import { useContext } from "react";
import { View, Text, Button} from "react-native";
import Slider from "@react-native-community/slider";
import { Input } from "react-native-elements";
import { LocationContext, QuestionnaireContext } from "./QuestionnaireWindow";
import { ButtonContext } from "../App";

function DurationSelector() {

    const { locationVal, setLocationVal } = useContext(LocationContext);
    const { questionnaireData, setQuestionnaireData } = useContext(QuestionnaireContext);
    const parentThemeContext = useContext(ButtonContext);

    const durationHandler = (e) => {
        setQuestionnaireData((prev) => ({ ...prev, duration: e.target.value}));
    }

    return (
        <>
            <input type='number' min={1} max={30} onChange={durationHandler} value={questionnaireData.duration}></input>
        </>
    );

}

export default DurationSelector;