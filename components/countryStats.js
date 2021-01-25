import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import DataRow from "./dataRow";

// component to display covid data for one country
export default function CountryStats({ navigation, route }) {
  const {
    TotalConfirmed,
    NewConfirmed,
    TotalDeaths,
    NewDeaths,
    TotalRecovered,
    NewRecovered,
  } = route.params.countrySelected;

  return (
    <SafeAreaView style={styles.container}>
      <DataRow text="Total Cases" data={TotalConfirmed} />
      <DataRow text="New Cases" data={NewConfirmed} />
      <DataRow text="Total Deaths" data={TotalDeaths} />
      <DataRow text="New Deaths" data={NewDeaths} />
      <DataRow text="Total Recovered" data={TotalRecovered} />
      <DataRow text="New Recovered" data={NewRecovered} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
  },
});
