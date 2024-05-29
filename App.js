// App.js
/*
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import HydrationTab from './HydrationTab';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Settings" component={HydrationTab} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
*/

// HomeScreen.js
import * as React from 'react';
import { SafeAreaView, SectionList, View, Text, StyleSheet, StatusBar, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const DATA = [
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

const HomeScreen = ({ navigation }) => (
  <SafeAreaView style={styles.container}>
    <Button
      title="Go to Jane's profile"
      onPress={() => navigation.navigate('Profile', { name: 'Jane' })}
    />
    <SectionList
      sections={DATA}
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
        </View>
      )}
      renderSectionHeader={({ section: { title, subtitle } }) => (
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>{title}</Text>
          {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
        </View>
      )}
    />
  </SafeAreaView>
);


const ProfileScreen = ({ route }) => {
  return (
    <View style={styles.container}>
      <Text>This is {route.params.name}'s profile</Text>
    </View>
  );
};

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    marginHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    backgroundColor: 'rgba(249, 194, 255, 0.5)',
    padding: 20,
    marginVertical: 8,
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
  },
  headerContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
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
});

export default App;


