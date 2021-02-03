import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, SafeAreaView } from "react-native";
import DataRow from "./dataRow";
import LineChart from "./lineChart";

// component to display covid data for one country
export default function CountryStats({ navigation, route }) {
  const [newCasesFor30DayPeriod, setData] = useState([]);

  useEffect(() => {
    // get dates for fetch request
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 32);
    const toDate = new Date();
    toDate.setDate(toDate.getDate() - 1);

    const formattedFromDate = fromDate.toISOString().split(".")[0] + "Z";
    const formattedToDate = toDate.toISOString().split(".")[0] + "Z";

    // fetch 30 days of data for selected country
    fetch(
      `https://api.covid19api.com/total/country/${route.params.countrySelected.Slug}/status/confirmed?from=${formattedFromDate}&to=${formattedToDate}`
    )
      .then((response) => response.json())
      .then((json) => {
        setData(json);
      })
      .catch((error) => console.error(error));
  }, []);

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
      <ScrollView style={styles.scrollview}>
        <LineChart data={newCasesFor30DayPeriod} />
        <DataRow
          firstTitle="Total Cases"
          secondTitle="New Cases"
          firstNumber={TotalConfirmed}
          secondNumber={NewConfirmed}
        />
        <DataRow
          firstTitle="Total Deaths"
          secondTitle="New Deaths"
          firstNumber={TotalDeaths}
          secondNumber={NewDeaths}
          customTextStyle={{ color: "red" }}
        />
        <DataRow
          firstTitle="Total Recovered"
          secondTitle="New Recovered"
          firstNumber={TotalRecovered}
          secondNumber={NewRecovered}
          customTextStyle={{ color: "green" }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {},
  scrollview: {
    marginTop: 15,
  },
});
