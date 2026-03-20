import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    padding: 24,
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  count: {
    fontSize: 48,
    fontWeight: '900',
  },
});