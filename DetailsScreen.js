/*
import React from 'react';
import { View, Text, Button } from 'react-native';
import styles from './styles';

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
          {/* Add table component here }
        </View>
  
        <View style={styles.additionalDetailsContainer}>
          <Text> insert reminders here </Text>
        </View>
  
      </SafeAreaView>
    );
  };

  export default DetailsScreen;

  */