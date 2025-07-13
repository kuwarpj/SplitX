import { ButtonProps } from "@/type";
import { Feather } from "@expo/vector-icons";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { lightThemeColors as colors } from "../../constants/Colors";

const Button = ({
  label,
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
  variant = "solid",
  icon,
  iconPosition = "left",
  iconSize = 18,
  iconColor,
}: ButtonProps) => {
  const isOutline = variant === "outline";
  const computedIconColor = iconColor || (isOutline ? colors.primary : "#fff");

  const renderIcon = () => {
    if (!icon) return null;

    // If it's a string, render Feather icon
    if (typeof icon === "string") {
      return (
        <Feather
          name={icon}
          size={iconSize}
          color={computedIconColor}
          style={styles.icon}
        />
      );
    }

    // If it's a React element, assume it's a custom icon
    return <View style={styles.icon}>{icon}</View>;
  };

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
        <ActivityIndicator color={computedIconColor} />
      ) : (
        <View style={styles.row}>
          {icon && iconPosition === "left" && renderIcon()}
          <Text
            style={[
              styles.text,
              isOutline ? styles.outlineText : styles.solidText,
              textStyle,
            ]}
          >
            {label}
          </Text>
          {icon && iconPosition === "right" && renderIcon()}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Button;

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
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginHorizontal: 6,
  },
});
