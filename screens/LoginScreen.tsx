import AnimatedError from "@/components/AnimatedError";
import Loader from "@/components/Loader";
import Routes from "@/constants/ApiRoutes";
import { useApp } from "@/context/AppContext";
import { fetchAPI } from "@/utils/fetchAPI";
import { storage } from "@/utils/storage";
import { validateForm } from "@/utils/utils";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { lightThemeColors as colors } from "../constants/Colors";
const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setIsLoggedIn } = useApp();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleLogin = useCallback(async () => {
    const schema = {
      email: {
        required: true,
        regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        customMessage: "Please enter a valid email address.",
      },
      password: {
        required: true,
        minLength: 6,
        customMessage: "Password must be at least 6 characters.",
      },
    };
    const foundErrors = validateForm({ email, password }, schema);

    if (Object.keys(foundErrors).length > 0) {
      setErrors(foundErrors);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const body = { email, password };

    try {
      const data = await fetchAPI(Routes.LOGIN, "POST", body);

      if (data?.success === true) {
        setIsLoggedIn(true);
        const user = data.data;
        console.log("This is Data", user);
        // Store user and token
        storage.set("user", JSON.stringify(user));
        storage.set("token", user.token);

        Toast.show({
          type: "success",
          text1: "Login Successful",
          text2: "Welcome back!",
        });

        // navigation.navigate("Home")

        // navigation.navigate("Home");
      }
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Login failed",
        text2: "Invalid credentials",
      });
    } finally {
      setIsLoading(false);
    }
  }, [email, password, navigation]);

  return (
    <View style={styles.container}>
      {isLoading && <Loader />}
      <View style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
        <View style={styles.logoBox}>
          <View style={styles.logoCircle}>
            <Ionicons name="phone-portrait-outline" size={28} color="white" />
          </View>
          <View style={styles.logoDot} />
        </View>
        <View  style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
          <Text style={styles.title}>SplitX</Text>
          <Text style={styles.subtitle}>
            Split expenses with friends easily
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.welcome}>Welcome back</Text>
        <Text style={styles.description}>
          Sign in to your account to continue
        </Text>

        {/* Email Field */}
        <View style={{ marginBottom: 12 }}>
          <View style={styles.inputGroup}>
            <Feather
              name="mail"
              size={20}
              color="#888"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Email address"
              keyboardType="email-address"
              style={styles.input}
              placeholderTextColor="#999"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: "" }));
                }
              }}
              autoCapitalize="none"
            />
          </View>
          {errors.email && <AnimatedError message={errors.email} />}
        </View>

        {/* Password Field */}

        <View style={{ marginBottom: 12 }}>
          <View style={styles.inputGroup}>
            <Feather
              name="lock"
              size={20}
              color="#888"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              style={styles.input}
              placeholderTextColor="#999"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: "" }));
                }
              }}
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Feather
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="#888"
              />
            </Pressable>
          </View>

          {errors.password && <AnimatedError message={errors.password} />}
        </View>

        {/* Forgot Password */}
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={isLoading}
          activeOpacity={0.6}
        >
          <Text style={styles.loginText}>
            {/* {isLoading ? "Signing in..." : "Sign in"} */}
            Sign in
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Google Sign In */}
        <TouchableOpacity style={styles.googleButton}>
          <Feather name="google" size={20} style={{ marginRight: 8 }} />
          <Text style={styles.googleText}>Continue with Google</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Text style={styles.bottomText}>
        Don’t have an account?{" "}
        <Text
          style={styles.linkText}
          onPress={() => navigation.navigate("signup")}
        >
          Sign up
        </Text>
      </Text>

      <View style={styles.policyLinks}>
        <Text style={styles.policyLink}>Privacy Policy</Text>
        <Text> • </Text>
        <Text style={styles.policyLink}>Terms of Service</Text>
        <Text> • </Text>
        <Text style={styles.policyLink}>Help</Text>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f5ff", // soft blue background
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logoBox: {
    marginBottom: 10,
    position: "relative",
  },
  logoCircle: {
    width: 64,
    height: 64,
    backgroundColor: colors.primary,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logoDot: {
    width: 16,
    height: 16,
    backgroundColor: "#60a5fa",
    borderRadius: 8,
    position: "absolute",
    top: -5,
    right: -5,
    borderWidth: 2,
    borderColor: "white",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111",
     marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 20,
  },
  welcome: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    paddingHorizontal: 10,
    // marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  inputIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#333",
  },
  eyeIcon: {
    paddingHorizontal: 4,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 14,
  },
  forgotText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  loginText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#888",
  },
  googleButton: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  googleText: {
    fontSize: 14,
    fontWeight: "500",
  },
  bottomText: {
    color: "#666",
    fontSize: 13,
    marginTop: 10,
  },
  linkText: {
    color: colors.primary,
    fontWeight: "600",
  },
  policyLinks: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8,
    fontSize: 12,
    color: "#888",
  },
  policyLink: {
    color: "#888",
    fontSize: 12,
  },
});
