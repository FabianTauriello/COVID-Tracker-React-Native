import React, { useEffect, useState } from "react";
import DataRow from "../components/dataRow";
import { Text, View, StyleSheet, SafeAreaView } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

// dashboard/home screen for showing worldwide covid data
export default function GlobalStats({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [globalData, setData] = useState({});

  // fetch global data from api and update state
  useEffect(() => {
    fetch("https://api.covid19api.com/summary")
      .then((response) => response.json())
      .then((json) => setData(json.Global))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  // handle button click - move to country list component
  const seachByCountryBtnHandler = () => {
    navigation.navigate("CountryList");
  };

  // custom button component only for global stats screen
  const SearchByCountryBtn = () => {
    return (
      <TouchableOpacity onPress={seachByCountryBtnHandler}>
        <View style={styles.buttonContainer}>
          <Text style={styles.buttonText}>SEARCH BY COUNTRY</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <DataRow text="Total Cases" data={globalData.TotalConfirmed} />
      <DataRow text="New Cases" data={globalData.NewConfirmed} />
      <DataRow text="Total Deaths" data={globalData.TotalDeaths} />
      <DataRow text="New Deaths" data={globalData.NewDeaths} />
      <DataRow text="Total Recovered" data={globalData.TotalRecovered} />
      <DataRow text="New Recovered" data={globalData.NewRecovered} />
      <SearchByCountryBtn />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    marginTop: 15,
  },
  buttonContainer: {
    alignSelf: "center",
    backgroundColor: "black",
    padding: 20,
    borderRadius: 10,
    marginBottom: 50,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});
