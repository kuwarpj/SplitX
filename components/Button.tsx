// components/ui/Button.tsx
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: "solid" | "outline";
}

const Button = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
  variant = "solid",
}: ButtonProps) =>{
  const isOutline = variant === "outline";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        isOutline ? styles.outline : styles.solid,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? "#007AFF" : "#fff"} />
      ) : (
        <Text
          style={[
            styles.text,
            isOutline ? styles.outlineText : styles.solidText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  solid: {
    backgroundColor: "#007AFF",
  },
  outline: {
    borderWidth: 1,
    borderColor: "#007AFF",
    backgroundColor: "transparent",
  },
  solidText: {
    color: "#fff",
    fontWeight: "600",
  },
  outlineText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  text: {
    fontSize: 16,
  },
  disabled: {
    opacity: 0.6,
  },
});
