import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { LinearGradient } from 'expo-linear-gradient';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleResetPassword = () => {
    console.log('Password reset requested for:', email);
    setIsSubmitted(true);
  };

  return (
    <LinearGradient
      colors={["#a0afd2", "#F6F7F9", "#E8EEF9"]}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Reset Password</Text>
        
        {!isSubmitted ? (
          <>
            <Text style={styles.description}>
              Enter your email address and we'll send you instructions to reset your password.
            </Text>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <TouchableOpacity onPress={handleResetPassword} style={styles.button}>
              <Text style={styles.buttonText}>Send Reset Link</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.description}>
              If an account exists with {email}, you will receive password reset instructions.
            </Text>
            <TouchableOpacity onPress={() => setIsSubmitted(false)} style={styles.button}>
              <Text style={styles.buttonText}>Try Another Email</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={styles.links}>
          <Link href="/login" style={styles.link}>
            Back to Login
          </Link>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: responsiveWidth(5),
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: responsiveHeight(2),
    textAlign: 'center',
    color: '#000',
  },
  description: {
    textAlign: 'center',
    marginBottom: responsiveHeight(4),
    color: '#333',
    lineHeight: 22,
  },
  inputContainer: {
    gap: responsiveHeight(2),
    marginBottom: responsiveHeight(3),
  },
  inputWrapper: {
    gap: responsiveHeight(1),
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: responsiveHeight(1.5),
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#3860be',
    padding: responsiveHeight(1.8),
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  links: {
    marginTop: responsiveHeight(3),
    gap: responsiveHeight(1),
    alignItems: 'center',
  },
  link: {
    color: '#3860be',
    fontSize: 14,
  },
}); 