import { TextStyle, ViewStyle } from "react-native";
export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "HEAD"
  | "OPTIONS";
export interface ButtonProps {
  label: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: "solid" | "outline";
  icon?: string | React.ReactNode; // Accept string OR component
  iconPosition?: "left" | "right"; // default: left
  iconSize?: number;
  iconColor?: string;
}
