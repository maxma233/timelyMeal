import { View, Text } from 'react-native';

function QuestionBlock({ questions }) {
    console.log('props', questions)

    return (
            <View>
                {questions.map((element, index) => (
                    <View key={index} style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '30px'}}> 
                        <View
                            style={{ display: 'flex', flexDirection: 'row', gap: '.5rem' }}
                        >
                            {element['questions'].map((question, index) => {
                                return (
                                    <View
                                    key={index}
                                    >
                                        <Text
                                            style={{fontSize: '3vw'}}
                                            >
                                            {question}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', gap: '1rem', fontSize: '1.5vw', width: '100%', alignSelf: 'flex-start'}}>{element.component}</View>
                    </View>
                ))}    
            </View>
    );

}

export default QuestionBlock;