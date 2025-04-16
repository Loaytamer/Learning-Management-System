import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import CustomTextInput from "./CustomTextInput";

interface FormField {
  name: string;
  value: string;
  isValid: boolean;
  validation?: (value: string) => boolean;
  errorMessage?: string;
}

interface CustomFormProps {
  fields: FormField[];
  onSubmit: (values: Record<string, string>) => void;
}

const CustomForm: React.FC<CustomFormProps> = ({ fields, onSubmit }) => {
  const [formFields, setFormFields] = useState<FormField[]>(fields);

  const handleChange = (name: string, value: string) => {
    setFormFields((prevFields) =>
      prevFields.map((field) =>
        field.name === name
          ? {
              ...field,
              value,
              isValid: field.validation ? field.validation(value) : true,
            }
          : field
      )
    );
  };

  const handleSubmit = () => {
    const invalidFields = formFields.filter((field) => !field.isValid);

    if (invalidFields.length > 0) {
      Alert.alert(
        "Validation Error",
        invalidFields.map((field) => field.errorMessage).join("\n")
      );
      return;
    }

    const formValues = formFields.reduce((acc, field) => {
      acc[field.name] = field.value;
      return acc;
    }, {} as Record<string, string>);

    onSubmit(formValues);
  };

  return (
    <View style={styles.container}>
      {formFields.map((field) => (
        <CustomTextInput
          key={field.name}
          placeholder={field.name.charAt(0).toUpperCase() + field.name.slice(1)}
          value={field.value}
          onChangeText={(value) => handleChange(field.name, value)}
          isValid={field.isValid}
          secureTextEntry={field.name.toLowerCase().includes("password")}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20,
  },
});

export default CustomForm;
