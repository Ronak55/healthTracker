import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Image, ActivityIndicator, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';  // Import Ionicons
import AsyncStorage from '@react-native-async-storage/async-storage';

const HealthTips = () => {
  const [tips, setTips] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTips, setFilteredTips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newTip, setNewTip] = useState({ title: '', content: '', category: '', image: null });

  const dummyTips = [
    // Dummy data as before
    {
      id: 1,
      title: 'Stay Hydrated',
      content: 'Drinking plenty of water can help boost your metabolism, clear your skin, and improve overall health.',
      category: 'Nutrition',
      image: require('../assets/water.png'), // Add relevant images in assets folder
    },
    {
      id: 2,
      title: 'Regular Exercise',
      content: 'Exercise for at least 30 minutes a day to keep your body active and maintain cardiovascular health.',
      category: 'Exercise',
      image: require('../assets/exercise.png'),
    },
    {
      id: 3,
      title: 'Healthy Diet',
      content: 'A balanced diet rich in fruits, vegetables, and lean proteins can promote weight loss and improve your health.',
      category: 'Nutrition',
      image: require('../assets/diet.jpeg'),
    },
    {
      id: 4,
      title: 'Get Enough Sleep',
      content: 'Adequate sleep is crucial for mental and physical well-being. Aim for 7-9 hours each night.',
      category: 'Mental Health',
      image: require('../assets/sleep.png'),
    },
    {
      id: 5,
      title: 'Mindfulness Meditation',
      content: 'Meditating for 10 minutes a day can reduce stress and anxiety, improving overall mental health.',
      category: 'Mental Health',
      image: require('../assets/meditation.jpg'),
    },
  ];

  useEffect(() => {
    const loadTips = async () => {
      try {
        setIsLoading(true);
        const storedTips = await AsyncStorage.getItem('healthTips');
        if (storedTips) {
          setTips(JSON.parse(storedTips));
          setFilteredTips(JSON.parse(storedTips));
        } else {
          setTips(dummyTips);
          setFilteredTips(dummyTips);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load tips');
      } finally {
        setIsLoading(false);
      }
    };
    loadTips();
  }, []);

  const saveTips = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.setItem('healthTips', JSON.stringify(tips));
    } catch (error) {
      Alert.alert('Error', 'Failed to save tips');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    saveTips();
  }, [tips]);

  const searchTips = (query) => {
    const filtered = tips.filter((tip) => tip.title.toLowerCase().includes(query.toLowerCase()));
    setFilteredTips(filtered);
  };

  useEffect(() => {
    searchTips(searchQuery);
  }, [searchQuery]);

  const handleAddTip = () => {
    if (newTip.title && newTip.content && newTip.category && newTip.image) {
      setTips([...tips, { ...newTip, id: tips.length + 1 }]);  // Ensure unique ID
      setNewTip({ title: '', content: '', category: '', image: null });
    } else {
      Alert.alert('Error', 'Please fill all fields and select an image');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.tipCard}>
      <Image source={item.image} style={styles.tipImage} />
      <View style={styles.tipTextContainer}>
        <Text style={styles.tipTitle}>{item.title}</Text>
        <Text style={styles.tipContent}>{item.content}</Text>
        <View style={styles.categoryRow}>
          <Ionicons name="pricetag-outline" size={hp(2.5)} color="#888" /> {/* Category Icon */}
          <Text style={styles.tipCategory}>{item.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Health Tips</Text>
      {/* Search Bar with Icon */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={hp(3)} color="#888" /> {/* Search Icon */}
        <TextInput
          style={styles.searchBar}
          placeholder="Search tips..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>
      {/* Add New Tip Section */}
      <View style={styles.newTipContainer}>
        <TextInput
          placeholder="Title"
          value={newTip.title}
          onChangeText={(text) => setNewTip({ ...newTip, title: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Content"
          value={newTip.content}
          onChangeText={(text) => setNewTip({ ...newTip, content: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Category"
          value={newTip.category}
          onChangeText={(text) => setNewTip({ ...newTip, category: text })}
          style={styles.input}
        />
        {/* Placeholder for image picker */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddTip}>
          <Text style={styles.addButtonText}>Add Tip</Text>
        </TouchableOpacity>
      </View>
      {/* Tip List */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={filteredTips}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: wp(5),
  },
  header: {
    fontSize: hp(3),
    fontWeight: 'bold',
    marginBottom: hp(2),
    textAlign: 'center',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: hp(1.5),
    borderRadius: wp(3),
    marginBottom: hp(2),
    borderColor: '#ccc',
    borderWidth: 1,
  },
  searchBar: {
    flex: 1,
    fontSize: hp(2),
    marginLeft: wp(2),
  },
  newTipContainer: {
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
    marginTop: hp(1),
  },
  addButtonText: {
    color: '#fff',
    fontSize: hp(2),
  },
  listContainer: {
    paddingBottom: hp(10),
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: hp(2),
    marginVertical: hp(1),
    borderRadius: wp(2),
    elevation: 2,
  },
  tipImage: {
    width: wp(15),
    height: hp(10),
    borderRadius: wp(2),
    marginRight: wp(3),
  },
  tipTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  tipTitle: {
    fontSize: hp(2.5),
    fontWeight: 'bold',
    color: '#333',
  },
  tipContent: {
    fontSize: hp(2),
    color: '#666',
    marginTop: hp(0.5),
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(0.5),
  },
  tipCategory: {
    fontSize: hp(1.8),
    color: '#888',
    marginLeft: wp(1),
    fontStyle: 'italic',
  },
});

export default HealthTips;
