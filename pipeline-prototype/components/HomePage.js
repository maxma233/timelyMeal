import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ImageScroller from './ImageScroller';

function HomePage() {
  const navigation = useNavigation();

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
        {/* Food slider moved from questionnaire to homepage */}
        <ImageScroller />

        <View style={styles.card}>
          <Text style={styles.title}>Build your meal plan</Text>
          <Text style={styles.subtitle}>Answer a few questions and we’ll tailor suggestions to you.</Text>

          <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('Questionnaire')}>
            <Text style={styles.primaryButtonText}>Get started</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default HomePage;

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
  card: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
  },
  primaryButton: {
    backgroundColor: '#F44322',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
