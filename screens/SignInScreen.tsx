import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import CustomForm from "../components/CustomForm";

const SignInScreen = () => {
  const handleSignIn = (values: Record<string, string>) => {
    // Handle sign in logic here
    console.log("Sign in values:", values);
  };

  const formFields = [
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
  ];

  return (
    <View style={styles.container}>
      <CustomForm fields={formFields} onSubmit={handleSignIn} />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Sign In</Text>
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

export default SignInScreen;
