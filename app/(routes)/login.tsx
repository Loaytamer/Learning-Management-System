import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { LinearGradient } from 'expo-linear-gradient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login attempt with:', { email, password });
  };

  return (
    <LinearGradient
      colors={["#a0afd2", "#F6F7F9", "#E8EEF9"]}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back</Text>
        
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
          
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.links}>
          <Link href="/signup" style={styles.link}>
            Don't have an account? Sign up
          </Link>
          <Link href="/forgot-password" style={styles.link}>
            Forgot Password?
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
    marginBottom: responsiveHeight(4),
    textAlign: 'center',
    color: '#000',
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