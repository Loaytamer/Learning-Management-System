import React from "react";
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  Text,
  View,
} from "react-native";
import { responsiveHeight } from "react-native-responsive-dimensions";

interface CustomTextInputProps extends TextInputProps {
  isValid?: boolean;
  errorMessage?: string;
  label?: string;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  isValid = true,
  errorMessage,
  label,
  style,
  ...props
}) => {
  return (
    <View style={styles.inputWrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, !isValid && styles.invalidInput, style]}
        {...props}
      />
      {!isValid && errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    gap: responsiveHeight(1),
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: responsiveHeight(1.5),
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  invalidInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginLeft: 4,
  },
});

export default CustomTextInput;
