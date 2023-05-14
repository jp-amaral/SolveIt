import React , { useState } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native'
import { styles } from './TimeItemStyles'
import AsyncStorage from '@react-native-async-storage/async-storage';

const TimeItem = ({ record , timings, setReverseTimings, setExistTimings, setBestTimeString}) => {

  const [hide, setHide] = useState(false)

  function formatMinutes(value) {
      return value.toString();
  }

  function formatSeconds(value) {
      return value < 10 ? `0${value}` : value.toString();
  }

  function formatMillisecond(value) {
      if (typeof value === 'number') {
          return (value / 100).toFixed(0);
      }
      return "0";
  }

  // Function to compare two times
  const isTimeLower = (time1, time2) => {
    if (time1.minutes < time2.minutes) {
      return true;
    } else if (time1.minutes === time2.minutes) {
      if (time1.seconds < time2.seconds) {
        return true;
      } else if (time1.seconds === time2.seconds) {
        return time1.milliseconds < time2.milliseconds;
      }
    }
    return false;
  };

  function handleDelete() {
      console.log("Delete button pressed" + record.date + record.time.minutes + record.time.seconds + record.time.milliseconds);
      Alert.alert(
          "Delete Timing",
          "Are you sure you want to delete this record?",
          [ 
              {
                  text: "Cancel",
                  style: "cancel"
              },
              {
                  text: "OK",
                  onPress: async () => {
                    // setHide(true);
                    console.log("Delete button pressed" + record.date + record.time.minutes + record.time.seconds + record.time.milliseconds);
                    //delete the timing from the timings array
                    const newTimings = timings.filter(timing => timing !== record);

                    if (newTimings.length !== 0) {
                    //find the new best time (the lowest) by looping through the timings array and comparing the times
                      let newBestTime = newTimings[0].time;
                      for (let i = 1; i < newTimings.length; i++) {
                          if (isTimeLower(newTimings[i].time, newBestTime)) {
                              newBestTime = newTimings[i].time;
                          }
                      }
                      //set the isBest property of the new best time to true
                      for (let i = 0; i < newTimings.length; i++) {
                        if (newTimings[i].time === newBestTime) {
                            newTimings[i].isBest = true;
                            const { minutes, seconds, milliseconds } = newTimings[i].time;
                            const bestTimeString = `${formatMinutes(minutes)}:${formatSeconds(seconds)}.${formatMillisecond(milliseconds)}`;
                            setBestTimeString(bestTimeString);
                        }
                      }
                    }


                    setReverseTimings(newTimings);
                    //save the new timings array to the async storage
                    try {
                        const jsonValue = JSON.stringify(newTimings);
                        await AsyncStorage.setItem('timings', jsonValue);
                    }
                    catch (error) {
                        console.log(error);
                    }
                    //if there are no more timings, delete the timings key from async storage
                    if (newTimings.length === 0) {
                        setExistTimings(false);
                        try {
                            await AsyncStorage.removeItem('timings');
                        }
                        catch (error) {
                            console.log(error);
                        }
                    }
                  }
              }
          ]
      );
  }

  const bestTimeString = `${formatMinutes(record.time.minutes)}:${formatSeconds(record.time.seconds)}.${formatMillisecond(record.time.milliseconds)}`;

  return (
      !hide && <TouchableOpacity style={styles.container} onLongPress={handleDelete}>
        <Text style={record.isBest ? styles.best_date_text : styles.date_text}>{record.date}</Text>
        <Text style={record.isBest ? styles.best_time_text : styles.time_text}>{bestTimeString}</Text>
        <View style={styles.border}></View>
      </TouchableOpacity>
    )
  }
    
export default TimeItem
