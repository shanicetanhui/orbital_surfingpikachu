import React, { useState } from 'react';
import { SafeAreaView, SectionList, View, Text, StyleSheet, StatusBar, Button, TextInput, Modal, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

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
  const [modalVisible, setModalVisible] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [dailyGoal, setDailyGoal] = useState('');
  const [currentSection, setCurrentSection] = useState('');

  const openModal = (sectionTitle) => {
    setCurrentSection(sectionTitle);
    setModalVisible(true);
  };

  const addNewItem = () => {
    if (newItemName.trim() !== '' && dailyGoal.trim() !== '') {
      const newItem = { title: newItemName, details: [`Daily goal: ${dailyGoal}`] };
      setData((prevData) => {
        const updatedData = prevData.map((section) => {
          if (section.title === currentSection) {
            return { ...section, data: [...section.data, newItem] };
          }
          return section;
        });
        return updatedData;
      });
      setNewItemName('');
      setDailyGoal('');
      setModalVisible(false);
    }
  };


  const renderSectionFooter = (section) => (
    <View style={styles.footerContainer}>
      <TextInput
        style={styles.input}
        placeholder={`Enter new ${section.title.toLowerCase()} name`}
        value={currentSection === section.title ? newItemName : ''}
        onFocus={() => setCurrentSection(section.title)}
        onChangeText={text => setNewItemName(text)}
      />
      <Button title="Add New Item" onPress={() => addNewItem(section.title)} />
    </View>
  );

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
              onPress={() => navigation.navigate('Details', { item, additionalDetails: 'Some additional details here' })}
            />
          </View>
        )}
        renderSectionHeader={({ section: { title, subtitle } }) => (
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>{title}</Text>
            {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
          </View>
        )}
        renderSectionFooter={({ section: { title } }) => (
          <View style={styles.buttonContainer}>
            <Button title={`Add New ${title}`} onPress={() => openModal(title)} />
          </View>
        )}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Enter new {currentSection.toLowerCase()} name</Text>
          <TextInput
            style={styles.input}
            placeholder={`Enter new ${currentSection.toLowerCase()} name`}
            value={newItemName}
            onChangeText={text => setNewItemName(text)}
          />
          <Text style={styles.modalText}>What is your daily goal?</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter daily goal"
            value={dailyGoal}
            keyboardType="numeric"
            onChangeText={text => setDailyGoal(text)}
          />
          <TouchableOpacity style={styles.button} onPress={addNewItem}>
            <Text style={styles.buttonText}>Add Item</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <View style={styles.buttonContainer}>
        <Button title="Add New Section" onPress={() => addNewSection()} />
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
      </View>
      <Text style={styles.title}>This page is to track your daily goals.</Text>
    </SafeAreaView>
  );
};

const ReminderScreen = () => (
  <View>
    <Text>Reminder Screen</Text>
  </View>
);

const BirthdayScreen = () => (
  <View>
    <Text>Birthday Screen</Text>
  </View>
);

const SettingsScreen = () => (
  <View>
    <Text>Settings Screen</Text>
  </View>
);

const colors = {
  background: '#ffffff',
  tab: '#f8f8f8',
  accent: '#ff6347',
  primary: '#000000'
};

const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      sceneContainerStyle={{ backgroundColor: colors.background }}
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveBackgroundColor: colors.tab,
        tabBarInactiveBackgroundColor: colors.tab,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.primary,
      }}
    >
      <Tab.Screen
      name="Homescreen"
      component={HomeScreen}
      options={{
        tabBarIcon: ({size, color }) => (
          <AntDesign name="home" size={size} color={color} />
        ),
        }}
        />
      <Tab.Screen
        name="Reminder"
        component={ReminderScreen}
        options={{
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="clockcircleo" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Birthday"
        component={BirthdayScreen}
        options={{
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="gift" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="setting" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainTabs">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="MainTabs" component={TabNavigator} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  item: {
    backgroundColor: 'rgba(249, 194, 255, 0.5)',
    padding: 20,
    marginVertical: 8,
    borderRadius: 20,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 24,
  },
  headerContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 5,
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
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
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
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  buttonClose: {
    backgroundColor: '#f44336',
  },
});

export default App;




