import React, { useState, useEffect, useRef } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, StatusBar, SafeAreaView, SectionList, View, Text, Button, TextInput, Modal, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { init, fakedata, read_habits, add_habit, fetch_one_habit, today_date, create_or_update} from './db';
import { Picker } from '@react-native-picker/picker';

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
    padding: 10,
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
    top: '50%', // Set top to 50% of the screen height
    left: '50%', // Set left to 50% of the screen width
    transform: [{ translateX: -170 }, { translateY: -200 }], // Move the modal
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
});

// const styles from before legendary pullmerge
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginTop: StatusBar.currentHeight || 0,
//     backgroundColor: '#ffffff',
//     paddingHorizontal: 16,
//     paddingTop: 16,
//     paddingBottom: 16,
//   },
//   item: {
//     backgroundColor: 'rgba(249, 194, 255, 0.5)',
//     padding: 20,
//     marginVertical: 8,
//     borderRadius: 20,
//     marginHorizontal: 16,
//   },
//   title: {
//     fontSize: 24,
//   },
//   headerContainer: {
//     backgroundColor: '#fff',
//     paddingHorizontal: 20,
//     paddingVertical: 5,
//     marginTop: 0,
//     borderRadius: 8,
//   },
//   headerTitle: {
//     fontSize: 32,
//     fontWeight: 'bold',
//   },
//   headerSubtitle: {
//     fontSize: 16,
//     marginTop: 8,
//     color: 'gray',
//   },
//   detailsContainer: {
//     marginTop: 10,
//   },
//   detail: {
//     fontSize: 16,
//     color: 'gray',
//   },
//   buttonContainer: {
//     backgroundColor: 'rgba(255, 255, 255, 0.5)',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginVertical: 20,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     borderRadius: 5,
//     width: '80%',
//     marginVertical: 10,
//     paddingHorizontal: 10,
//   },
//   modalView: {
//     margin: 20,
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 35,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   modalText: {
//     marginBottom: 15,
//     textAlign: 'center',
//     fontSize: 18,
//   },
//   button: {
//     backgroundColor: '#2196F3',
//     borderRadius: 20,
//     padding: 10,
//     elevation: 2,
//     marginVertical: 5,
//   },
//   buttonText: {
//     color: 'white',
//     textAlign: 'center',
//   },
//   buttonClose: {
//     backgroundColor: '#f44336',
//   },
//   counterContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 20,
//   },
//   counterText: {
//     fontSize: 24,
//     marginHorizontal: 20,
//   },
// });

init();
fakedata();

const initialData = [
  {
    title: 'Habits',
    subtitle: 'Small habits, big changes',
    data: [
      { title: 'Water', details: ['water placeholder desc', 'goals', 'current'], color:'rgba(252, 223, 202, 0.7)'},
      { title: 'Fruits', details: ['fruits placeholder desc', 'goals', 'current'], color:'rgba(252, 223, 202, 0.7)'}
    ],
  },
];

// async function read_initialData() {
//   const rows = await read_habits();
//   console.log("read initialdata");
//   console.log(rows);
//   for (const row of rows) {
//     initialData[0].data.push(
//       { title: row.habit, details: [row.description], color:'rgba(252, 223, 202, 0.7)'}
//     );
//   }
//   console.log("done reading initial");
// }

// read_initialData();

// const initialData = [
//   {
//     title: 'Habits',
//     subtitle: 'Small habits, big changes',
//     data: [
//       { title: 'Placeholder', color: 'rgba(252, 223, 202, 0.7)', details: ['Detail Placeholder', 'Detail 2', 'Detail 3'] },
//       { title: 'Hydration', color: 'rgba(252, 223, 202, 0.7)', details: ['Goal: 8 cups', 'Current: 6 cups', 'Good Luck!'] }, // Set default color to orange
//       { title: 'Fruits', color: 'rgba(252, 223, 202, 0.7)', details: ['Goal: 2 fruits', 'Current: 2 fruits', 'Well Done!'] }, // Set default color to orange
//     ],
//   },
//   {
//     title: 'Sides',
//     data: [
//       { title: 'French Fries', color: 'rgba(252, 223, 202, 0.7)', details: ['potatoes', 'salt'] }, // Set default color to orange
//       { title: 'Onion Rings', color: 'rgba(252, 223, 202, 0.7)', details: ['onions', 'breadcrumbs'] }, // Set default color to orange
//       { title: 'Fried Shrimps', color: 'rgba(252, 223, 202, 0.7)', details: ['shrimps', 'flour', 'oil'] }, // Set default color to orange
//     ],
//   },
//   {
//     title: 'Drinks',
//     data: [
//       { title: 'Water' },
//       { title: 'Coke' },
//       { title: 'Beer' },
//     ],
//   },
//   {
//     title: 'Desserts',
//     data: [
//       { title: 'Cheese Cake', color: 'rgba(252, 223, 202, 0.7)', details: ['cream cheese', 'sugar', 'vanilla'] }, // Set default color to orange
//       { title: 'Ice Cream', color: 'rgba(252, 223, 202, 0.7)', details: ['milk', 'sugar', 'flavoring'] }, // Set default color to orange
//     ],
//   },
// ];

const ColorPicker = ({ selectedColor, onColorChange }) => { //unoperational for now
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
    // Add more colors as needed
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

export const HomeScreen = ({ navigation }) => {
  
  const [data, setData] = useState(initialData);
  const [modalVisible, setModalVisible] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [dailyGoal, setDailyGoal] = useState('');
  const [currentSection, setCurrentSection] = useState('');
  const [selectedColor, setSelectedColor] = useState('rgba(252, 223, 202, 0.7)'); // Default color

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
      // console.log("adding new item")
      add_habit(newItem.title, newItem.details[0]);
      // console.log(read_habits());
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
            return null; // Render nothing if section or title is undefined
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

export const DetailsScreen = ({ route }) => {
  const { item, additionalDetails } = route.params;
  const [habitData, setHabitData] = useState([]);
  const [counter, setCounter] = useState(0);
  const counterRef = useRef(counter);

  const day = today_date();

  // changes habitData
  const fetchHabits = async () => {
    const data = await fetch_one_habit(item.title);
    // console.log(data);
    setHabitData(data);
  };

  // calls fetchHabits on load
  useEffect(() => {
    fetchHabits();
  }, []);

  // extracts number from data
  const initialCounter = () => {
    const entry = habitData.find(item => item.day == day);
    console.log(entry);
    return entry ? entry.num : 0;
  }

  // calls initialCounter, triggered by habitData
  useEffect(() => {
    setCounter(initialCounter);
  }, [habitData]);

  useEffect(() => {
    console.log(counter);
    counterRef.current = counter;
  }, [counter]);

  const incrementCounter = () => {
    setCounter(prevCounter => prevCounter + 1);
  };
  
  const decrementCounter = () => {
    setCounter(prevCounter => prevCounter - 1);
  };

  if (!item) {
    return null; // or display a loading indicator or error message
  }

  // this function triggers when we exit the details page
  // since it would be costly to keep making statements for every increment or decrement
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        console.log(counterRef.current);
        create_or_update(item.title, day, counterRef.current);
      };
    }, [])
  );

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

      <View>
        <Text> Data vis should go here </Text>
      </View>

      <View style={styles.additionalDetailsContainer}>
        <Text style={styles.additionalDetailsTitle}>Table to see your data in the past days:</Text>
        {/* Add table component here */}
      </View>

    </SafeAreaView>
  );
};

export const ReminderScreen = () => (
  <View>
    <Text>Reminder Screen</Text>
  </View>
);

export const BirthdayScreen = () => (
  <View>
    <Text>Birthday Screen</Text>
  </View>
);

export const SettingsScreen = () => (
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

export const Stack = createNativeStackNavigator();

export const Tab = createBottomTabNavigator();

export function TabNavigator() {
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

export const ProfileScreen = ({ route }) => (
  <SafeAreaView style={styles.container}>
    <Text>This is {route.params.name}'s profile</Text>
  </SafeAreaView>
);