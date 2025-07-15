import { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

const SplashScreen = () => {
  const [fadeAnim] = useState(new Animated.Value(0));  // For fade-in of subtitle
  const [typingText, setTypingText] = useState('');

  const title = 'SplitX';

  useEffect(() => {
    // Typing animation for title
    let currentIndex = 0;
    const interval = setInterval(() => {
      setTypingText(title.substring(0, currentIndex + 1));
      currentIndex++;
      if (currentIndex === title.length) {
        clearInterval(interval);

        // Start fade-in after typing completes
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {typingText}
        {typingText.length < title.length && <Text style={styles.cursor}>|</Text>}
      </Text>

      <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
        Effortless expense sharing
      </Animated.Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'hsl(218, 100%, 22%)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Poppins', // Optional if you load custom fonts
  },
  cursor: {
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginTop: 20,
    fontFamily: 'Poppins',
  },
});
