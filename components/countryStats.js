import React, { useEffect, useState } from "react";
import CustomButton from "./customButton";
import {
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import DataRow from "./dataRow";
import LineChart from "./lineChart";

// component to display covid data for one country
export default function CountryStats({ navigation, route }) {
  const [newCasesFor30DayPeriod, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  // fetch 30 days of data for selected country
  const fetchData = () => {
    setLoading(true);

    // get dates for fetch request
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 38); // was 32
    const toDate = new Date();
    toDate.setDate(toDate.getDate() - 1);

    const formattedFromDate = fromDate.toISOString().split(".")[0] + "Z";
    const formattedToDate = toDate.toISOString().split(".")[0] + "Z";

    console.log("searching with query:");
    console.log(
      `https://api.covid19api.com/total/country/${route.params.countrySelected.Slug}/status/confirmed?from=${formattedFromDate}&to=${formattedToDate}`
    );

    fetch(
      `https://api.covid19api.com/total/country/${route.params.countrySelected.Slug}/status/confirmed?from=${formattedFromDate}&to=${formattedToDate}`
    )
      .then(response => {
        if (!response.ok) {
          throw Error("Failed to fetch data");
        }

        setError("");
        return response.json();
      })
      .then(json => {
        setData(json);
      })
      .catch(error => setError(error.message))
      .finally(() => setLoading(false));
  };

  const {
    TotalConfirmed,
    NewConfirmed,
    TotalDeaths,
    NewDeaths,
    TotalRecovered,
    NewRecovered,
  } = route.params.countrySelected;

  return (
    <SafeAreaView>
      {isLoading && (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator
            color="blue"
            animating={isLoading}
            size={"large"}
          />
        </View>
      )}
      <ScrollView style={styles.scrollview}>
        {!error.length == 0 && (
          <View style={styles.errorContainer}>
            <Text>{error}</Text>
            <Text>Graph could no be shown. Please try again</Text>
            <CustomButton text="RETRY" handlePress={fetchData} />
          </View>
        )}
        {error.length == 0 && <LineChart data={newCasesFor30DayPeriod} />}
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
  errorContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollview: {
    marginTop: 15,
  },
  activityIndicatorContainer: {
    marginTop: 15,
  },
});
