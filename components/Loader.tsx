// components/LoadingOverlay.tsx

import { ActivityIndicator, StyleSheet, View } from "react-native";
import { lightThemeColors as colors } from "../constants/Colors";

const Loader = () => {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});
