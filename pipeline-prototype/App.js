import { createContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './components/HomePage';
import QuestionnairePage from './components/QuestionnairePage';

export const ButtonContext = createContext();














const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ButtonContext.Provider value={{ color: '#F44322' }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Landing" component={HomePage} />
          <Stack.Screen name="Questionnaire" component={QuestionnairePage} />
        </Stack.Navigator>
      </NavigationContainer>
    </ButtonContext.Provider>
  );
}