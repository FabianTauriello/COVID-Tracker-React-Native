import React from "react";
import { Text, View, StyleSheet } from "react-native";

// custom row for displaying text and data. used by global stats and country stats screens
export default function DataRow(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{props.text}</Text>
      <Text style={styles.text}>{props.data}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingTop: 15,
    paddingBottom: 15,
    paddingStart: 10,
    paddingEnd: 10,
    width: "100%",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 25,
  },
});
