import React, { useState, useEffect, useRef } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, StatusBar, SafeAreaView, SectionList, View, Text, Button, TextInput, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { init, fakedata, display, date_display_format, read_habits, add_habit, fetch_entries_habit, today_date, create_or_update, delete_habit} from './db';
import { LineChart, BarChart, PieChart, ProgressChart, ContributionGraph, StackedBarChart } from "react-native-chart-kit";
import { Picker } from '@react-native-picker/picker';
import { Timestamp } from 'firebase/firestore';
import DatePicker from 'react-native-date-picker';
// import DatePicker from 'react-datepicker';
import * as Notifications from 'expo-notifications';

// stylesheet
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
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
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
  tableContainer: {
    // flex: 1,
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
  },
  table: {
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  cell: {
    flex: 1,
    padding: 10,
    textAlign: 'center'
  },
  deleteButton: {
    position: 'absolute',
    right: 1,
    top: -50,
    padding: 5,
  },
  deleteButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  gotoDetailsButton: {

  },
  gotoDetailsText: {
    fontSize: 18,
    textAlign: 'center', 
    color: 'blue',
  },
  notAvailText: {
    fontSize: 8,
    color: 'grey',
    textAlign: 'center',
    textAlignVertical: 'center'
  }
});

// export const Test = () => {
//   add_habit("sleep", "", 'rgba(252, 223, 202, 0.7)', 1000);
//   console.log("test component");
//   display();
// }

// front end purposes
const initialData = [
  {
    title: 'Habits',
    subtitle: 'Small habits, big changes',
    data: []
  }
];

// read fake data (for now) into front-end initialData
async function read_initialData(setData) {
  const rows = await read_habits();
  const newData = [...initialData];
  rows.forEach((row) => {
    newData[0].data.push(
      { title: row.display_name, details: [row.description], goal:row.goal, color:row.color}
    )
  });
  console.log("read initial data");
  console.log(newData);
  setData(newData);
}

// colour picker for habit
// TODO: preview colours?
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
          <Picker.Item key={index} label={color.label} value={color.value} color={color.color}/>
        ))}
      </Picker>
    </View>
  );
};

// home screen
export const HomeScreen = ({ navigation }) => {

  // Hooks for variables
  const [data, setData] = useState(initialData);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [newItemName, setNewItemName] = useState('');
  const [dailyGoal, setDailyGoal] = useState('');
  const [currentSection, setCurrentSection] = useState('');
  const [selectedColor, setSelectedColor] = useState('rgba(252, 223, 202, 0.7)');

  useEffect(() => {
    read_initialData(setData);
  }, []);

  // modal -> popups like in 'add new habit/section' 
  const openModal = (sectionTitle) => {
    setCurrentSection(sectionTitle);
    setAddModalVisible(true);
  };

  const addNewItem = () => {
    if (newItemName.trim() !== '' && dailyGoal.trim() !== '') {
      const newItem = { title: newItemName, color: selectedColor, details: [`Daily goal: ${dailyGoal}`], goal: dailyGoal };
      console.log("adding new item")
      add_habit(newItem.title, newItem.color, newItem.goal);
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
      setAddModalVisible(false);
    }
  };

  // not yet implemented
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
  const handleDelete = () => {
    if (itemToDelete) {
      const updatedData = data.map(section => ({
        ...section,
        data: section.data.filter(item => item.title !== itemToDelete.title),
      }));
      setData(updatedData);
      console.log("calling delete_habit");
      delete_habit(itemToDelete.title);
      setDeleteModalVisible(false);
      setItemToDelete(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <Test></Test> */}
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
                <TouchableOpacity
                  onPress={() => {
                    setItemToDelete(item);
                    setDeleteModalVisible(true);
                  }}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>...</Text>
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity 
      style={styles.gotoDetailsButton} 
      onPress={() => navigation.navigate('Details', { item, additionalDetails: 'Some additional details here' })}
    >
      <Text style={styles.gotoDetailsText}>Go to {item.title} details</Text>
    </TouchableOpacity>
          </View>
        )}
        renderSectionHeader={({ section }) => (
          <View style={[styles.headerContainer, { backgroundColor: section.color }]}>
            <Text style={styles.headerTitle}>{section.title}</Text>
            {section.subtitle && <Text style={styles.headerSubtitle}>{section.subtitle}</Text>}
          </View>
        )}
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
        visible={addModalVisible}
        onRequestClose={() => {
          setAddModalVisible(!addModalVisible);
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
            onPress={() => setAddModalVisible(!addModalVisible)}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        transparent={true}
        animationType="slide"
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text>Are you sure you want to delete this item?</Text>
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setDeleteModalVisible(false)} />
              <Button title="Delete" onPress={handleDelete} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// details screen
export const DetailsScreen = ({ route }) => {
  const { item, additionalDetails } = route.params;

  // Hooks for habitData and counter
  const [habitData, setHabitData] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedData, setEditedData] = useState({
    day: '',
    num: '',
  });
  // format of habitData:
  // [{ day: Date object, num: integer, habit: habitid }, { day: Date object, num: integer, habit: habitid }]
  const [counter, setCounter] = useState(0);
  const [linechartdata, setLinechartdata] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        // color: (opacity = 1) => `rgba(255, 162, 0, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
    legend: [] // optional
  });

  // the Refs are necessary for the useFocusEffect function
  const counterRef = useRef(counter);
  const habitDataRef = useRef(habitData);

  // Function to open modal and set the initial values
  const openEditModal = (data) => {
    setEditedData({
      day: data.day.toString(),
      num: data.num,
    });
    setEditModalVisible(true);
  };

  // Function to handle submission of edited data
  const handleEditSubmit = () => {
    // Handle the submission logic here
    console.log(editedData);
    setEditModalVisible(false);
  };

  // DATA VISUALISATION

  const screenWidth = Dimensions.get("window").width - 2*styles.additionalDetailsContainer.padding;
  // console.log(styles.additionalDetailsContainer.padding);
  // console.log(screenWidth);

  const chartConfig = {
    // color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    // backgroundColor: "#e26a00",
    // barPercentage: 0.5,
    // decimalPlaces: 0,

    backgroundColor: "#e26a00",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "3",
      strokeWidth: "6",
      stroke: "#ffa726"
    }

  };

  const updateLinechartdata = (data) => {
    console.log("update linechart");
    const newLinechartdata = {
      labels: data.map(entry => date_display_format(entry.day)), //think of somehting beter
      datasets: [
        {
          data: data.map(entry => entry.num),
          // color: (opacity = 1) => `rgba(255, 162, 0, ${opacity})`, // optional
          // strokeWidth: 2 // optional
        }
      ],
      legend: [] // optional
    };
    console.log(newLinechartdata);
    setLinechartdata(newLinechartdata);
  };

  // for fetching data!
  const day = today_date();

  // overall effect of the following functions:
  // reliably grab details of one habit once the details screen is rendered
  // use all data for data vis!

  // fetch data from backend
  const fetchHabits = async () => {
    try {
      // fetch all entries for the current habit
      const data = await fetch_entries_habit(item.title);
      data.sort((a, b) => a.day - b.day);
      setHabitData(data);
      // habitDataRef.current = data;
      console.log("data is");
      console.log(data);
      // update linechartdata
      // console.log("updating linechart!");
      // updateLinechartdata(data);
      // look through the entries to see if there is an entry for today
      const entry = data.find(item => item.day.toDateString() === day.toDateString());
      // if there is an entry for today, grab today's number for counter
      // if there isn't an entry, set the counter to 0
      setCounter(entry ? entry.num : 0);
      // console.log(counter);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  // calls fetchHabits on load
  useEffect(() => {
    fetchHabits();
  }, []);

  // triggered by counter changing
  useEffect(() => {
    counterRef.current = counter;
  }, [counter]);

  useEffect(() => {
    habitDataRef.current = habitData;
    updateLinechartdata(habitData);
  }, [habitData]);

  // for counters
  const incrementCounter = () => {
    setCounter(prevCounter => prevCounter + 1);
  };
  const decrementCounter = () => {
    setCounter(prevCounter => prevCounter - 1);
  };

  if (!item) {
    return null;
  }

  // const openModal = (sectionTitle) => {
  //   setCurrentSection(sectionTitle);
  //   setAddModalVisible(true);
  // };

  // this function triggers when we exit the details page
  // since it would be costly to keep making noSQL statements for every increment or decrement
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        console.log("going to call create or update");
        // console.log(item.title);
        // console.log(day);
        console.log(counterRef.current);
        console.log(item.title);
        create_or_update(item.title, day, counterRef.current);
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* text */}
       <View style={styles.additionalDetailsContainer}>
        <Text style={styles.additionalDetailsTitle}>{item.title}</Text>
        {item.details && item.details.map((detail, index) => (
          <Text key={index} style={styles.detail}> {detail}</Text>
        ))}
      </View>
      
      {/* today's data */}
      <View style={styles.additionalDetailsContainer}>
        <Text style={styles.additionalDetailsTitle}>Today's number:</Text>
      </View>

      {/* counter */}
      <View style={styles.counterContainer}>
        <Button title="-" onPress={decrementCounter} />
        <Text style={styles.counterText}>{counter}</Text>
        <Button title="+" onPress={incrementCounter} />
      </View>
      
      {/* data vis! */}

      <View style={styles.tableContainer}>
        <Text style={styles.additionalDetailsTitle}>Your data in the past days:</Text>
      </View>

      { (linechartdata.datasets[0].data.length<2) && 
        <View>
          <Text style={styles.notAvailText}>Not enough data to make graph :( </Text>
          <Text style={styles.notAvailText}>Add some! </Text>
        </View>
      }

      { (linechartdata.datasets[0].data.length>1) &&
        <>
          <View style={styles.additionalDetailsContainer}>
            <LineChart
              data={linechartdata}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              formatYLabel={(yValue) => { return Math.round(yValue).toString();}}
              onDataPointClick={(value, dataset, getColor) => {}}
              fromZero={true}
            />
          </View>
        </>
      }

      { habitDataRef.current.map((entry) => {
        return (
          <View style={styles.item}>
            <Text> {date_display_format(entry.day)} - {entry.num}  -
              <Button title="edit" onPress={() => openEditModal(entry)}/>
            </Text>
          </View>
        )
        })
      }

      <Modal
        transparent={true}
        animationType="slide"
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Edit Data</Text>
          <TextInput
            style={styles.input}
            placeholder="day"
            value={editedData.day}
            onChangeText={(text) => setEditedData({ ...editedData, day: text })}
          />

          <DatePicker
            date={new Date()}
            mode="date"
            onDateChange={() => {console.log("datechange")}}
          />

          {/* <DatePicker
            selected={new Date()}
            onDateChange={() => {console.log("datechange")}}
          /> */}

          <TextInput
            style={styles.input}
            placeholder="num"
            value={editedData.num}
            onChangeText={(text) => setEditedData({ ...editedData, num: text })}
          />
          {/* Add other input fields as necessary */}

          <TouchableOpacity style={styles.button} onPress={handleEditSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={() => setEditModalVisible(false)}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>

          {/* <Button style={styles.buttonText} title="Submit" onPress={() => handleEditSubmit} />
          <Button style={styles.buttonText} title="Cancel" onPress={() => setEditModalVisible(false)} /> */}
      </View>
      </Modal>

      <View style={styles.additionalDetailsContainer}>
        <Text> insert reminders here </Text>
      </View>

    </SafeAreaView>
  );
};

// settings
export const SettingsScreen = () => (
  <View>
    <Text>Settings Screen</Text>
  </View>
);

// profile screen
export const ProfileScreen = () => (
  <View>
    <Text>Profile Screen</Text>
  </View>
);

// colours
const colors = {
  background: '#f8f8f8', //light grey
  tab: '#ff6347', //orange
  accent: '#000000', //black
  primary: '#ffffff' //white
};

export const Stack = createNativeStackNavigator();

export const Tab = createBottomTabNavigator();

// tab navigation
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

Notifications.setNotificationHandler({ //sets up how notifications will be handled when receieved
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});