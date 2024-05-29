import React, { useState } from 'react';
import { SafeAreaView, SectionList, View, Text, StyleSheet, StatusBar, Button, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const initialData = [
  {
    title: 'title placeholder',
    subtitle: 'subtitle placeholder',
    data: [
      { title: 'data1 placeholder', details: ['detail1 placeholder', 'detail2 placeholder', 'detail3 placeholder'] },
      { title: 'data2 placeholder', details: ['detail placeholder', 'detail placeholder', 'detail placeholder'] },
      { title: 'data3 placeholder', details: ['detail placeholder', 'detail placeholder'] },
    ],
  },
  {
    title: 'Sides',
    data: [
      { title: 'French Fries', details: ['potatoes', 'salt'] },
      { title: 'Onion Rings', details: ['onions', 'breadcrumbs'] },
      { title: 'Fried Shrimps', details: ['shrimps', 'flour', 'oil'] },
    ],
  },
  {
    title: 'Drinks',
    data: [
      { title: 'Water' },
      { title: 'Coke' },
      { title: 'Beer' },
    ],
  },
  {
    title: 'Desserts',
    data: [
      { title: 'Cheese Cake', details: ['cream cheese', 'sugar', 'vanilla'] },
      { title: 'Ice Cream', details: ['milk', 'sugar', 'flavoring'] },
    ],
  },
];

const HomeScreen = ({ navigation }) => {
  const [data, setData] = useState(initialData);

  const addNewItem = () => {
    const newItem = { title: 'New Item', details: ['Detail 1', 'Detail 2'] };
    setData(prevData => [...prevData, { title: 'New Section', data: [newItem] }]);
  };

  const [newDrinkName, setNewDrinkName] = useState('');

  const addNewDrink = () => {
    if (newDrinkName.trim() !== '') {
      const newDrink = { title: newDrinkName };
      setData(prevData => {
        const updatedData = prevData.map(section => {
          if (section.title === 'Drinks') {
            return { ...section, data: [...section.data, newDrink] };
          }
          return section;
        });
        return updatedData;
      });
      setNewDrinkName('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={data}
        keyExtractor={(item, index) => item.title + index}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.title}</Text>
            {item.details && (
              <View style={styles.detailsContainer}>
                {item.details.map((detail, index) => (
                  <Text key={index} style={styles.detail}>{detail}</Text>
                ))}
              </View>
            )}
            <Button
              title={`Go to ${item.title} details`}
              onPress={() => navigation.navigate('Details', { title: item.title, details: item.details })}
            />
          </View>
        )}
        renderSectionHeader={({ section: { title, subtitle } }) => (
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>{title}</Text>
            {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
          </View>
        )}
      /> 
      <View style={styles.buttonContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter new drink name"
          value={newDrinkName}
          onChangeText={text => setNewDrinkName(text)}
        />
        <Button title="Add New Drink" onPress={addNewDrink} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Add New Section" onPress={addNewItem} />
      </View>
    </SafeAreaView>
  );
};


const ProfileScreen = ({ route }) => (
  <SafeAreaView style={styles.container}>
    <Text>This is {route.params.name}'s profile</Text>
  </SafeAreaView>
);

const DetailsScreen = ({ route }) => {
  const { item, additionalDetails } = route.params;
  if (!item) {
    return null; // or display a loading indicator or error message
  }
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{item.title}</Text>
      {item.details && (
        <View style={styles.detailsContainer}>
          {item.details.map((detail, index) => (
            <Text key={index} style={styles.detail}>{detail}</Text>
          ))}
        </View>
      )}
      <View style={styles.additionalDetailsContainer}>
        <Text style={styles.additionalDetailsTitle}>Additional Details:</Text>
        <Text>{additionalDetails}</Text>
        {taegdgdg}
      </View>
    </SafeAreaView>
  );
};


const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: '#ffffff', // Set background color for the entire screen
    paddingHorizontal: 16, // Add horizontal padding to the entire screen
    paddingTop: 16, // Add top padding to the entire screen
    paddingBottom: 16, // Add bottom padding to the entire screen
  },
  item: {
    backgroundColor: 'rgba(249, 194, 255, 0.5)',
    padding: 20,
    marginVertical: 8,
    borderRadius: 20,
    marginHorizontal: 16, // Add horizontal margin to the items
  },
  title: {
    fontSize: 24,
  },
  headerContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical:5,
    marginTop: 0,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 16,
    marginTop: 8,
    color: 'gray',
  },
  detailsContainer: {
    marginTop: 10,
  },
  detail: {
    fontSize: 16,
    color: 'gray',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  additionalDetailsContainer: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
    marginTop: 20, // Adjust the margin top to create space between the item details and additional details
  },
  additionalDetailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    width: '80%',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
});


export default App;


