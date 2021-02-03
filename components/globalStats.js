import React, { useEffect, useState } from "react";
import DataRow from "../components/dataRow";
import BarChart from "../components/barChart";
import { Text, View, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { TouchableOpacity } from "react-native";

// dashboard/home screen for showing worldwide covid data
export default function GlobalStats({ navigation }) {
  const [globalSummaryData, setGlobalSummaryData] = useState({});
  const [globalNewCasesData, setGlobalNewCasesData] = useState([]);

  // fetch global data from api and update state
  useEffect(() => {
    // get data for graph
    fetch("https://covid19.mathdro.id/api/daily")
      .then((response) => response.json())
      .then((json) => {
        // add only the last 7 days of data
        const startIndex = json.length - 7;
        const endIndex = json.length;
        const newCasesForWeek = json.slice(startIndex, endIndex);
        console.log(json);
        setGlobalNewCasesData(newCasesForWeek);
      })
      .catch((error) => console.error(error));

    // get data for rows
    fetch("https://api.covid19api.com/summary")
      .then((response) => response.json())
      .then((json) => {
        setGlobalSummaryData(json.Global);
      })
      .catch((error) => console.error(error));
  }, []);

  // handle button click - move to country list component
  const seachByCountryBtnHandler = () => {
    navigation.navigate("CountryList");
  };

  // custom button component only for global stats screen
  const SearchByCountryBtn = () => {
    return (
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={seachByCountryBtnHandler}
      >
        <Text style={styles.buttonText}>SEARCH BY COUNTRY</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <BarChart data={globalNewCasesData} />
        <DataRow
          firstTitle="Total Cases"
          secondTitle="New Cases"
          firstNumber={globalSummaryData.TotalConfirmed}
          secondNumber={globalSummaryData.NewConfirmed}
        />
        <DataRow
          firstTitle="Total Deaths"
          secondTitle="New Deaths"
          firstNumber={globalSummaryData.TotalDeaths}
          secondNumber={globalSummaryData.NewDeaths}
          customTextStyle={{ color: "red" }}
        />
        <DataRow
          firstTitle="Total Recovered"
          secondTitle="New Recovered"
          firstNumber={globalSummaryData.TotalRecovered}
          secondNumber={globalSummaryData.NewRecovered}
          customTextStyle={{ color: "green" }}
        />
        <SearchByCountryBtn />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    marginTop: 15,
  },
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
