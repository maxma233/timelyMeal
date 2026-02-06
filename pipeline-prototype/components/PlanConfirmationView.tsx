import { View, Text, Pressable } from 'react-native';
import { styles } from "./QuestionnairePage";

export function PlanConfirmationView({ onExploreMore }) {
  return (
    <View style={styles.confirmationContainer}>
      <View style={styles.confirmationCard}>
        <View style={styles.confirmationIcon}>
          <View style={styles.plate}>
            <View style={styles.plateHighlight} />
          </View>
          <View style={styles.spoon} />
        </View>
        <Text style={styles.confirmationTitle}>Your plan is being generated</Text>
        <Text style={styles.confirmationCopy}>
          We’re blending your preferences into an inspired food plan. Feel free to explore the rest of TimelyMeals while it simmers.
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.exploreButton,
            pressed && styles.exploreButtonPressed,
          ]}
          onPress={onExploreMore}
        >
          <Text style={styles.exploreLabel}>Explore more</Text>
        </Pressable>
      </View>
    </View>
  );
}
