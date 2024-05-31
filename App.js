import React, { useState } from 'react';
import { SafeAreaView, SectionList, View, Text, StyleSheet, StatusBar, Button, TextInput, Modal, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const Tab = createBottomTabNavigator();

const initialData = [
  {
    title: 'Habits',
    subtitle: 'Small habits, big changes',
    data: [
      { title: 'Placeholder', color: 'rgba(252, 223, 202, 0.7)', details: ['Detail Placeholder', 'Detail 2', 'Detail 3'] },
      { title: 'Hydration', color: 'rgba(252, 223, 202, 0.7)', details: ['Goal: 8 cups', 'Current: 6 cups', 'Good Luck!'] },
      { title: 'Fruits', color: 'rgba(252, 223, 202, 0.7)', details: ['Goal: 2 fruits', 'Current: 2 fruits', 'Well Done!'] },
    ],
  },
  {
    title: 'Sides',
    data: [
      { title: 'French Fries', color: 'rgba(252, 223, 202, 0.7)', details: ['potatoes', 'salt'] },
      { title: 'Onion Rings', color: 'rgba(252, 223, 202, 0.7)', details: ['onions', 'breadcrumbs'] },
      { title: 'Fried Shrimps', color: 'rgba(252, 223, 202, 0.7)', details: ['shrimps', 'flour', 'oil'] },
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
      { title: 'Cheese Cake', color: 'rgba(252, 223, 202, 0.7)', details: ['cream cheese', 'sugar', 'vanilla'] },
      { title: 'Ice Cream', color: 'rgba(252, 223, 202, 0.7)', details: ['milk', 'sugar', 'flavoring'] },
    ],
  },
];

const ColorPicker = ({ selectedColor, onColorChange }) => {
  const colors = [
    { label: 'Default', value: 'rgba(252, 223, 202, 0.7)' },
    { label: 'Light Green', value: 'rgba(144, 238, 144, 0.7)' },
    { label: 'Pink', value: 'rgba(255, 192, 203, 0.7)' },
    { label: 'Light Blue', value: 'rgba(175, 238, 238, 0.7)' },
    { label: 'Peach', value: 'rgba(255, 218, 185, 0.7)' },
    { label: 'Light Orange', value: 'rgba(255, 165, 0, 0.7)' },
    { label: 'Honeydew', value: 'rgba(240, 255, 240, 0.7)' },
    { label: 'Alice Blue', value: 'rgba(240, 248, 255, 0.7)' },
    { label: 'Antique White', value: 'rgba(250, 235, 215, 0.7)' },
    { label: 'Lemon Chiffon', value: 'rgba(255, 250, 205, 0.7)' },
    { label: 'Bisque', value: 'rgba(255, 228, 196, 0.7)' },
    { label: 'Sandy Brown', value: 'rgba(244, 164, 96, 0.7)' },
    { label: 'Orchid', value: 'rgba(218, 112, 214, 0.7)' },
    { label: 'Light Pink', value: 'rgba(255, 182, 193, 0.7)' },
  ];

  return (
    <View style={{ marginBottom: 15 }}>
      <Picker
        selectedValue={selectedColor}
        onValueChange={(itemValue, itemIndex) => onColorChange(itemValue)}
      >
        {colors.map((color, index) => (
          <Picker.Item key={index} label={color.label} value={color.value} />
        ))}
      </Picker>
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const [data, setData] = useState(initialData);
  const [modalVisible, setModalVisible] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [dailyGoal, setDailyGoal] = useState('');
  const [currentSection, setCurrentSection] = useState('');
  const [selectedColor, setSelectedColor] = useState('rgba(252, 223, 202, 0.7)');

  const openModal = (sectionTitle) => {
    setCurrentSection(sectionTitle);
    setModalVisible(true);
  };

  const addNewSection = () => {
    const newSection = { title: 'New Section', color: 'rgba(252, 223, 202, 0.7)', details: ['Detail 1', 'Detail 2'] };
    setData(prevData => [...prevData, { title: 'New Section', data: [newSection] }]);
  };

  const addNewItem = () => {
    if (newItemName.trim() !== '' && dailyGoal.trim() !== '') {
      const newItem = { title: newItemName, color: selectedColor, details: [`Daily goal: ${dailyGoal}`] };
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

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={data}
        keyExtractor={(item, index) => item.title + index}
        renderItem={({ item }) => (
          <View style={[styles.item, { backgroundColor: item.color }]}>
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
        renderSectionHeader={({ section }) => {
          if (!section || !section.title) {
            return null;
          }
          return (
            <View style={[styles.headerContainer, { backgroundColor: section.color }]}>
              <Text style={styles.headerTitle}>{section.title}</Text>
              {section.subtitle && <Text style={styles.headerSubtitle}>{section.subtitle}</Text>}
            </View>
          );
        }}
        renderSectionFooter={({ section: { title } }) => (
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => openModal(title)} style={styles.addButton}>
              <Text style={styles.addButtonIcon}>+</Text>
            </TouchableOpacity>
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
            placeholderTextColor="grey"
            placeholder={`Enter new ${currentSection.toLowerCase()} name`}
            value={newItemName}
            onChangeText={text => setNewItemName(text)}
          />
          <Text style={styles.modalText}>What is your daily goal?</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor="grey"
            placeholder="Enter daily goal"
            value={dailyGoal}
            keyboardType="numeric"
            onChangeText={text => setDailyGoal(text)}
          />
          <Text style={styles.modalText}>Select item color:</Text>
          <ColorPicker
            selectedColor={selectedColor}
            onColorChange={(color) => setSelectedColor(color)}
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

const DetailsScreen = ({ route }) => {
  const { item, additionalDetails } = route.params;
  const [counter, setCounter] = useState(0);

  const incrementCounter = () => {
    setCounter(counter + 1);
  };

  const decrementCounter = () => {
    setCounter(counter - 1);
  };

  if (!item) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.additionalDetailsContainer}>
        <Text style={styles.additionalDetailsTitle}>{item.title}</Text>
        {item.details && item.details.map((detail, index) => (
          <Text key={index} style={styles.detail}>{detail}</Text>
        ))}
      </View>
      <View style={styles.additionalDetailsContainer}>
        <Text style={styles.additionalDetailsTitle}>Additional Details:</Text>
        <Text>{additionalDetails}</Text>
      </View>
      <View style={styles.additionalDetailsContainer}>
        <Text style={styles.additionalDetailsTitle}>This counter is to track your daily goals:</Text>
      </View>
      <View style={styles.counterContainer}>
        <Button title="-" onPress={decrementCounter} />
        <Text style={styles.counterText}>{counter}</Text>
        <Button title="+" onPress={incrementCounter} />
      </View>
      <View style={styles.additionalDetailsContainer}>
        <Text style={styles.additionalDetailsTitle}>Table to see your data in the past days:</Text>
        {/* Add table component here */}
      </View>
    </SafeAreaView>
  );
};

const ProfileScreen = () => (
  <View>
    <Text>Profile Screen</Text>
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
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="user" size={size} color={color} />
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
      <Stack.Navigator initialRouteName="Back">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen
          name="Back"
          component={TabNavigator}
          options={{ headerShown: false }} // Hide header for Back screen
        />
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
    padding: 20,
    marginVertical: 8,
    borderRadius: 20,
    marginHorizontal: 16,
  },
  headerContainer: {
    backgroundColor: 'rgba(173, 216, 230, 0.7)',
    padding: 20,
    marginBottom: 8,
    borderRadius: 20,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 24,
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
    padding: 2,
    justifyContent: 'center',
    fontSize: 16,
    color: 'gray',
  },
  additionalDetailsContainer: {
    marginTop: 20,
    padding: 10,
  },
  additionalDetailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
    width: '80%',
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
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -170 }, { translateY: -200 }],
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
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  counterText: {
    fontSize: 24,
    marginHorizontal: 20,
  },
  addButton: {
    backgroundColor: 'lightgrey', // Set background color to grey
    alignItems: 'center',
    justifyContent: 'center',
    width: 360, // Set the width of the button
    height: 50, // Set the height of the button 
    borderRadius: 20,
  },
  addButtonIcon: {
    fontSize: 30, // Increase the font size of the "+"
    color: 'black', // Set color of the "+" sign
  },
});

export default App;
