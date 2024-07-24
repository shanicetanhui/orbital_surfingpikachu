import React, { useState, useEffect, useRef, useContext } from 'react';
import { UserContext, UserProvider} from "./UserContext";
import { AntDesign } from '@expo/vector-icons';
import { createNativeStackNavigator, DarkTheme } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { init, fakedata, display, update_habit, delete_habit_entry, add_entry, update_entry, date_display_format, read_habits, add_habit, fetch_entries_habit, today_date, create_or_update, delete_habit, add_user, fetch_user_settings } from './db';
import { StyleSheet, StatusBar, SafeAreaView, SectionList, View, Text, Button, TextInput, Modal, TouchableOpacity, Dimensions, Switch, Alert, Image, Pressable, ScrollView, ImageBackground, useColorScheme } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LineChart, BarChart, PieChart, ProgressChart, ContributionGraph, StackedBarChart } from "react-native-chart-kit";
import { Picker } from '@react-native-picker/picker';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { Timestamp } from 'firebase/firestore';
import * as Notifications from 'expo-notifications';
import * as ImagePicker from 'expo-image-picker';
import { EventRegister } from 'react-native-event-listeners'
import theme from './theme/theme';
import themeContext from './theme/themeContext';

// stylesheet
const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  // text: {
  //   fontFamily: 'Kollektif',
  // },
  item: {
    padding: 20,
    marginVertical: 8,
    borderRadius: 20,
    marginHorizontal: 16,
  },
  headerContainer: {
    padding: 20,
    marginBottom: 8,
    borderRadius: 20,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 24,
    // fontFamily: 'Kollektif',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    // fontFamily: 'Kollektif',
  },
  headerSubtitle: {
    fontSize: 16,
    marginTop: 8,
    color: 'gray',
    // fontFamily: 'Kollektif',
  },
  detailsContainer: {
    marginTop: 10,
  },
  detailsScreenContainer: {
    padding: 4,
    margin: 10,
    //backgroundColor: 'rgba(211, 211, 211, 0.2)', //lightgrey
    borderRadius: 10,
  },
  detail: {
    padding: 2,
    justifyContent: 'center',
    fontSize: 16,
    color: 'gray',
    // fontFamily: 'Kollektif',
  },
  additionalDetailsContainer: {
    padding: 10,
  },
  additionalDetailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    // fontFamily: 'Kollektif',
  },
  buttonContainer: {
  //  backgroundColor: theme.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    width: '95%',
    marginVertical: 10,
    paddingHorizontal: 10,
    alignSelf: 'center', // Aligns the TextInput itself to the center horizontally
    fontFamily: 'Roboto', // Ensure consistent font family
    //backgroundColor: theme.translucent, //translucent
  },
  modalView: {
    width: '80%',
    //backgroundColor: theme.background,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center', // Center vertically and horizontally
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonModalView: {
    width: '80%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'absolute', 
    top: '20%', 
    left: '10%', 
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    // fontFamily: 'Kollektif',
   // color: theme.color,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: 5,
  },
  buttonText: {
   // color: theme.color,
    textAlign: 'center',
    // fontFamily: 'Kollektif',
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
    // fontFamily: 'Kollektif',
   // color: theme.color,
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
   // color: theme.color, // Set color of the "+" sign
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
   // borderColor: theme.color,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
   // borderColor: theme.color,
  },
  cell: {
    flex: 1,
    padding: 10,
    textAlign: 'center'
  },
  editButton: {
    position: 'absolute',
    right: 1,
    top: -20,
    padding: 5,
  },
  deleteButton: {
    position: 'absolute',
    right: 1,
    top: -50,
    padding: 5,
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    // fontFamily: 'Kollektif',
   // color: theme.color,
  },
  gotoDetailsText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'blue',
    // fontFamily: 'Kollektif',
   // color: theme.color,
  },
  notAvailText: {
    fontSize: 8,
    color: 'grey',
    textAlign: 'center',
    textAlignVertical: 'center',
    // fontFamily: 'Kollektif',
  },
  profileImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    top: 7,
    postiion: 'absolute',
  },
  imagebutton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
  //  backgroundColor: theme.color,
  },
  usernameContainer: {
    padding: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  // PICKERSTYLES 
  picker: { // picker for colors
    height: 40,
    width: '100%',
    marginVertical: 10,
    alignSelf: 'center',
    fontFamily: 'Roboto',
    color: 'grey',
    alignItems: 'center',
    borderColor: 'grey',
    borderWidth: 1, 
    borderRadius: 5,
    alignSelf: 'center',
  },
  picker2: { // picker for school
    height: 40,
    width: '95%',
    marginVertical: 10,
    alignSelf: 'center',
    // fontFamily: 'Roboto',
    color: 'grey',
    alignItems: 'center',
    borderColor: 'grey',
    borderWidth: 1, 
    borderRadius: 5,
    alignSelf: 'center',
  },
  pickerContainer: {
    width: '95%',
    alignSelf: 'center',
    marginVertical: 10,
  },
  pickerItem: {
    // fontFamily: 'Roboto', 
    fontSize: 12, 
   // color: theme.color,
  },
  bubble: {
    padding: 20,
    justifyContent: 'center',
    fontSize: 16,
    backgroundColor: 'rgba(252, 223, 202, 0.7)',
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 8,

  },
});

// front end purposes
const initialData = [
  {
    title: 'Habits',
    subtitle: 'Small habits, big changes',
    data: []
  }
];

// read fake data (for now) into front-end initialData
async function read_initialData(setData, uid) {
  const rows = await read_habits(uid);
  const newData = [...initialData];
  rows.forEach((row) => {
    newData[0].data.push(
      { title: row.display_name, details: [row.description], goal: row.goal, color: row.color }
    )
  });
  console.log("read initial data");
  console.log(newData);
  setData(newData);
}

// colour picker for habit
// TODO: preview colours?
const ColorPicker = ({ selectedColor, onColorChange }) => {
  const colors = [
    { label: 'Light Orange', value: 'rgba(252, 223, 202, 0.7)' },
    { label: 'Light Green', value: 'rgba(144, 238, 144, 0.7)' },
    { label: 'Pink', value: 'rgba(255, 192, 203, 0.7)' },
    { label: 'Light Blue', value: 'rgba(175, 238, 238, 0.7)' },
    { label: 'Peach', value: 'rgba(255, 218, 185, 0.7)' },
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
    <View style={[styles.pickerContainer, {backgroundColor:theme.background}]}>
      <Picker
        style={[styles.picker, {backgroundColor:theme.background}]}
        selectedValue={selectedColor}
        onValueChange={(itemValue, itemIndex) => onColorChange(itemValue)}
      >
        <Picker.Item label="Choose colour" value="" />
        {colors.map((color, index) => (
          <Picker.Item key={index} label={color.label} value={color.value} />
        ))}
      </Picker>
    </View>
  );
};

export const Test = () => {
  return (
    <Text>HELLO</Text>
  )
}

const login = (auth, email, password, setLoggedInUser) => {
  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      const user = userCredential.user;
      setLoggedInUser(user);
    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
    });
};

export const LoginScreen = ({ setIsSignup, setLoggedInUser, auth }) => {
  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = () => {
    login(auth, email, password, setLoggedInUser);
  };

  return (
    <View style={styles.container}>
      <Text>Email</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeEmail}
        value={email}
      />
      <Text>Password</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangePassword}
        value={password}
        secureTextEntry={true}
      />
      <Button title="Log in" onPress={handleLogin} />
      {errorMessage ? <Text>{errorMessage}</Text> : null}
      <Button title="Go to sign up page" onPress={() => setIsSignup(true)} />
    </View>
  );
};

const signup = (auth, email, password, setLoggedInUser) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      const user = userCredential.user;
      setLoggedInUser(user);
      // console.log(user.uid);
      add_user(user.uid);
    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
    });
};

export const SignupScreen = ({ setIsSignup, setLoggedInUser, auth }) => {
  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignup = () => {
    signup(auth, email, password, setLoggedInUser);
  };

  return (
    <View style={styles.container}>
      <Text>Email</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeEmail}
        value={email}
      />
      <Text>Password</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangePassword}
        value={password}
        secureTextEntry={true}
      />
      <Button title="Sign Up" onPress={handleSignup} />
      {errorMessage ? <Text>{errorMessage}</Text> : null}
      <Button title="go to log in page" onPress={() => setIsSignup(false)} />
    </View>
  );
};

// home screen
export const HomeScreen = ({ navigation }) => {
  // const { uid } = route.params || {};
  const { loggedInUser } = useContext(UserContext);
  const uid = loggedInUser.uid;
  
  console.log("home screen");
  console.log(loggedInUser);
  // console.log(navigation);
  // console.log(route);

  const theme = useContext(themeContext);
  const [darkMode, setDarkMode] = useState(false);

  // Hooks for variables
  const [refresh, setRefresh] = useState(false);
  const [data, setData] = useState(initialData);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [editedData, setEditedData] = useState({
    title: '',
    old_title: '',
    details: [],
    goal: '',
    color: ''
  });
  const [newItemName, setNewItemName] = useState('');
  const [dailyGoal, setDailyGoal] = useState('');
  const [currentSection, setCurrentSection] = useState('');
  const [selectedColor, setSelectedColor] = useState('rgba(252, 223, 202, 0.7)');

  useEffect(() => {
    read_initialData(setData, uid);
    // console.log("UID");
    // console.log(uid);
  }, [refresh]);

  // modal -> popups like in 'add new habit/section'
  const openModal = (sectionTitle) => {
    setCurrentSection(sectionTitle);
    setAddModalVisible(true);
  };

  const addNewItem = () => {
    if (newItemName.trim() !== '' && dailyGoal.trim() !== '') {
      const newItem = { title: newItemName, color: selectedColor, details: [`Daily goal: ${dailyGoal}`], goal: dailyGoal };
      console.log("adding new item")
      add_habit(newItem.title, newItem.color, newItem.goal, uid);
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

  const handleDelete = () => { //delete habits
    if (itemToDelete) {
      const updatedData = data.map(section => ({
        ...section,
        data: section.data.filter(item => item.title !== itemToDelete.title),
      }));
      setData(updatedData);
      console.log("calling delete_habit");
      delete_habit(itemToDelete.title, uid);
      setDeleteModalVisible(false);
      setItemToDelete(null);
    }
  };

  const handleEdit = async () => {
    await update_habit(editedData.old_title, editedData.title, editedData.goal, editedData.color, uid);
    const rows = await read_habits(uid);
    const newData = [
      {
        title: 'Habits',
        subtitle: 'Small habits, big changes',
        data: []
      }
    ];
    rows.forEach((row) => {
      newData[0].data.push(
        { title: row.display_name, details: [row.description], goal: row.goal, color: row.color }
      )
    });
    console.log("read initial data");
    console.log(newData);
    setData(newData);
    setEditModalVisible(false);
  }

  const openEditModal = (item) => {
    setEditedData({
      title: item.title,
      old_title: item.title,
      // details: [...item.details],
      goal: item.goal,
      color: item.color
    });
    setEditModalVisible(true);
  }

  return (
    <SafeAreaView style={styles.fullscreen}>
       <ImageBackground source={theme.backgroundImage} style={styles.imageBackground}>
        <SectionList
          sections={data}
          keyExtractor={(item, index) => item.title + index}
          renderItem={({ item }) => (
            <View style={[styles.item, { backgroundColor: item.color }]}>
              <Text style={[styles.title, { color:theme.color}]}>{item.title}</Text>
              {item.details && (
                <View style={styles.detailsContainer}>
                  {item.details.map((detail, index) => (
                    <Text key={index} style={[styles.detail, { color:theme.color}]}>{detail}</Text>
                  ))}
                  <TouchableOpacity
                    onPress={() => {
                      setItemToDelete(item);
                      setDeleteModalVisible(true);
                    }}
                    style={styles.deleteButton}
                  >
                    <Text style={[styles.deleteButtonText, { color:theme.color}]}> Delete </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => openEditModal(item)}
                    style={styles.editButton}
                  >
                    <Text style={[styles.deleteButtonText, { color:theme.color}]}> Edit </Text>
                  </TouchableOpacity>
                </View>
              )}
              <TouchableOpacity
                style={[styles.gotoDetailsButton, { color:theme.color}]}
                onPress={() => navigation.navigate('Details', { item, additionalDetails: 'Some additional details here' })}
              >
                <Text style={[styles.gotoDetailsText, { color:theme.color}]}>Go to {item.title} details</Text>
              </TouchableOpacity>
            </View>
          )}
          renderSectionHeader={({ section }) => (
            <View style={[styles.headerContainer, { backgroundColor: section.color }]}>
              <Text style={[styles.headerTitle, { color:theme.color}]}>{section.title}</Text>
              {section.subtitle && <Text style={[styles.headerSubtitle]}>{section.subtitle}</Text>}
            </View>
          )}
          renderSectionFooter={({ section: { title } }) => (
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => openModal(title)} style={styles.addButton}>
                <Text style={[styles.addButtonIcon, { color:theme.color}]}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={addModalVisible}
          onRequestClose={() => setAddModalVisible(!addModalVisible)}
        >
          <View style={[styles.addButtonModalView, {backgroundColor: theme.background}]}>
            <Text style={[styles.modalText, { color:theme.color}]}>Enter new {currentSection.toLowerCase()} name</Text>
            <TextInput
              style={[styles.input]}
              placeholderTextColor={'grey'}
              placeholder={`Enter new ${currentSection.toLowerCase()} name`}
              value={newItemName}
              onChangeText={text => setNewItemName(text)}
            />
            <Text style={[styles.modalText, { color:theme.color}]}>What is your daily goal?</Text>
            <TextInput
              style={[styles.input]}
              placeholderTextColor={'grey'}
              placeholder="Enter daily goal"
              value={dailyGoal}
              keyboardType="numeric"
              onChangeText={text => setDailyGoal(text)}
            />
            <Text style={[styles.modalText, { color:theme.color}]}>Select item color:</Text>
            <ColorPicker
              selectedColor={selectedColor}
              onColorChange={(color) => setSelectedColor(color)}
            />
            <TouchableOpacity style={styles.button} onPress={addNewItem}>
              <Text style={[styles.buttonText, { color:theme.color}]}>Add Item</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setAddModalVisible(!addModalVisible)}
            >
              <Text style={[styles.buttonText, { color:theme.color}]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal
          transparent={true}
          animationType="slide"
          visible={deleteModalVisible}
          onRequestClose={() => setDeleteModalVisible(false)}
        >
          <View style={[styles.modalContainer]}>
            <View style={[styles.modalView, {backgroundColor: theme.background}]}>
              <Text style={{ color:theme.color}}>Are you sure you want to delete this item?</Text>
              <View style={styles.modalButtons}>
                <Button title="Cancel" onPress={() => setDeleteModalVisible(false)} />
                <Button title="Delete" onPress={handleDelete} />
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          transparent={true}
          animationType="slide"
          visible={editModalVisible}
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalView, {backgroundColor: theme.background}]}>
              <Text style={{color:theme.color}}>EDIT</Text>
              <TextInput
                style={[styles.input, {color: theme.color}]}
                placeholder="Name"
                value={editedData.title}
                placeholderTextColor={'grey'}
                onChangeText={(text) => setEditedData({ ...editedData, title: text })}
              />
              <TextInput
                style={[styles.input, {color:theme.color}]}
                placeholder="Goal"
                value={editedData.goal.toString()}
                placeholderTextColor={'grey'}
                onChangeText={(text) => setEditedData({ ...editedData, goal: parseInt(text) })}
              />
              <View style={styles.modalButtons}>
                <Button title="Cancel" onPress={() => setEditModalVisible(false)} />
                <Button title="Confirm edit" onPress={handleEdit} />
              </View>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
};


// details screen
export const DetailsScreen = ({ route }) => {
  const theme = useContext(themeContext)
  const [darkMode, setDarkMode] = useState(false)

  const { item, additionalDetails } = route.params;
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);
  const uid = loggedInUser.uid;

  // Hooks for habitData and counter
  const [habitData, setHabitData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editedData, setEditedData] = useState({
    day: '',
    year: '',
    month: '',
    num: '',
    old_date: '',
    habit_id: ''
  });
  const [addedData, setAddedData] = useState({
    day: '',
    month: '',
    year: '',
    num: '',
  })
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

  // Function to open modal and set the initial values
  const openEditModal = (data) => {
    setEditedData({
      // day: data.day.toString(),
      year: data.day.getFullYear(),
      month: data.day.getMonth(),
      day: data.day.getDate(),
      num: data.num,
      old_date: data.day,
      habit_id: data.habit
    });
    console.log(editedData);
    setEditModalVisible(true);
    setRefresh(prev => !prev);  // Toggle the refresh state
  };

  const openAddModal = () => {
    setAddModalVisible(true);
  };

  const handleAddSubmit = async () => {
    new_date = new Date(addedData.year, addedData.month, addedData.day);
    console.log(new_date);
    add_entry(item.title, new_date, addedData.num, uid);
    setAddModalVisible(false);
    setRefresh(prev => !prev);  // Toggle the refresh state
  }

  // Function to handle submission of edited data
  const handleEditSubmit = () => {
    // Handle the submission logic here
    const new_date = new Date(editedData.year, editedData.month, editedData.day);
    update_entry(editedData.habit_id, editedData.old_date, new_date, editedData.num, uid)
    setEditModalVisible(false);
  };

  const handleDataDelete = async (entry) => {
    delete_habit_entry(entry.habit, entry.day, uid);
    console.log("deleted");
    setRefresh(prev => !prev);  // Toggle the refresh state

  }

  // DATA VISUALISATION

  const screenWidth = Dimensions.get("window").width - 2 * styles.additionalDetailsContainer.padding;
  // console.log(styles.additionalDetailsContainer.padding);
  // console.log(screenWidth);

  const getChartConfig = (theme) => ({
    backgroundColor: theme.background,
    backgroundGradientFrom: theme.background,
    backgroundGradientTo: theme.background,
    decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 1) => theme.color,
    labelColor: (opacity = 1) => theme.color,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: 3,
      strokeWidth: 6,
      stroke: "#ffa726"
    },

  });

  const updateLinechartdata = (data) => {
    console.log("update linechart");
    const newLinechartdata = {
      labels: data.map(entry => date_display_format(entry.day)), //think of somehting beter
      datasets: [
        {
          data: data.map(entry => entry.num),
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
      const data = await fetch_entries_habit(item.title, uid);
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
      if (!entry) {
        await add_entry(item.title, day, 0, uid);
        setRefresh(prev => !prev);  // Toggle the refresh state
      } else {
        setCounter(entry.num);
      }
      // console.log(counter);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  // calls fetchHabits on load
  useEffect(() => {
    fetchHabits();
  }, [refresh]);

  useEffect(() => {
    // habitDataRef.current = habitData;
    updateLinechartdata(habitData);
  }, [habitData]);

  // REMINDERS

  const [hours, setHours] = useState(''); // State for hours
  const [minutes, setMinutes] = useState(''); // State for minutes
  const [repeats, setRepeats] = useState(false); // State for repeats

  //Request notification permissions
  useEffect(() => {
    (async () => {

      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default Channel',
        importance: Notifications.AndroidImportance.MAX,
        sound: 'default',
        description: 'Default notification channel',
      });

      const { status } = await Notifications.getPermissionsAsync();
      console.log('Notification permissions status:', status);
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          return;
        }
      }
    })();
  }, []);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  // Function to schedule timed notifications
  const scheduleNotification = async () => {
    const hour = parseInt(hours);
    const minute = parseInt(minutes);

    // Validate hour and minute inputs
    if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      Alert.alert('Invalid Time', 'Please enter valid hours (0-23) and minutes (0-59).');
      return;
    }

    const trigger = {
      hour: hour,
      minute: minute,
      repeats: repeats,
    };

    try {
      // Schedule the notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Reminder',
          body: 'Time to do the task!',
        },
        trigger: trigger,
      });
      // Notify user upon successful scheduling
      alert('Notification scheduled!');
    } catch (error) {
      // Handle any errors that occur during scheduling
      console.error('Error scheduling notification:', error);
      alert('Failed to schedule notification. Please try again.');
    }
  };

  // for counters
  const incrementCounter = async () => {
    const newCounter = counter + 1;
    setCounter(newCounter);
    await create_or_update(item.title, day, newCounter, uid);
    setRefresh(prev => !prev);  // Toggle the refresh state
  };

  const decrementCounter = async () => {
    const newCounter = counter - 1;
    if (newCounter < 0) {
      alert('Cannot go below 0!');
    }
    else {
      setCounter(newCounter);
      await create_or_update(item.title, day, newCounter, uid);
      setRefresh(prev => !prev);  // Toggle the refresh state
    }
  };

  if (!item) {
    return null;
  }

  return (
    <SafeAreaView style={styles.fullscreen}>
      <ScrollView>
      <ImageBackground source={theme.backgroundImage} style={styles.imageBackground}>
          {/* text */}
          <View style={styles.detailsScreenContainer}>
            <View style={styles.additionalDetailsContainer}>
              <Text style={[styles.additionalDetailsTitle, { color:theme.color}]}>{item.title}</Text>
              {item.details && item.details.map((detail, index) => (
                <Text key={index} style={styles.detail}> {detail}</Text>
              ))}
            </View>
          </View>

          {/* today's data */}
          <View style={styles.detailsScreenContainer}>
            <View style={styles.additionalDetailsContainer}>
              <Text style={[styles.additionalDetailsTitle, { color:theme.color}]}>Today's number:</Text>
            </View>
            {/* counter */}
            <View style={styles.counterContainer}>
              <Button title="-" onPress={decrementCounter} />
              <Text style={[styles.counterText, { color:theme.color}]}>{counter}</Text>
              <Button title="+" onPress={incrementCounter} />
            </View>
          </View>

          {/* reminders! */}
          <View style={styles.detailsScreenContainer}>
            <View style={styles.additionalDetailsContainer}>
              <Text style={[styles.additionalDetailsTitle, { color:theme.color}]}>Schedule Reminders:</Text>
              <Text style={[styles.detail, { color:theme.color}]}> Input in military time</Text>
            </View>

            <View style={styles.additionalDetailsContainer}>
              <Text style={[styles.detail, { color:theme.color}]}>Hour:</Text>
              <View style={[styles.inputContainer, { backgroundColor: theme.background}]}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={hours}
                  onChangeText={setHours}
                />
              </View>
              <Text style={[styles.detail, { color:theme.color}]}>Minutes:</Text>
              <View style={[styles.inputContainer, { backgroundColor: theme.background}]}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={minutes}
                  onChangeText={setMinutes}
                />
              </View>
              <View style={styles.switchContainer}>
                <Text style={[styles.detail, { color:theme.color}]}>Repeats:</Text>
                <View style={styles.inputContainer}>
                  <Switch
                    value={repeats}
                    onValueChange={setRepeats}
                  />
                </View>
              </View>
              <Button title="Schedule Notification" onPress={scheduleNotification} />
            </View>
          </View>

          {/* data vis! */}
          <View style={[styles.detailsScreenContainer, {backgroundColor: theme.background}]}>
            <View style={[styles.tableContainer, {backgroundColor: theme.background}]}>
              <Text style={[styles.additionalDetailsTitle, { color:theme.color}]}>Your data in the past days:</Text>
            </View>

            {(linechartdata.datasets[0].data.length < 2) &&
              <View>
                <Text style={[styles.notAvailText, { color:theme.color}]}>Not enough data to make graph :( </Text>
                <Text style={[styles.notAvailText, { color:theme.color}]}>Add some! </Text>
              </View>
            }

            {(linechartdata.datasets[0].data.length > 1) &&
              <>
                <View style={[styles.additionalDetailsContainer, {backgroundColor: theme.background}]}>
                  <LineChart
                    data={linechartdata}
                    width={screenWidth * 0.9} //90% screen width
                    height={220}
                    chartConfig={getChartConfig(theme)}
                    formatYLabel={(yValue) => { return Math.round(yValue).toString(); }}
                    onDataPointClick={(value, dataset, getColor) => { }}
                    fromZero={true}
                    backgroundColor={theme.background}
                  />
                </View>

              </>
            }

          <View style={styles.additionalDetailsContainer}>
          <Button 
            style={{ backgroundColor: theme.color }} 
            onPress={openAddModal}
            title='Add Data'
            >
          </Button>
          </View>

          {habitData.map((entry) => {
            // { habitDataRef.current.map((entry) => {
            return (
              <View style={[styles.item, {color:theme.color}]}>
                <Text style={{color: theme.color}}>
                  {date_display_format(entry.day)} - {entry.num} -
                  <Button title="edit" onPress={() => openEditModal(entry)} />
                  <Button title="delete" onPress={() => handleDataDelete(entry)} />
                </Text>
              </View>
            )
          })
          }
          </View>

          <Modal
            transparent={true}
            animationType="slide"
            visible={editModalVisible}
            onRequestClose={() => setEditModalVisible(false)}
          >
    <View style={[styles.addButtonModalView, {backgroundColor: theme.background}]}>
              <Text style={[styles.modalText, { color:theme.color}]}>Edit data</Text>

              <TextInput
                style={[styles.input, {color:theme.color}]}
                placeholder="Year"
                value={editedData.year.toString()}
                onChangeText={(text) => {
                  const year = parseInt(text);
                  setEditedData({ ...editedData, year: isNaN(year) ? '' : year });
                }}
              />
              <TextInput
                style={[styles.input, {color:theme.color}]}
                placeholder="Month"
                value={(editedData.month + 1).toString()}
                onChangeText={(text) => {
                  const month = parseInt(text) - 1;
                  setEditedData({ ...editedData, month: isNaN(month) ? '' : month });
                }}
              />
              <TextInput
                style={[styles.input, {color:theme.color}]}
                placeholder="Day"
                value={editedData.day.toString()}
                onChangeText={(text) => {
                  const day = parseInt(text);
                  setEditedData({ ...editedData, day: isNaN(day) ? '' : day });
                }}
              />
              <TextInput
                style={[styles.input, {color:theme.color}]}
                placeholder="num"
                value={editedData.num.toString()}
                onChangeText={(text) => {
                  const num = parseInt(text);
                  setEditedData({ ...editedData, num: isNaN(num) ? '' : num });
                }}
              />

              <TouchableOpacity style={styles.button} onPress={handleEditSubmit}>
                <Text style={[styles.buttonText, { color:theme.color}]}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={[styles.buttonText, { color:theme.color}]}>Cancel</Text>
              </TouchableOpacity>

              {/* <Button style={styles.buttonText} title="Submit" onPress={() => handleEditSubmit} />
          <Button style={styles.buttonText} title="Cancel" onPress={() => setEditModalVisible(false)} /> */}
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={addModalVisible}
            onRequestClose={() => {
              setAddModalVisible(!addModalVisible);
            }}
          >
    <View style={[styles.addButtonModalView, {backgroundColor: theme.background}]}>
              <Text style={[styles.modalText, { color:theme.color}]}>Add data</Text>

              <TextInput
                style={[styles.input, {color:theme.color}]}
                placeholder="Year"
                placeholderTextColor={theme.color}
                // value={editedData.year.toString()}
                onChangeText={(text) => {
                  const year = parseInt(text);
                  setAddedData({ ...addedData, year: isNaN(year) ? '' : year });
                }}
              />
              <TextInput
                style={[styles.input, {color:theme.color}]}
                placeholder="Month"
                placeholderTextColor={theme.color}
                // value={(editedData.month + 1).toString()}
                onChangeText={(text) => {
                  const month = parseInt(text) - 1;
                  setAddedData({ ...addedData, month: isNaN(month) ? '' : month });
                }}
              />
              <TextInput
                style={[styles.input, {color:theme.color}]}
                placeholder="Day"
                placeholderTextColor={theme.color}
                // value={editedData.day.toString()}
                onChangeText={(text) => {
                  const day = parseInt(text);
                  setAddedData({ ...addedData, day: isNaN(day) ? '' : day });
                }}
              />
              <TextInput
                style={[styles.input, {color:theme.color}]}
                placeholder="Num"
                placeholderTextColor={theme.color}
                // value={editedData.num.toString()}
                onChangeText={(text) => {
                  const num = parseInt(text);
                  setAddedData({ ...addedData, num: isNaN(num) ? '' : num });
                }}
              />

              {/* <TouchableOpacity style={styles.button} onPress={() => {handleAddSubmit}}> */}
              <TouchableOpacity style={styles.button} onPress={handleAddSubmit}>
                <Text style={[styles.buttonText, { color:theme.color}]}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setAddModalVisible(false)}
              >
                <Text style={[styles.buttonText, { color:theme.color}]}>Cancel</Text>
              </TouchableOpacity>

              {/* <Button style={styles.buttonText} title="Submit" onPress={() => handleEditSubmit} />
          <Button style={styles.buttonText} title="Cancel" onPress={() => setEditModalVisible(false)} /> */}
            </View>
          </Modal>

        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
  );
};

// // blank screen
// export const BlankScreen = () => {
//   const theme = useContext(themeContext)
//   const [darkMode, setDarkMode] = useState(false)

//   return (
//     <SafeAreaView style={styles.fullscreen}>
// <ImageBackground source={theme.backgroundImage} style={styles.imageBackground}>
//         <Text style={[styles.text, { color:theme.color}]}>Blank Screen</Text>
//       </ImageBackground>
//     </SafeAreaView>
//   );
// };

// locations screen
export const LocationsScreen = () => {
  const theme = useContext(themeContext);
  const InputRef = useRef(null);
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    // Handle the submission logic here
    console.log('Submitted:', input);
    // Reset input field after submission
    setInput('');
  };

  return (
    <SafeAreaView style={styles.fullscreen}>
      <ImageBackground source={theme.backgroundImage} style={styles.imageBackground}>
        <View style={styles.usernameContainer}>
          <Text style={[styles.title, { color: theme.color }]}>Fruit Stall Locations</Text>
          
          <View style={styles.bubble}>
            <Text style={[styles.title, { color: theme.color }]}>UTown:</Text>
            <View style={styles.detailsContainer}>
              <Text style={[styles.text, { color: theme.color }]}>
                Fine Food Canteen, Flavours@Utown, Fairprice Xpress NUS, Octobox
              </Text>
            </View>
          </View>
          
          <View style={styles.bubble}>
            <Text style={[styles.title, { color: theme.color }]}>Engineering:</Text>
            <View style={styles.detailsContainer}>
              <Text style={[styles.text, { color: theme.color }]}>
                WuYang Canteen@E2, Techno Edge Canteen, Arise and Shine
              </Text>
            </View>
          </View>

          <View style={styles.bubble}>
            <Text style={[styles.title, { color: theme.color }]}>YIH:</Text>
            <View style={styles.detailsContainer}>
              <Text style={[styles.text, { color: theme.color }]}>
                temporarily closed
              </Text>
            </View>
          </View>

          <View style={styles.bubble}>
            <Text style={[styles.title, { color: theme.color }]}>Computing:</Text>
            <View style={styles.detailsContainer}>
              <Text style={[styles.text, { color: theme.color }]}>
                Terrace, Cool Spot
              </Text>
            </View>
          </View>

          <View style={styles.bubble}>
            <Text style={[styles.title, { color: theme.color }]}>FASS:</Text>
            <View style={styles.detailsContainer}>
              <Text style={[styles.text, { color: theme.color }]}>
                The Deck
              </Text>
            </View>
          </View>

          <View style={styles.bubble}>
            <Text style={[styles.title, { color: theme.color }]}>Science:</Text>
            <View style={styles.detailsContainer}>
              <Text style={[styles.text, { color: theme.color }]}>
                Frontier
              </Text>
            </View>
          </View>

          <View style={styles.bubble}>
            <Text style={[styles.title, { color: theme.color }]}>Kent Ridge:</Text>
            <View style={styles.detailsContainer}>
              <Text style={[styles.text, { color: theme.color }]}>
                SF Farm Mart, FairPrice NUH
              </Text>
            </View>
          </View>

          <View style={styles.bubble}>
            <Text style={[styles.title, { color: theme.color }]}>PGP:</Text>
            <View style={styles.detailsContainer}>
              <Text style={[styles.text, { color: theme.color }]}>
                PGPR Food Court
              </Text>
            </View>
          </View>

          <TextInput
            ref={InputRef}
            style={styles.input}
            value={input}
            placeholder='Add fruit stall locations here!'
            placeholderTextColor='grey'
            onChangeText={setInput}
          />
          <Pressable style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

// settings screen
export const SettingsScreen = () => {

  const { loggedInUser, setLoggedInUser } = useContext(UserContext);
  const uid = loggedInUser.uid;
  
  useEffect(()  => {
    console.log("SETTINGS");
    fetch_user_settings(uid);
  }, [])

  const theme = useContext(themeContext)
  const [darkMode, setDarkMode] = useState(false)

  // PROFILE IMAGE
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1,1],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // USERNAME
  const usernameInputRef = useRef(null);
  const [username, setUsername] = useState('');

  // AGE
  const ageInputRef = useRef(null);
  const [age, setAge] = useState('');

  // SCHOOL
  const [school, setSchool] = useState('');

  // MOTIVATIONALMESSAGE
  const msgInputRef = useRef(null);
  const [msg, setMsg] = useState('');

  // DARKMODE   
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  // FEEDBACK
  const feedbackInputRef = useRef(null);
  const [feedback, setFeedback] = useState('');

  return (
    <SafeAreaView style={styles.fullscreen}>
       <ImageBackground source={theme.backgroundImage} style={styles.imageBackground}>
        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          {image && <Image source={{ uri: image }} style={styles.image} />}
          <Pressable style={styles.imagebutton} onPress={pickImage}>
            <Text style={[styles.buttonText, {color:theme.color}]}>Change your Profile Picture</Text>
          </Pressable>
        </View>

        {/* Username */}
        <View style={styles.usernameContainer}>
          <Pressable onPress={() => usernameInputRef?.current?.focus()}>
          <Text style={{ color: theme.color }}> Username:</Text>
            <TextInput
              ref={usernameInputRef}
              style={styles.input}
              onChangeText={(event) => setUsername(event)}
              value={username}
              placeholder='Edit your username here'
              placeholderTextColor='grey'
            />
          </Pressable>
        </View>

        {/* Age */}
        <View style={styles.usernameContainer}>
          <Pressable onPress={() => ageInputRef?.current?.focus()}>
          <Text style={{ color: theme.color }}> Age:</Text>
            <TextInput
              ref={ageInputRef}
              style={styles.input}
              onChangeText={(event) => setAge(event)}
              value={age}
              keyboardType={'numeric'}
              placeholder='Edit your age here'
              placeholderTextColor='grey'
            />
          </Pressable>
        </View>

        {/* School Picker */}
        <View style={styles.usernameContainer}>
        <Text style={{ color: theme.color }}> School:</Text>
          <Picker
            selectedValue={school}
            onValueChange={(itemValue) => setSchool(itemValue)}
            style={[styles.picker2, { borderColor: 'grey', borderWidth: 1 }, {backgroundColor:theme.background}]}
          >
            <Picker.Item label="Select your school" value="" style={[styles.pickerItem, {backgroundColor:theme.background}]} />
            <Picker.Item label="School 1" value="school1" style={[styles.pickerItem, {backgroundColor:theme.background}]} />
            <Picker.Item label="School 2" value="school2" style={[styles.pickerItem, {backgroundColor:theme.background}]} />
            <Picker.Item label="School 3" value="school3" style={[styles.pickerItem, {backgroundColor:theme.background}]} />
          </Picker>
        </View>

        {/* Motivational Message */}
        <View style={styles.usernameContainer}>
          <Pressable onPress={() => msgInputRef?.current?.focus()}>
          <Text style={{ color: theme.color }}> Add a motivational message for your future self:</Text>
            <TextInput
              ref={msgInputRef}
              style={styles.input}
              onChangeText={(event) => setMsg(event)}
              value={msg}
              placeholder='Consistency breeds success.'
              placeholderTextColor='grey'
            />
          </Pressable>
        </View>

        {/* Dark Mode */}
        <View style={styles.switchContainer}>
        <Text style={{ color: theme.color }}> Dark Mode</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={darkMode ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            value={darkMode}
            onValueChange={(value) => { 
              setDarkMode(value);
              EventRegister.emit('ChangeTheme', value)
            }}
          />
        </View>

        {/* Send Feedback (need backend to 'send' feedback to admins) */}
        <View style={styles.usernameContainer}>
          <Pressable onPress={() => feedbackInputRef?.current?.focus()}>
          <Text style={{ color: theme.color }}> Report an issue:</Text>
            <TextInput
              ref={feedbackInputRef}
              style={styles.input}
              onChangeText={(event) => setFeedback(event)}
              value={feedback}
              placeholder='Bug'
              placeholderTextColor='grey'
            />
          </Pressable>
        </View>

        {/* Log out */}
        <Pressable style={styles.imagebutton} onPress={() => {
          setLoggedInUser(null)
          }}>
            <Text style={styles.buttonText}>Log out</Text>
          </Pressable>

        </ImageBackground>
      </SafeAreaView>
  );
};

// colours
const colors = {
  background: '#f8f8f8', //light grey
  tab: '#ff6347', //orange
  accent: '#ffffff', //black
  primary: '#000000' //white
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
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Locations"
        component={LocationsScreen}
        options={{
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="cloud" size={size} color={color} />
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