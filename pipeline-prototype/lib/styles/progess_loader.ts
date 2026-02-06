import { StyleSheet } from 'react-native';

export const loadingStyles = StyleSheet.create({
  confirmationContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmationCard: {
    width: '100%',
    maxWidth: 620,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#f0d5cb',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 8,
    gap: 12,
  },
  confirmationIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  plate: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#f58c36',
    backgroundColor: '#fffaef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plateHighlight: {
    width: 28,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#f9d6b7',
  },
  spoon: {
    width: 24,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#f58c36',
    transform: [{ rotate: '45deg' }],
  },
  confirmationTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2b1b18',
  },
  confirmationCopy: {
    fontSize: 16,
    color: '#4a362f',
    lineHeight: 22,
  },
  exploreButton: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#f44322',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  exploreButtonPressed: {
    backgroundColor: '#d4391f',
  },
  exploreLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
