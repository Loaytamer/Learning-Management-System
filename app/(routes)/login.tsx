import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { LinearGradient } from "expo-linear-gradient";
import CustomTextInput from "../../components/CustomTextInput";

const DUMMY_CREDENTIALS = {
  email: "loay@test.com",
  password: "123456",
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleLogin = () => {
    let isValid = true;

    // Validate email
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Validate password
    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 6 characters long");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!isValid) {
      Alert.alert("Validation Error", "Please check your inputs and try again");
      return;
    }

    // Check against dummy credentials
    if (
      email === DUMMY_CREDENTIALS.email &&
      password === DUMMY_CREDENTIALS.password
    ) {
      // Navigate to home screen
      // router.dismissAll();
      router.replace("/(tabs)/explore");
      
    } else {
      Alert.alert("Authentication Error", "Invalid email or password");
    }
  };

  return (
    <LinearGradient
      colors={["#a0afd2", "#F6F7F9", "#E8EEF9"]}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back</Text>

        <View style={styles.inputContainer}>
          <CustomTextInput
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            isValid={!emailError}
            errorMessage={emailError}
          />

          <CustomTextInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            isValid={!passwordError}
            errorMessage={passwordError}
          />
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
    justifyContent: "center",
    padding: responsiveWidth(5),
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: responsiveHeight(4),
    textAlign: "center",
    color: "#000",
  },
  inputContainer: {
    gap: responsiveHeight(2),
    marginBottom: responsiveHeight(3),
  },
  button: {
    backgroundColor: "#3860be",
    padding: responsiveHeight(1.8),
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  links: {
    marginTop: responsiveHeight(3),
    gap: responsiveHeight(1),
    alignItems: "center",
  },
  link: {
    color: "#3860be",
    fontSize: 14,
  },
});
