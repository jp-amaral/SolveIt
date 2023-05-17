import React, { useState, useEffect, useRef } from 'react'
import { Alert, Text, SafeAreaView , FlatList, View, Image, StatusBar, TouchableOpacity} from 'react-native'
import {styles} from './ProfileStyles'
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TimeItem from './TimeItem';
import {Audio} from 'expo-av';
import Modal from 'react-native-modal';


const Item = ({record, reverseTimings, setReverseTimings, setExistTimings, setBestTimeString, setAverageTime}) => (
    <TimeItem record={record} timings={reverseTimings} setReverseTimings={setReverseTimings} setExistTimings={setExistTimings} setBestTimeString={setBestTimeString} setAverageTime={setAverageTime}/>
  );

const Profile = ({ navigation }) => {

    const [bestTimeString, setBestTimeString] = useState('No best time yet');
    const [existTimings, setExistTimings] = useState(false);
    const [timings, setTimings] = useState([]);
    const [reverseTimings, setReverseTimings] = useState([]);
    const flatListRef = useRef(null);
    const soundObject = new Audio.Sound();
    const [averageTime, setAverageTime] = useState('');
    const [hasSeenModal, setHasSeenModal] = useState(false);
    const [isModalVisible, setModalVisible] = useState(true);

    const home = () => {
        navigation.navigate('Home')
    }

    useEffect(() => {
        async function getHasSeenModal() {
          try {
            const value = await AsyncStorage.getItem('@hasSeenModalProfile')
            if(value !== null) {
              setHasSeenModal(value);
              console.log("Modal hasn't been seen yet but exists ", value)
            } else {
              setHasSeenModal(false);
              setModalVisible(true);
              await AsyncStorage.setItem('@hasSeenModalProfile', 'false');
              console.log("Modal has been seen")
            }
          } catch(e) {
            // error reading value
          }
        }
        getHasSeenModal();
      }, []);

    // Modal
    const handleCloseModal = () => {
        setModalVisible(false);
        setHasSeenModal(true);
        async function storeHasSeenModal() {
          try {
            await AsyncStorage.setItem('@hasSeenModalProfile', 'true');
          } catch (error) {
            console.log(error);
          }
        }
        storeHasSeenModal();
      };

    const handleScroll = () => {
        // Simulate scrolling by scrolling to a small offset
        flatListRef.current?.scrollToOffset({ offset: 10 });
    };

    const playSound = async () => {
        try {
          await soundObject.loadAsync(require('../assets/sounds/refresh.mp3'));
          await soundObject.playAsync();
          // Your sound is playing!
        } catch (error) {
          // An error occurred!
        }
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
                    playSound();
                    setBestTimeString('No best time yet');
                    setExistTimings(false);
                    setReverseTimings([]);
                } catch (error) {
                // Error removing data
                console.log(error);
                }
                // async function storeHasSeenModal() {
                //   try {
                //     await AsyncStorage.setItem('@hasSeenModalProfile', 'false');
                //   } catch (error) {
                //     console.log(error);
                //   }
                // }
                // storeHasSeenModal();
                // setHasSeenModal(false);
                // setModalVisible(true);
              } 
            }
        ]
        );
        console.log("Clearing timings");
    };
    function formatMinutes(value) {
        return value.toString();
    }

    function formatSeconds(value) {
        return value < 10 ? `0${value}` : value.toString();
    }

    function formatMillisecond(value) {
        if (typeof value === 'number') {
            let newValue = (value / 10).toFixed(0);
            if (newValue < 10) {
            return newValue;
            }
            return (value / 1000).toFixed(0);
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

    const getAverageTiming = async () => {
        try {
        const timings = await retrieveTimings();
        //timings is a JSON object, loop through it to and add it to the reverseTimings array
        let reverseTimings = [];
        for (let i = timings.length - 1; i >= 0; i--) {
            reverseTimings.push(timings[i]);
        }
        console.log(reverseTimings);
        //loop through the timings and get the average
        let totalTime = 0;
        for (let i = 0; i < timings.length; i++) {
            const { minutes, seconds, milliseconds } = timings[i].time;
            console.log(minutes, seconds, milliseconds);
            const time = (minutes * 60 * 1000) + (seconds * 1000) + milliseconds;
            totalTime += time;
        }
        console.log(totalTime)
        const avgTotalTime = totalTime / timings.length;
        const averageMinutes = Math.floor(avgTotalTime / 60000);
        const averageSeconds = Math.floor((avgTotalTime % 60000) / 1000);
        const averageMilliseconds = Math.floor((avgTotalTime % 60000) % 1000);
        const averageTimeString = `${formatMinutes(averageMinutes)}:${formatSeconds(averageSeconds)}.${formatMillisecond(averageMilliseconds)}`;
        setAverageTime(averageTimeString);
        console.log(averageTimeString);
        return averageTimeString;
        } catch (error) {
        // Error retrieving data
        console.log(error);
        return null;
        }
    };

        

    //get the best timing
    useEffect(() => {
        getBestTiming();
        getAverageTiming();
        setModalVisible(true);

    }, []);

    // To retrieve all timings
    const retrieveTimings = async () => {
        try {
        const timings = await AsyncStorage.getItem('timings');
        const hasSeenModal = await AsyncStorage.getItem('@hasSeenModalProfile');
        
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
            <StatusBar style="auto" />
            {(hasSeenModal === 'false' || hasSeenModal === false) && <Modal
              animationType="fade"
              transparent={true}
              visible={isModalVisible}
              onRequestClose={() => {
                handleCloseModal();
              }}
            ><View style={styles.centeredView}>
            <View style={styles.modalView}>
                <TouchableOpacity style={styles.modalCloseIcon} onPress={() => {handleCloseModal()}}>
                  <Icon name="close" size={20} />
                </TouchableOpacity>
                <Text style={styles.modalTextTitle}>Welcome to the profile</Text>
                <View style={styles.modalLine}></View>
                <Text style={styles.modalText}>Here will be the times you save</Text>
                <Text style={styles.modalText}>To delete a certain record, <Text style={{fontWeight:'bold'}}>press and hold</Text> on it</Text>
                <Text style={styles.modalText}>To delete all the records, press the <Text style={{fontWeight:'bold'}}>trash icon</Text> on top</Text>
              </View>
            </View>
          </Modal>}
            <Icon name="arrow-back-ios" size={30} style={styles.back_icon} onPress={() => {home()}}/>
            {existTimings &&  <Icon name="delete-outline" size={30} style={styles.delete_icon} onPress={() => {clearTimings()}}/>}
            {existTimings ? <Text style={styles.main_text}>Your best time</Text> : <Text style={styles.main_text_alt}>No times yet!</Text>}
            {!existTimings && <Image style={styles.image} source={require('../assets/images/empty-box-icon.png')} />}
            {existTimings &&  <Text style={styles.time_text}>{bestTimeString}</Text> }
            {existTimings && <View style={styles.line}></View>}
            {existTimings && <Text style={styles.average_text}>Average time</Text>}
            {existTimings && <Text style={styles.avg_time_text}>{averageTime}</Text>}
            {existTimings && <View style={styles.line2}></View>}
            {existTimings && <Text style={styles.previous_text}>Previous times</Text>}
            <View style={styles.list}>
                <FlatList
                    contentContainerStyle={styles.flat_list}
                    ref={flatListRef}
                    data={reverseTimings}
                    renderItem={({item}) => <Item record={item} reverseTimings={reverseTimings} setReverseTimings={setReverseTimings} setExistTimings={setExistTimings} setBestTimeString={setBestTimeString} setAverageTime={setAverageTime}/>}
                    keyExtractor={(item, index) => index.toString()}
                    >
                </FlatList>
            </View>
            
        </SafeAreaView>
    )
}

export default Profile