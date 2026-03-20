import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { HomeScreen } from "../screens/HomeScreen";
import { NewTravelEntry } from "../screens/NewTravelEntry"; // You will create this next

// 1. Define the routing parameter types
export type RootStackParamList = {
  Home: undefined;
  NewTravelEntry: undefined;
};

// 2. Pass the types to the stack creator
const Stack = createStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerShown: false, // Hides the default header globally since you built custom ones
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen 
          name="NewTravelEntry" 
          component={NewTravelEntry} 
          options={{
            presentation: 'modal', // Slides up from the bottom on iOS
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}