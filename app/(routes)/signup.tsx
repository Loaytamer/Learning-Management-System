import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Link } from "expo-router";
import { useState } from "react";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { LinearGradient } from "expo-linear-gradient";
import CustomTextInput from "../../components/CustomTextInput";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const validateName = (name: string) => {
    return name.length >= 2;
  };

  const handleSignup = () => {
    let isValid = true;

    // Validate name
    if (!validateName(name)) {
      setNameError("Name must be at least 2 characters long");
      isValid = false;
    } else {
      setNameError("");
    }

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

    // Validate confirm password
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    if (!isValid) {
      Alert.alert("Validation Error", "Please check your inputs and try again");
      return;
    }

    console.log("Signup attempt with:", { name, email, password });
  };

  return (
    <LinearGradient
      colors={["#a0afd2", "#F6F7F9", "#E8EEF9"]}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>

        <View style={styles.inputContainer}>
          <CustomTextInput
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            isValid={!nameError}
            errorMessage={nameError}
          />

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

          <CustomTextInput
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            isValid={!confirmPasswordError}
            errorMessage={confirmPasswordError}
          />
        </View>

        <TouchableOpacity onPress={handleSignup} style={styles.button}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.links}>
          <Link href="/login" style={styles.link}>
            Already have an account? Login
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
