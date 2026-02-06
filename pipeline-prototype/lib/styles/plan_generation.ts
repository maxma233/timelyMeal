import { StyleSheet } from "react-native";

export const planGeneratorStyles = StyleSheet.create({
  childContainer: {
    flex: 1,
  },
  toastContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 20,
    zIndex: 999,
    pointerEvents: 'none',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 12,
  },
  foodIllustration: {
    width: 48,
    height: 48,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 12,
  },
  bowl: {
    width: 44,
    height: 26,
    borderRadius: 22,
    backgroundColor: '#f7c97c',
    borderWidth: 2,
    borderColor: '#f58c36',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 4,
  },
  liquid: {
    width: '80%',
    height: 8,
    borderRadius: 999,
    backgroundColor: '#fef7e0',
  },
  steam: {
    position: 'absolute',
    width: 22,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    top: -22,
  },
  textGroup: {
    flexShrink: 1,
    maxWidth: 240,
  },
  toastTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: '#221510',
  },
  toastSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: '#4b3b35',
  },
});
