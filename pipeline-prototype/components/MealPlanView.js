import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';

function parseMealPlanText(text) {
  if (!text || typeof text !== 'string') {
    return [];
  }

  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const blocks = [];
  let currentDay = null;
  let meals = [];

  for (const line of lines) {
    const isDayHeader = /^day\s*\d+/i.test(line);

    if (isDayHeader) {
      if (currentDay) {
        blocks.push({ day: currentDay, meals });
      }
      currentDay = line;
      meals = [];
      continue;
    }

    meals.push(line);
  }

  if (currentDay) {
    blocks.push({ day: currentDay, meals });
  }

  if (blocks.length === 0) {
    return [{ day: 'Meal Plan', meals: lines }];
  }

  return blocks;
}

function MealPlanView({ mealPlanText, error, onBuildAnother }) {
  const dayBlocks = useMemo(() => parseMealPlanText(mealPlanText), [mealPlanText]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Meal Plan</Text>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        dayBlocks.map((block, index) => (
          <View key={`${block.day}-${index}`} style={styles.card}>
            <Text style={styles.dayTitle}>{block.day}</Text>
            {block.meals.map((meal, mealIndex) => (
              <Text key={`${meal}-${mealIndex}`} style={styles.mealItem}>
                {meal}
              </Text>
            ))}
          </View>
        ))
      )}

      <Button
        title="Build Another Plan"
        buttonStyle={styles.button}
        onPress={onBuildAnother}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 12,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#111',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 8,
  },
  dayTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
  },
  mealItem: {
    fontSize: 16,
    color: '#222',
    lineHeight: 22,
  },
  errorContainer: {
    backgroundColor: '#FFF0EE',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F44322',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  errorText: {
    fontSize: 16,
    color: '#8D200E',
  },
  button: {
    backgroundColor: '#F44322',
    borderRadius: 10,
    marginTop: 8,
  },
});

export default MealPlanView;
