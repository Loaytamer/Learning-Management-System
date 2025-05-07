import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, LogIn } from 'lucide-react-native';

export default function LoginScreen() {
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to login');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/5904974/pexels-photo-5904974.jpeg?auto=compress&cs=tinysrgb&w=600' }}
            style={styles.logo}
          />
          <Text style={styles.title}>EduLearn</Text>
          <Text style={styles.subtitle}>Your Gateway to Knowledge</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Sign In</Text>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={toggleShowPassword}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#9CA3AF" />
                ) : (
                  <Eye size={20} color="#9CA3AF" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isSubmitting}
          >
            <LogIn size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/signup" asChild>
              <TouchableOpacity>
                <Text style={styles.signupText}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
          
          <View style={styles.demoCredentials}>
            <Text style={styles.demoTitle}>Demo Credentials</Text>
            <Text style={styles.demoText}>Student: student1@example.com / 123456</Text>
            <Text style={styles.demoText}>Instructor: instructor1@example.com / 123456</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  header: {
    alignItems: 'center',
    marginTop: 48,
    marginBottom: 36,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 8,
    fontFamily: 'Inter-Regular',
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 24,
    fontFamily: 'Inter-SemiBold',
  },
  errorText: {
    color: '#EF4444',
    marginBottom: 16,
    fontFamily: 'Inter-Regular',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#D1D5DB',
    marginBottom: 8,
    fontFamily: 'Inter-Medium',
  },
  input: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  passwordContainer: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    borderRadius: 8,
    height: 48,
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  eyeButton: {
    paddingHorizontal: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#6200EE',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  button: {
    backgroundColor: '#6200EE',
    borderRadius: 8,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#4B5563',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'Inter-SemiBold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#D1D5DB',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  signupText: {
    color: '#6200EE',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  demoCredentials: {
    marginTop: 36,
    padding: 16,
    backgroundColor: '#1F2937',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#6200EE',
  },
  demoTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  demoText: {
    fontSize: 14,
    color: '#D1D5DB',
    marginBottom: 4,
    fontFamily: 'Inter-Regular',
  },
});