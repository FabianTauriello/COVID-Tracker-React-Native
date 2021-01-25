import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import GlobalStats from "./globalStats";
import CountryList from "./countryList";
import CountryStats from "./countryStats";

export default function NavStack() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="GlobalStats"
        component={GlobalStats}
        options={{
          title: "Global Stats",
          headerTintColor: "white",
          headerStyle: { backgroundColor: "black" },
        }}
      />
      <Stack.Screen
        name="CountryList"
        component={CountryList}
        options={{
          title: "Countries",
          headerTintColor: "white",
          headerStyle: { backgroundColor: "black" },
        }}
      />
      <Stack.Screen
        name="CountryStats"
        component={CountryStats}
        options={({ route }) => ({
          // set title of this screen to title param passed in
          title: route.params.countrySelected.Country,
          headerTintColor: "white",
          headerStyle: { backgroundColor: "black" },
        })}
      />
    </Stack.Navigator>
  );
}
