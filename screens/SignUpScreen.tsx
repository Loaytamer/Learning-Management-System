import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import CustomForm from "../components/CustomForm";

const SignUpScreen = () => {
  const handleSignUp = (values: Record<string, string>) => {
    // Handle sign up logic here
    console.log("Sign up values:", values);
  };

  const formFields = [
    {
      name: "name",
      value: "",
      isValid: true,
      validation: (value: string) => value.length >= 2,
      errorMessage: "Name must be at least 2 characters long",
    },
    {
      name: "email",
      value: "",
      isValid: true,
      validation: (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      },
      errorMessage: "Please enter a valid email address",
    },
    {
      name: "password",
      value: "",
      isValid: true,
      validation: (value: string) => value.length >= 6,
      errorMessage: "Password must be at least 6 characters long",
    },
    {
      name: "confirmPassword",
      value: "",
      isValid: true,
      validation: (value: string, allValues?: Record<string, string>) => {
        return value === allValues?.password;
      },
      errorMessage: "Passwords do not match",
    },
  ];

  return (
    <View style={styles.container}>
      <CustomForm fields={formFields} onSubmit={handleSignUp} />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SignUpScreen;
