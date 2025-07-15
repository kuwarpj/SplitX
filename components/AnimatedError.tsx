import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

const AnimatedError = ({ message }: { message: string }) => {
  const translateY = useRef(new Animated.Value(10)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.Text
      style={[
        stylesAnimated.errorText,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      {message}
    </Animated.Text>
  );
};

const stylesAnimated = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: 11,
    marginTop: 4,
    marginBottom: 4,
    marginLeft: 4,
  },
});

export default AnimatedError;
