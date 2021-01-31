import React from "react";
import { Text, View, StyleSheet } from "react-native";

// custom row for displaying text and data. used by global stats and country stats screens
export default function DataRow(props) {
  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.title}>{props.firstTitle}</Text>
        <Text style={[styles.number, props.customTextStyle]}>
          {props.firstNumber}
        </Text>
      </View>
      <View style={{ width: "50%" }}>
        <Text style={styles.title}>{props.secondTitle}</Text>
        <Text style={[styles.number, props.customTextStyle]}>
          {props.secondNumber}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    borderColor: "#ccd5e0",
    borderWidth: 1,
    flexDirection: "row",
    margin: 10,
    paddingStart: 10,
    paddingTop: 15,
    paddingBottom: 15,
    justifyContent: "space-between",
  },
  title: {
    // backgroundColor: "red",
    fontWeight: "500",
    fontSize: 18,
  },
  number: {
    // backgroundColor: "red",
    fontWeight: "bold",
    fontSize: 20,
  },
});
