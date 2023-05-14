import React from 'react'
import {
  View,
  Text,
  Image
} from 'react-native'
import { styles } from './TimeItemStyles'
import images from './images'

const TimeItem = ({ record }) => {

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

    const bestTimeString = `${formatMinutes(record.time.minutes)}:${formatSeconds(record.time.seconds)}.${formatMillisecond(record.time.milliseconds)}`;

    return (
        <View style={styles.container}>
          <Text style={record.isBest ? styles.best_date_text : styles.date_text}>{record.date}</Text>
          <Text style={record.isBest ? styles.best_time_text : styles.time_text}>{bestTimeString}</Text>
          <View style={styles.border}></View>
        </View>
      )
    }
    
export default TimeItem
