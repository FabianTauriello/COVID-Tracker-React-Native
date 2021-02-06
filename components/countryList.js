import React, { useEffect, useState } from "react";
import { SearchBar } from "react-native-elements";
import CustomButton from "./customButton";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from "react-native";

export default function CountryList({ navigation }) {
  // used for animating indicator
  const [isLoading, setLoading] = useState(true);
  // full list of data fetched from api
  const [countryListData, setListData] = useState([]);
  // filtered list of data fetched from api (based on search query)
  const [countryFilteredListData, setFilteredListData] = useState([]);
  // search query text
  const [searchText, setSearchTextData] = useState("");
  // error message
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  // fetch all country data from api and update state
  // this is called on initialization and repeated when the user clicks the retry button
  const fetchData = () => {
    setLoading(true);
    fetch("https://api.covid19api.com/summary")
      .then((response) => {
        if (!response.ok) {
          throw Error("Failed to fetch data");
        }

        setError("");
        return response.json();
      })
      .then((json) => {
        setListData(json.Countries);
        setFilteredListData(json.Countries);
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  };

  // handle click of an individual country - navigate to country stats screen, passing in country object as param
  const searchByCountryBtnHandler = (country) => {
    navigation.navigate("CountryStats", {
      countrySelected: country,
    });
  };

  // update search query text and filter list as user types into the search bar
  const searchByCountryTextChangeHandler = (text) => {
    // update search query text
    setSearchTextData(text);

    // match the search query with items in the full list
    const arrayRes = countryListData.filter((item) =>
      item.Country.toLowerCase().includes(text.toLowerCase())
    );

    // update the filtered list with the items matched
    setFilteredListData(arrayRes);
  };

  // component for displaying the list of countries
  const CountryList = () => {
    return (
      <FlatList
        style={styles.list}
        ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
        keyExtractor={(item) => item.ID}
        data={
          // show the full list if the search query is empty. otherwise, show a filtered list
          searchText.length == 0 ? countryListData : countryFilteredListData
        }
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => searchByCountryBtnHandler(item)}>
            <Text style={styles.listItem}>{item.Country}</Text>
          </TouchableOpacity>
        )}
      />
    );
  };

  return (
    <SafeAreaView>
      {isLoading && (
        <View style={[styles.activityIndicatorContainer]}>
          <ActivityIndicator
            color="blue"
            animating={isLoading}
            size={"large"}
          />
        </View>
      )}
      {!error.length == 0 && (
        <View style={styles.container}>
          <Text>{error}</Text>
          <Text>Please try again</Text>
          <CustomButton text="RETRY" handlePress={fetchData} />
        </View>
      )}
      {error.length == 0 && (
        <View style={styles.container}>
          <SearchBar
            value={searchText}
            placeholder="Search for a country"
            onChangeText={searchByCountryTextChangeHandler}
            containerStyle={styles.searchContainerStyle}
            lightTheme
          />
          <CountryList />
        </View>
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
  searchContainerStyle: {
    width: "100%",
  },
  list: {
    alignSelf: "stretch",
  },
  listItem: {
    padding: 15,
    fontSize: 18,
  },
  listSeparator: {
    height: 1,
    marginStart: 10,
    marginRight: 10,
    backgroundColor: "#CED0CE",
  },
  activityIndicatorContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 100,
  },
});
