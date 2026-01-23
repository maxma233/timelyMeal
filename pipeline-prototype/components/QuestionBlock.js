import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';

function QuestionBlock({ questions }) {
    console.log('props', questions)

    const { width } = useWindowDimensions();
    const headingSize = Math.max(18, Math.min(28, Math.round(width * 0.06)));

    return (
            <View style={styles.container}>
                {questions.map((element, index) => (
                    <View key={index} style={styles.block}> 
                        <View style={styles.questionRow}>
                            {element['questions'].map((question, index) => {
                                return (
                                    <View
                                    key={index}
                                    >
                                        <Text
                                            style={[styles.questionText, { fontSize: headingSize }]}
                                            >
                                            {question}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                        <View style={styles.componentRow}>{element.component}</View>
                    </View>
                ))}    
            </View>
    );

}

export default QuestionBlock;

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    block: {
        width: '100%',
        marginBottom: 20,
    },
    questionRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'baseline',
        gap: 6,
        marginBottom: 12,
    },
    questionText: {
        fontWeight: '600',
        color: '#000',
    },
    componentRow: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        alignItems: 'center',
    },
});