import AnimatedError from "@/components/AnimatedError";
import Routes from "@/constants/ApiRoutes";
import { fetchAPI } from "@/utils/fetchAPI";
import { validateForm } from "@/utils/utils";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { lightThemeColors as colors } from "../constants/Colors"; // Replace with your actual path

export default function SignupScreen({ navigation }: any) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [emailVerified, setEmailVerified] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSendOtp = useCallback(async () => {
    setLoading(true);
    try {
      const schema = {
        email: {
          required: true,
          regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          customMessage: "Please enter a valid email address.",
        },
      };

      const foundErrors = validateForm(formData, schema);

      if (Object.keys(foundErrors).length > 0) {
        setErrors(foundErrors);
        setLoading(false);
        return;
      }

      const payload = {
        email: formData?.email,
      };

      const data = await fetchAPI(Routes?.SEND_OPT, "POST", payload);
      if (data?.success === true) {
        Toast.show({
          type: "success",
          text1: data?.message,
        });
        setStep(2);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [formData?.email]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const schema = {
        otp: {
          required: true,
          regex: /^\d{4,6}$/, // Assuming OTP is 4 to 6 digit number
          customMessage: "Please enter a valid OTP.",
        },
        name: {
          required: true,
          minLength: 3,
          customMessage: "Username must be at least 3 characters.",
        },
        password: {
          required: true,
          minLength: 6,
          customMessage: "Password must be at least 6 characters.",
        },
      };
      const foundErrors = validateForm(formData, schema);

      if (Object.keys(foundErrors).length > 0) {
        setErrors(foundErrors);
        setLoading(false);
        return;
      }

      const payload = {
        email: formData?.email,
        otp: formData?.otp,
        username: formData?.name,
        password: formData?.password,
      };

      const data = await fetchAPI(Routes?.VERIFY_OPT, "POST", payload);
      if (data?.success === true) {
        Toast.show({
          type: "success",
          text1: data?.message,
        });
      }
    } catch (error) {
      const errorMessage = error?.message || "Something went wrong";

      setErrors((prev) => ({
        ...prev,
        otp: errorMessage,
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, height:'100%', backgroundColor: colors.background }}
      edges={["top", "left", "right"]}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={styles.logoWrapper}>
            <View style={styles.logoCircle}>
              <Ionicons name="phone-portrait-outline" size={26} color="white" />
            </View>
            <View style={styles.dot} />
          </View>

          <Text style={styles.title}>Join SplitX</Text>
          <Text style={styles.subtitle}>
            Start splitting expenses with friends
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.heading}>Create your account</Text>
          <Text style={styles.subheading}>
            Fill in your details to get started
          </Text>

          {/* Email */}
          {step === 1 && (
            <View>
              <View style={{ marginBottom: 12 }}></View>
              <View style={styles.inputGroup}>
                <Feather name="mail" size={18} style={styles.icon} />
                <TextInput
                  placeholder="Enter your email"
                  value={formData.email}
                  onChangeText={(text) => handleInputChange("email", text)}
                  style={[
                    styles.input,
                    errors.email ? styles.inputError : null,
                  ]}
                  keyboardType="email-address"
                  placeholderTextColor="#999"
                />
                {emailVerified && (
                  <Feather
                    name="check-circle"
                    size={18}
                    color={colors.primary}
                  />
                )}
              </View>
              {errors.email && <AnimatedError message={errors.email} />}
            </View>
          )}

          {step === 2 && (
            <>
              {/* Full Name */}
              <View style={{ marginBottom: 12 }}>
                <View style={styles.inputGroup}>
                  <Feather name="user" size={18} style={styles.icon} />
                  <TextInput
                    placeholder="Enter Otp"
                    value={formData.otp}
                    onChangeText={(text) => handleInputChange("otp", text)}
                    style={[
                      styles.input,
                      errors.otp ? styles.inputError : null,
                    ]}
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                  />
                </View>
                {errors.otp && <AnimatedError message={errors.otp} />}
              </View>
              <View style={{ marginBottom: 12 }}>
                <View style={styles.inputGroup}>
                  <Feather name="user" size={18} style={styles.icon} />
                  <TextInput
                    placeholder="Full name"
                    value={formData.name}
                    onChangeText={(text) => handleInputChange("name", text)}
                    style={[
                      styles.input,
                      errors.name ? styles.inputError : null,
                    ]}
                    placeholderTextColor="#999"
                  />
                </View>
                {errors.name && <AnimatedError message={errors.name} />}
              </View>
              {/* Password */}
              <View style={{ marginBottom: 12 }}>
                <View style={styles.inputGroup}>
                  <Feather name="lock" size={18} style={styles.icon} />
                  <TextInput
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                    value={formData.password}
                    onChangeText={(text) => handleInputChange("password", text)}
                    style={[
                      styles.input,
                      errors.password ? styles.inputError : null,
                    ]}
                    placeholderTextColor="#999"
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <Feather
                      name={showPassword ? "eye-off" : "eye"}
                      size={18}
                      color="#888"
                    />
                  </Pressable>
                </View>
                {errors.password && <AnimatedError message={errors.password} />}
              </View>
              {/* Confirm Password */}
              <View style={{ marginBottom: 12 }}>
                <View style={styles.inputGroup}>
                  <Feather name="lock" size={18} style={styles.icon} />
                  <TextInput
                    placeholder="Confirm Password"
                    secureTextEntry={!showConfirmPassword}
                    value={formData.confirmPassword}
                    onChangeText={(text) =>
                      handleInputChange("confirmPassword", text)
                    }
                    style={[
                      styles.input,
                      errors.confirmPassword ? styles.inputError : null,
                    ]}
                    placeholderTextColor="#999"
                  />
                  <Pressable
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Feather
                      name={showConfirmPassword ? "eye-off" : "eye"}
                      size={18}
                      color="#888"
                    />
                  </Pressable>
                </View>
                {errors.password && <AnimatedError message={errors.password} />}
              </View>
            </>
          )}

          {/* Sign Up */}
          <TouchableOpacity
            style={[styles.submitButton, loading && { opacity: 0.7 }]}
            onPress={() => {
              if (loading) return;
              if (step === 1) {
                handleSendOtp();
              } else {
                handleSubmit();
              }
            }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>
                {step === 1 ? "Send Otp" : "Create Account"}
              </Text>
            )}
          </TouchableOpacity>

          <Text style={styles.terms}>
            By creating an account, you agree to our Terms of Service and
            Privacy Policy.
          </Text>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>

          {/* Google Button */}
          <TouchableOpacity style={styles.googleButton}>
            <FontAwesome
              name="google"
              size={18}
              color="#333"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.googleText}>Sign up with Google</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.bottomText}>
          Already have an account?{" "}
          <Text
            style={styles.linkText}
            onPress={() => navigation.navigate("Login")}
          >
            Sign in
          </Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4ff",
    padding: 20,
    alignItems: "center",
  },
  logoWrapper: {
    marginTop: 50,
    // alignItems: "center",
  },
  logoCircle: {
    width: 56,
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 12,
    height: 12,
    backgroundColor: "#60a5fa",
    borderRadius: 6,
    position: "absolute",
    top: -6,
    right: -6,
  },
  title: {
    marginBottom: 6,
    fontSize: 22,
    fontWeight: "bold",
    color: "#111",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 13,
    color: "#666",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    elevation: 2,
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  subheading: {
    fontSize: 13,
    color: "#777",
    marginBottom: 16,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#f9fafb",
  },

  inputError: {
    borderColor: "red",
  },

  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 5,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 14,
    color: "#000",
  },
  icon: {
    marginRight: 8,
    color: "#666",
  },
  verifyButton: {
    backgroundColor: "#f0f4ff",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  verified: {
    backgroundColor: "#e0f2fe",
    borderColor: colors.primary,
  },
  verifyText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.primary,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
    marginTop: 10,
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
  },
  terms: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    marginBottom: 16,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#999",
    fontSize: 12,
  },
  googleButton: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  googleText: {
    fontSize: 13,
    fontWeight: "500",
  },
  bottomText: {
    textAlign: "center",
    fontSize: 13,
    marginVertical: 20,
    color: "#444",
  },
  linkText: {
    color: colors.primary,
    fontWeight: "600",
  },
});
