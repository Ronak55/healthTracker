// Import necessary libraries and components
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'; // For icons
import Dashboard from './screens/Dashboard';
import ActivityLog from './screens/ActivityLog';
import HealthTips from './screens/HealthTips';

// Create the Bottom Tab Navigator
const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Dashboard') {
              iconName = focused ? 'md-home' : 'md-home-outline'; // Home icon for dashboard
            } else if (route.name === 'Activity Log') {
              iconName = focused ? 'md-list' : 'md-list-outline'; // List icon for activity log
            } else if (route.name === 'Health Tips') {
              iconName = focused ? 'md-heart' : 'md-heart-outline'; // Heart icon for health tips
            }

            // Return the Ionicons with dynamic icon name, size, and color
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#ff6347',  // Active icon color (e.g., orange)
          tabBarInactiveTintColor: 'gray',   // Inactive icon color
          tabBarStyle: {
            backgroundColor: '#fff',
            height: 60,
            paddingBottom: 10,
            borderTopLeftRadius: 20,        // Rounded top corners
            borderTopRightRadius: 20,
            shadowColor: '#000',            // Shadow effect
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,                   // Elevation for Android shadow
          },
          tabBarLabelStyle: {
            fontSize: 12,
          },
          headerShown: false, // Hide the header for each tab screen
        })}
      >
        <Tab.Screen name="Dashboard" component={Dashboard} />
        <Tab.Screen name="Activity Log" component={ActivityLog} />
        <Tab.Screen name="Health Tips" component={HealthTips} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
