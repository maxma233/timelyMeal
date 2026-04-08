import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import QuestionnaireWindow from './QuestionnaireWindow';
import LoadingScreen from './LoadingScreen';
import MealPlanView from './MealPlanView';

function QuestionnairePage() {
  const navigation = useNavigation();

  const modelEndpoint = process.env.EXPO_PUBLIC_MODEL_HOST_ENDPOINT;

  const [isLoadingPlanRequest, setIsLoadingPlanRequest] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [promptData, setPromptData] = useState(null);
  const [mealPlanText, setMealPlanText] = useState('');
  const [modelError, setModelError] = useState('');

  useEffect(() => {
    if (!isLoadingPlanRequest || !promptData) {
      setLoadingProgress(0);
      return;
    }

    setLoadingProgress(10);
    const id = setInterval(() => {
      setLoadingProgress((p) => (p >= 90 ? p : p + 10));
    }, 300);

    handleSearch(promptData);

    return () => clearInterval(id);
  }, [isLoadingPlanRequest, promptData]);

  const handleSearch = async (data) => {
    
    if (data == null) {
      console.error('No form data passed into the search!')
      setLoadingProgress(0);
      setIsLoadingPlanRequest(false);
      return;
    }

    try {

      const response = await fetch(`http://${modelEndpoint}/prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: data }),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result?.Error || 'Unable to generate meal plan right now.';
        setModelError(errorMessage);
        return;
      }

      const message = result?.Message;

      if (!message || typeof message !== 'string') {
        setModelError('The model returned an empty meal plan.');
        return;
      }

      setMealPlanText(message);
      setModelError('');
      setLoadingProgress(100);

    } catch (err) {
      console.error('An error occurred while sending the model a prompt');
      setModelError('Could not connect to the model service. Please try again.');
      setLoadingProgress(0);
    } finally {
      setIsLoadingPlanRequest(false);
    }

  }

  const handleBackToQuestionnaire = () => {
    setMealPlanText('');
    setModelError('');
    setLoadingProgress(0);
    setPromptData(null);
  };

  return (
    <SafeAreaView style={styles.body}>
      <View style={styles.navigation}>
        <Pressable style={styles.brand} onPress={() => navigation.navigate('Landing')}>
          <Image source={require('../assets/logoplaceholder.jpg')} style={styles.logo} />
          <Text style={styles.paragraph}>TimelyMeals</Text>
        </Pressable>

        <View style={styles.navLinks}>
          <Text style={styles.naviElement}>Link (Element)</Text>
          <Text style={styles.naviElement}>Sign in with Google (Element)</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {isLoadingPlanRequest ? (
          <LoadingScreen progress={loadingProgress} />
        ) : mealPlanText ? (
          <MealPlanView mealPlanText={mealPlanText} onBuildAnother={handleBackToQuestionnaire} />
        ) : modelError ? (
          <MealPlanView error={modelError} onBuildAnother={handleBackToQuestionnaire} />
        ) : (
        <QuestionnaireWindow setIsLoadingPlanRequest={setIsLoadingPlanRequest} savePromptData={setPromptData} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default QuestionnairePage;

const styles = StyleSheet.create({
  navigation: {
    color: '#ffffff',
    backgroundColor: '#F44322',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  naviElement: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#000000',
  },
  body: {
    flex: 1,
    backgroundColor: '#FEF1EE',
    padding: 8,
  },
  paragraph: {
    color: '#ffffff',
    marginHorizontal: 12,
    fontSize: 24,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  content: {
    width: '100%',
    alignSelf: 'center',
    paddingVertical: 16,
    maxWidth: 900,
    gap: 16,
  },
});
