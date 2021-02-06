import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

// custom button component
export default function CustomButton(props) {
  return (
    <TouchableOpacity
      style={styles.buttonContainer}
      onPress={props.handlePress}
    >
      <Text style={styles.buttonText}>{props.text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: "center",
    backgroundColor: "#5481b0",
    padding: 20,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});
