import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { createRef, useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { loadingStyles } from '../lib/styles/progess_loader_styles';
import QuestionnaireWindow from './QuestionnaireWindow';
import { PlanGenerationContext } from './Context/PlanGenerationContext';
import { PlanConfirmationView } from './PlanConfirmationView';

function QuestionnairePage() {
  const navigation = useNavigation();

  const modelEndpoint = process.env.EXPO_PUBLIC_MODEL_HOST_ENDPOINT;

  const [isLoadingPlanRequest, setIsLoadingPlanRequest] = useState(false);
  const [promptData, setPromptData] = useState(null);
  const promptResult = createRef(null);

  const { setIsGenerating, setShowFloatingToast } = useContext(PlanGenerationContext);

  useEffect(() => {
    if (!isLoadingPlanRequest) {
      return;
    }

    handleSearch(promptData);

    // return () => clearInterval(id);
  }, [isLoadingPlanRequest, promptData]);

  useEffect(() => {
    if (!promptResult.current) return;
    console.log('received prompt results');
    console.log(promptResult.current);

    // FIXME: Proceed to plan at this point
    // navigation.navigate('Landing');
  }, [promptResult])

  const handleSearch = async (data) => {

    if (data == null) {
      console.error('No form data passed into the search!')
      setIsGenerating(false);
      setShowFloatingToast(false);
      setIsLoadingPlanRequest(false);
      return;
    }

    setIsGenerating(true);

    try {

      const response = await fetch(`http://${modelEndpoint}/prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: data }),
      });

      if (!response.ok) {
        throw new Error('Model request failed');
      }

      promptResult.current = await response.text() || null;

    } catch (err) {
      console.error('An error occurred while sending the model a prompt');
      if (!prompt.current) console.error('No response was found');
    }

    setIsGenerating(false);
    setShowFloatingToast(false);
    setIsLoadingPlanRequest(false);

  }

  const handleExploreMore = () => {
    setShowFloatingToast(true);
    navigation.navigate('Landing');
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
          <PlanConfirmationView onExploreMore={handleExploreMore} />
        ) : (
          <QuestionnaireWindow setIsLoadingPlanRequest={setIsLoadingPlanRequest} savePromptData={setPromptData} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default QuestionnairePage;

export const styles = StyleSheet.create({
  ...loadingStyles, // Additional styles for loading component
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
