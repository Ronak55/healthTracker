import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [filter, setFilter] = useState({ startDate: null, endDate: null });
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newActivity, setNewActivity] = useState({ date: '', steps: '', exercise: '', calories: '' });

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setIsLoading(true);
        const storedActivities = await AsyncStorage.getItem('activities');
        if (storedActivities) {
          setActivities(JSON.parse(storedActivities));
        } else {
          setActivities(dummyData);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load activities');
      } finally {
        setIsLoading(false);
      }
    };
    loadActivities();
  }, []);

  const saveActivities = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.setItem('activities', JSON.stringify(activities));
    } catch (error) {
      Alert.alert('Error', 'Failed to save activities');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    saveActivities();
  }, [activities]);

  const handleFilter = () => {
    const filtered = activities.filter(activity => {
      const activityDate = new Date(activity.date);
      const startDate = filter.startDate ? new Date(filter.startDate) : new Date('1970-01-01');
      const endDate = filter.endDate ? new Date(filter.endDate) : new Date();
      return activityDate >= startDate && activityDate <= endDate;
    });
    setFilteredActivities(filtered);
  };

  const handleStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || filter.startDate;
    setShowStartDatePicker(false);
    setFilter({ ...filter, startDate: currentDate });
  };

  const handleEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || filter.endDate;
    setShowEndDatePicker(false);
    setFilter({ ...filter, endDate: currentDate });
  };

  const handleAddActivity = () => {
    if (newActivity.date && newActivity.steps && newActivity.exercise && newActivity.calories) {
      setActivities([...activities, newActivity]);
      setNewActivity({ date: '', steps: '', exercise: '', calories: '' });
    } else {
      Alert.alert('Error', 'Please fill all fields');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Activity Log</Text>

      {/* Filter Section */}
      <View style={styles.filterContainer}>
        <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.datePickerButton}>
          <Text style={styles.datePickerText}>
            {filter.startDate ? filter.startDate.toDateString() : 'Start Date'}
          </Text>
          <Icon name="calendar" size={hp(3)} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.datePickerButton}>
          <Text style={styles.datePickerText}>
            {filter.endDate ? filter.endDate.toDateString() : 'End Date'}
          </Text>
          <Icon name="calendar" size={hp(3)} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleFilter} style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker Modals */}
      {showStartDatePicker && (
        <DateTimePicker
          value={filter.startDate || new Date()}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}
      {showEndDatePicker && (
        <DateTimePicker
          value={filter.endDate || new Date()}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
        />
      )}

      {/* New Activity Section */}
      <View style={styles.newActivityContainer}>
        <TextInput
          placeholder="Date (YYYY-MM-DD)"
          value={newActivity.date}
          onChangeText={(text) => setNewActivity({ ...newActivity, date: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Steps"
          value={newActivity.steps}
          onChangeText={(text) => setNewActivity({ ...newActivity, steps: text })}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          placeholder="Exercise"
          value={newActivity.exercise}
          onChangeText={(text) => setNewActivity({ ...newActivity, exercise: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Calories"
          value={newActivity.calories}
          onChangeText={(text) => setNewActivity({ ...newActivity, calories: text })}
          keyboardType="numeric"
          style={styles.input}
        />
        <TouchableOpacity onPress={handleAddActivity} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Activity</Text>
        </TouchableOpacity>
      </View>

      {/* Activity List */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#28a745" />
      ) : (
        <FlatList
          data={filteredActivities.length > 0 ? filteredActivities : activities}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.activityCard}>
              <Text style={styles.activityDate}>{item.date}</Text>
              <Text style={styles.activityText}>Steps: {item.steps}</Text>
              <Text style={styles.activityText}>Exercise: {item.exercise}</Text>
              <Text style={styles.activityText}>Calories: {item.calories} kcal</Text>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    padding: wp(5),
  },
  header: {
    fontSize: hp(3),
    fontWeight: 'bold',
    marginBottom: hp(2),
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(2),
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: hp(1),
    borderRadius: wp(2),
    width: wp(40),
    justifyContent: 'space-between',
  },
  datePickerText: {
    fontSize: hp(2),
    color: '#333',
  },
  filterButton: {
    backgroundColor: '#28a745',
    paddingVertical: hp(1),
    paddingHorizontal: wp(5),
    borderRadius: wp(2),
  },
  filterButtonText: {
    color: '#fff',
    fontSize: hp(2),
  },
  newActivityContainer: {
    marginVertical: hp(2),
  },
  input: {
    backgroundColor: '#fff',
    padding: hp(1),
    marginVertical: hp(1),
    borderRadius: wp(2),
    borderColor: '#ddd',
    borderWidth: 1,
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: hp(1),
    borderRadius: wp(2),
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: hp(2),
  },
  activityCard: {
    backgroundColor: '#fff',
    padding: hp(2),
    marginVertical: hp(1),
    borderRadius: wp(2),
    elevation: 2,
  },
  activityDate: {
    fontSize: hp(2.2),
    fontWeight: 'bold',
    marginBottom: hp(1),
  },
  activityText: {
    fontSize: hp(2),
    color: '#333',
  },
  listContainer: {
    paddingBottom: hp(5),
  },
});

export default ActivityLog;
