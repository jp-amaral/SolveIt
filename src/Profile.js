import React, { useState, useEffect, useRef } from 'react'
import { Alert, Text, SafeAreaView , FlatList, View} from 'react-native'
import {styles} from './ProfileStyles'
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TimeItem from './TimeItem';

const Item = ({record}) => (
    // <Text>Hello</Text>
    <TimeItem record={record} />
  );

const Profile = ({ navigation }) => {

    const [bestTimeString, setBestTimeString] = useState('No best time yet');
    const [existTimings, setExistTimings] = useState(false);
    const [timings, setTimings] = useState([]);
    const [reverseTimings, setReverseTimings] = useState([]);
    const flatListRef = useRef(null);

    const home = () => {
        navigation.navigate('Home')
    }

    const handleScroll = () => {
        // Simulate scrolling by scrolling to a small offset
        flatListRef.current?.scrollToOffset({ offset: 10 });
    };

    // To clear all timings
    const clearTimings = () => {
        Alert.alert(
        "Delete Timings",
        "Are you sure you want to delete all timings?",
        [
            {
            text: "Cancel",
            style: "cancel"
            },
            { 
            text: "OK", 
            onPress: async () => {
                try {
                    await AsyncStorage.removeItem('timings');
                    setTimings([]);
                    setBestTimeString('No best time yet');
                } catch (error) {
                // Error removing data
                console.log(error);
                }
            } 
            }
        ]
        );
    };
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

    // To get the best timing
    const getBestTiming = async () => {
        try {
        const timings = await retrieveTimings();
        //timings is a JSON object, loop through it to and add it to the reverseTimings array
        let reverseTimings = [];
        for (let i = timings.length - 1; i >= 0; i--) {
            reverseTimings.push(timings[i]);
        }
        setReverseTimings(reverseTimings);
    
        if (timings !== null) {
            // Find the timing with isBest set to true
            const bestTiming = timings.find(timing => timing.isBest === true);
    
            if (bestTiming) {
                const { minutes, seconds, milliseconds } = bestTiming.time;
                const bestTimeString = `${formatMinutes(minutes)}:${formatSeconds(seconds)}.${formatMillisecond(milliseconds)}`;
                setBestTimeString(bestTimeString);
                return bestTiming;
            } else {
            console.log("No best timing found.");
            return null;
            }
        } else {
            console.log("Error: Timings is null");
            return null;
        }
        } catch (error) {
        // Error retrieving data
        console.log(error);
        return null;
        }
    };

    //get the best timing
    useEffect(() => {
        getBestTiming();
        handleScroll();
    }, []);

    // To retrieve all timings
    const retrieveTimings = async () => {
        try {
        const timings = await AsyncStorage.getItem('timings');
        
        if (timings !== null) {
            setExistTimings(true);
            setTimings(JSON.parse(timings));
            return JSON.parse(timings);
        } else {
            console.log("Error: Timings is null");
            return null;
        }
        } catch (error) {
        // Error retrieving data
        console.log(error);
        return null;
        }
    };
        

    

    return (
        <SafeAreaView style={styles.container}>
            <Icon name="arrow-back-ios" size={30} style={styles.back_icon} onPress={() => {home()}}/>
            <Icon name="delete-outline" size={30} style={styles.delete_icon} onPress={() => {clearTimings()}}/>
            <Text style={styles.main_text}>Your best time</Text>
            <Text style={styles.time_text}>{bestTimeString}</Text>
            {existTimings && <Text style={styles.previous_text}>Previous times</Text>}
            <View style={styles.list}>
                <FlatList
                    contentContainerStyle={styles.flat_list}
                    ref={flatListRef}
                    data={reverseTimings}
                    renderItem={({item}) => <Item record={item} />}
                    keyExtractor={(item, index) => index.toString()}
                    >
                </FlatList>
            </View>
        </SafeAreaView>
    )
}

export default Profile