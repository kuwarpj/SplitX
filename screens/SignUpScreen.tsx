import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { lightThemeColors as colors } from '../constants/Colors';

const SignupScreen = ({ navigation }: any) =>{
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [emailVerified, setEmailVerified] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVerifyEmail = () => {
    setEmailVerified(true);
    setTimeout(() => setEmailVerified(false), 3000);
  };

  const handleSubmit = () => {
    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    Alert.alert('Account Created', JSON.stringify(formData, null, 2));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoWrapper}>
        <View style={styles.logoCircle}>
          <Ionicons name="phone-portrait-outline" size={26} color="white" />
        </View>
        <View style={styles.dot} />
      </View>

      <Text style={styles.title}>Join ShareBills</Text>
      <Text style={styles.subtitle}>Start splitting expenses with friends</Text>

      <View style={styles.card}>
        <Text style={styles.heading}>Create your account</Text>
        <Text style={styles.subheading}>Fill in your details to get started</Text>

        {/* Full Name */}
        <View style={styles.inputGroup}>
          <Feather name="user" size={18} style={styles.icon} />
          <TextInput
            placeholder="Full name"
            value={formData.name}
            onChangeText={(text) => handleInputChange('name', text)}
            style={styles.input}
          />
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Feather name="mail" size={18} style={styles.icon} />
          <TextInput
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
            style={styles.input}
            keyboardType="email-address"
          />
          {emailVerified && (
            <Feather name="check-circle" size={18} color={colors.primary} />
          )}
        </View>

        <TouchableOpacity
          style={[styles.verifyButton, emailVerified && styles.verified]}
          onPress={handleVerifyEmail}
          disabled={!formData.email || emailVerified}
        >
          <Text style={styles.verifyText}>
            {emailVerified ? 'Email Verified!' : 'Verify Email'}
          </Text>
        </TouchableOpacity>

        {/* Password */}
        <View style={styles.inputGroup}>
          <Feather name="lock" size={18} style={styles.icon} />
          <TextInput
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={formData.password}
            onChangeText={(text) => handleInputChange('password', text)}
            style={styles.input}
          />
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Feather
              name={showPassword ? 'eye-off' : 'eye'}
              size={18}
              color="#888"
            />
          </Pressable>
        </View>

        {/* Confirm Password */}
        <View style={styles.inputGroup}>
          <Feather name="lock" size={18} style={styles.icon} />
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry={!showConfirmPassword}
            value={formData.confirmPassword}
            onChangeText={(text) => handleInputChange('confirmPassword', text)}
            style={styles.input}
          />
          <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Feather
              name={showConfirmPassword ? 'eye-off' : 'eye'}
              size={18}
              color="#888"
            />
          </Pressable>
        </View>

        {/* Sign Up */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Create Account</Text>
        </TouchableOpacity>

        <Text style={styles.terms}>
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </Text>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.divider} />
        </View>

        {/* Google Button */}
        <TouchableOpacity style={styles.googleButton}>
          <FontAwesome name="google" size={18} color="#333" style={{ marginRight: 8 }} />
          <Text style={styles.googleText}>Sign up with Google</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.bottomText}>
        Already have an account?{' '}
        <Text style={styles.linkText} onPress={() => navigation.navigate('Login')}>
          Sign in
        </Text>
      </Text>
    </ScrollView>
  );
}


export default SignupScreen


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f4ff',
    padding: 20,
    alignItems: 'center',
  },
  logoWrapper: {
    marginTop: 40,
    alignItems: 'center',
  },
  logoCircle: {
    width: 56,
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    backgroundColor: '#60a5fa',
    borderRadius: 6,
    position: 'absolute',
    top: -6,
    right: -6,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    elevation: 2,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  subheading: {
    fontSize: 13,
    color: '#777',
    marginBottom: 16,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 14,
    backgroundColor: '#f9fafb',
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 14,
    color: '#333',
  },
  icon: {
    marginRight: 8,
    color: '#666',
  },
  verifyButton: {
    backgroundColor: '#f0f4ff',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  verified: {
    backgroundColor: '#e0f2fe',
    borderColor: colors.primary,
  },
  verifyText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.primary,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
  },
  terms: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginBottom: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#999',
    fontSize: 12,
  },
  googleButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleText: {
    fontSize: 13,
    fontWeight: '500',
  },
  bottomText: {
    textAlign: 'center',
    fontSize: 13,
    marginVertical: 20,
    color: '#444',
  },
  linkText: {
    color: colors.primary,
    fontWeight: '600',
  },
});
