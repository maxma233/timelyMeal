import React, { createContext, useEffect } from 'react';
import { Platform, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './components/HomePage';
import QuestionnairePage from './components/QuestionnairePage';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

export const ButtonContext = createContext();
const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (!fontsLoaded) {
      return;
    }
    const defaultFontFamily = Platform.OS === 'web' ? 'Inter' : 'Inter_700Bold';
    const defaultTextProps = Text.defaultProps || {};
    Text.defaultProps = {
      ...defaultTextProps,
      style: [{ fontFamily: defaultFontFamily, fontWeight: '700' }, defaultTextProps.style],
    };
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

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