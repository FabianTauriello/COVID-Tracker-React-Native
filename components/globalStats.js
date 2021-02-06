import React, { useEffect, useState } from "react";
import DataRow from "./dataRow";
import BarChart from "./barChart";
import CustomButton from "./customButton";
import {
  Text,
  ActivityIndicator,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";

// dashboard/home screen for showing worldwide covid data
export default function GlobalStats({ navigation }) {
  // global summary for rows
  const [rowData, setRowData] = useState({});
  const [rowDataError, setRowDataError] = useState("");
  const [rowDataIsLoading, setRowDataLoading] = useState(true);

  // global new cases for graph
  const [graphData, setGraphData] = useState([]);
  const [graphDataError, setGraphDataError] = useState("");
  const [graphDataIsLoading, setGraphDataLoading] = useState(true);

  // fetch global data from api and update state
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetchGraphData();
    fetchRowData();
  };

  // get data for graph
  const fetchGraphData = () => {
    setGraphDataLoading(true);
    fetch("https://covid19.mathdro.id/api/daily")
      .then((response) => {
        if (!response.ok) {
          throw Error("Failed to fetch data");
        }
        setGraphDataError("");
        return response.json();
      })
      .then((json) => {
        // add only the last 7 days of data
        const startIndex = json.length - 7;
        const endIndex = json.length;
        const newCasesForWeek = json.slice(startIndex, endIndex);
        setGraphData(newCasesForWeek);
      })
      .catch((error) => setGraphDataError(error.message))
      .finally(() => setGraphDataLoading(false));
  };

  // get data for rows
  const fetchRowData = () => {
    setRowDataLoading(true);
    fetch("https://api.covid19api.com/summary")
      .then((response) => {
        if (!response.ok) {
          throw Error("Failed to fetch data");
        }
        setRowDataError("");
        return response.json();
      })
      .then((json) => {
        setRowData(json.Global);
      })
      .catch((error) => setRowDataError(error.message))
      .finally(() => setRowDataLoading(false));
  };

  // handle button click - move to country list component
  const searchByCountryBtnHandler = () => {
    navigation.navigate("CountryList");
  };

  return (
    <SafeAreaView>
      {graphDataIsLoading && rowDataIsLoading && (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator
            color="blue"
            animating={graphDataIsLoading && rowDataIsLoading}
            size={"large"}
          />
        </View>
      )}
      {!graphDataError.length == 0 || !rowDataError.length == 0 ? (
        <View style={styles.container}>
          <Text>Failed to fetch data</Text>
          <Text>Please try again</Text>
          <CustomButton text="RETRY" handlePress={fetchData} />
        </View>
      ) : null}
      {graphDataError.length == 0 && rowDataError.length == 0 && (
        <ScrollView style={styles.scrollView}>
          <BarChart data={graphData} />
          <DataRow
            firstTitle="Total Cases"
            secondTitle="New Cases"
            firstNumber={rowData.TotalConfirmed}
            secondNumber={rowData.NewConfirmed}
          />
          <DataRow
            firstTitle="Total Deaths"
            secondTitle="New Deaths"
            firstNumber={rowData.TotalDeaths}
            secondNumber={rowData.NewDeaths}
            customTextStyle={{ color: "red" }}
          />
          <DataRow
            firstTitle="Total Recovered"
            secondTitle="New Recovered"
            firstNumber={rowData.TotalRecovered}
            secondNumber={rowData.NewRecovered}
            customTextStyle={{ color: "green" }}
          />
          <CustomButton
            text="SEARCH BY COUNTRY"
            handlePress={searchByCountryBtnHandler}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
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
  activityIndicatorContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 100,
  },
});
