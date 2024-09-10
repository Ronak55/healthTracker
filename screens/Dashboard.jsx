import React, { useState, useEffect, useReducer } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LineChart, ProgressChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Initial state for the reducer
const initialState = {
  steps: 6500,
  calories: 500,
  water: 5,
  loading: false,
  error: null,
};

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, ...action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: true };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const Dashboard = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Data persistence using AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      dispatch({ type: 'SET_LOADING' });
      try {
        const storedSteps = await AsyncStorage.getItem('steps');
        const storedCalories = await AsyncStorage.getItem('calories');
        const storedWater = await AsyncStorage.getItem('water');
        if (storedSteps || storedCalories || storedWater) {
          dispatch({
            type: 'SET_DATA',
            payload: {
              steps: storedSteps ? JSON.parse(storedSteps) : state.steps,
              calories: storedCalories ? JSON.parse(storedCalories) : state.calories,
              water: storedWater ? JSON.parse(storedWater) : state.water,
            },
          });
        }
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    };
    loadData();
  }, []);

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('steps', JSON.stringify(state.steps));
      await AsyncStorage.setItem('calories', JSON.stringify(state.calories));
      await AsyncStorage.setItem('water', JSON.stringify(state.water));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  useEffect(() => {
    saveData();
  }, [state.steps, state.calories, state.water]);

  const screenWidth = Dimensions.get('window').width;

  // Dummy data for charts
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [5000, 8000, 7500, 9000, 6500, 7000, 8500],
        strokeWidth: 2,
      },
    ],
  };

  const progressData = {
    labels: ['Steps', 'Calories', 'Water'],
    data: [state.steps / 10000, state.calories / 2000, state.water / 8],
  };

  if (state.loading) {
    return <ActivityIndicator size="large" color="#28a745" style={styles.loader} />;
  }

  if (state.error) {
    return <Text style={styles.error}>{state.error}</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Health Dashboard</Text>
      
      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <Text style={styles.metricTitle}>Steps Taken</Text>
          <Text style={styles.metricValue}>{state.steps}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.metricTitle}>Calories Burned</Text>
          <Text style={styles.metricValue}>{state.calories} kcal</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.metricTitle}>Water Intake</Text>
          <Text style={styles.metricValue}>{state.water} L</Text>
        </View>
      </View>

      {/* Progress Chart */}
      <ProgressChart
        data={progressData}
        width={wp(90)}
        height={hp(30)}
        strokeWidth={16}
        radius={32}
        chartConfig={chartConfig}
        hideLegend={false}
        style={styles.chart}
      />

      {/* Line Chart */}
      <LineChart
        data={chartData}
        width={wp(90)}
        height={hp(40)}
        yAxisLabel=""
        yAxisSuffix=" steps"
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />

      {/* Action buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="refresh" size={hp(3.5)} color="#fff" />
          <Text style={styles.buttonText}>Refresh Data</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="add-circle" size={hp(3.5)} color="#fff" />
          <Text style={styles.buttonText}>Add Water</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const chartConfig = {
  backgroundColor: '#1e2923',
  backgroundGradientFrom: '#08130D',
  backgroundGradientTo: '#1F5C41',
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  style: {
    borderRadius: 16,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: wp(5),
  },
  header: {
    fontSize: hp(3),
    fontWeight: 'bold',
    marginBottom: hp(2),
    textAlign: 'center',
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: hp(2),
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    width: wp(28),
    padding: hp(2.5),
    alignItems: 'center',
  },
  metricTitle: {
    fontSize: hp(2),
    color: '#333',
    marginBottom: hp(1),
  },
  metricValue: {
    fontSize: hp(2.5),
    fontWeight: 'bold',
  },
  chart: {
    marginVertical: hp(2),
    borderRadius: 16,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: hp(3),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    borderRadius: wp(4),
  },
  buttonText: {
    color: '#fff',
    fontSize: hp(2),
    marginLeft: wp(2),
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: hp(3),
    fontSize: hp(2),
  },
});

export default Dashboard;
