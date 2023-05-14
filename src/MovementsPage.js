import React , { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  Image,
  Text,
  Animated,
  TouchableOpacity,
  BackHandler,
  Dimensions,
  StatusBar
} from 'react-native';
import { styles } from './MovementsPageStyles'
import CubeItem from './CubeItem';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Audio} from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Item = ({value}) => (
  <CubeItem label={value} />
);

const movementLabels = ["F", "NF", "B", "NB", "U", "NU", "D", "ND", "L", "NL", "R", "NR"];

const complementaryMovements = {
  "F": "NF",
  "NF": "F",
  "B": "NB",
  "NB": "B",
  "U": "NU",
  "NU": "U",
  "D": "ND",
  "ND": "D",
  "L": "NL",
  "NL": "L",
  "R": "NR",
  "NR": "R"
};

const getRandomMovement = (lastMovement) => {
  let nextMovement;
  do {
    nextMovement = movementLabels[Math.floor(Math.random() * movementLabels.length)];
  } while (nextMovement === lastMovement || nextMovement === complementaryMovements[lastMovement]);

  return nextMovement;
};

const generateMovements = (numberOfMovements) => {
  let movements = [];
  let lastMovement;
  let repeatCount = 0;

  for (let i = 0; i < numberOfMovements; i++) {
    let nextMovement = getRandomMovement(lastMovement);

    if (nextMovement === lastMovement) {
      repeatCount++;
    } else {
      repeatCount = 0;
    }

    // If we have repeated a movement twice, get a different movement
    while (repeatCount === 2) {
      nextMovement = getRandomMovement(lastMovement);
      if (nextMovement !== lastMovement) {
        repeatCount = 0;
      }
    }
    let json = { "value": nextMovement };
    movements.push(json);
    lastMovement = nextMovement;
  }

  return movements;
};

const MovementsPage = ({ route, navigation }) => {

  const soundObject = new Audio.Sound();
  const flatListPosition = useRef(new Animated.Value(0)).current;
  const timerContainerHeight = useRef(new Animated.Value(0)).current;
  const [showtimer, setShowTimer] = useState(false);
  const [time, setTime] = useState({ minutes: 0, seconds: 0, milliseconds: 0 }); 
  const [isRunning, setIsRunning] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);
  const flatListRef = useRef(null);
  const [isSavedClicked, setIsSaved] = useState(false);
  const [saveTimeLocal, setSaveTimeLocal] = useState(false);

  const handleScroll = () => {
    // Simulate scrolling by scrolling to a small offset
    flatListRef.current?.scrollToOffset({ offset: 30 });
};

  useEffect(() => {
    let timer;

    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          const newMilliseconds = prevTime.milliseconds + 100;
          const newSeconds = prevTime.seconds + Math.floor(newMilliseconds / 1000);
          const newMinutes = prevTime.minutes + Math.floor(newSeconds / 60);

          return {
            minutes: newMinutes,
            seconds: newSeconds % 60,
            milliseconds: newMilliseconds % 1000,
          };
        });
      }, 100);
    }

    return () => clearInterval(timer);
  }, [isRunning]);

  //sounds

  const playSound = async () => {
    try {
      await soundObject.loadAsync(require('../assets/sounds/refresh.mp3'));
      await soundObject.playAsync();
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
    }
  };

  const playSoundStart = async () => {
    try {
      await soundObject.loadAsync(require('../assets/sounds/click.mp3'));
      await soundObject.playAsync();
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
    }
  };

  // Animation

  const scaleAnim = useRef(new Animated.Value(1)).current; // Initial value for scale: 1
  
  const animateIcon = () => {
    Animated.sequence([
        Animated.timing(scaleAnim, {
            toValue: 0.3, // increase size to 130%
            duration: 75,
            useNativeDriver: true
        }),
        Animated.timing(scaleAnim, {
            toValue: 1, // decrease size back to original
            duration: 300,
            useNativeDriver: true
        })
    ]).start();
  };

  const [fadeAnim] = useState(new Animated.Value(1)); // Initial value for opacity: 0

  const startAnimation = () => {
    Animated.loop(
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 0.5,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]),
    ).start();
};

  useEffect(() => {
    if (timerFinished) {
        startAnimation();
    } else {
        fadeAnim.setValue(1); // If timer is not finished, stop the animation and set opacity to 1
    }
  }, [timerFinished]);


  //New movements
    
    const { numberOfMovements } = route.params;
    const [views, setViews] = useState([]);

    const [saveIcon, setSaveIcon] = useState('bookmark-outline');

    useEffect(() => {
      handleScroll();
      setViews(generateMovements(numberOfMovements));
    }, []);

    const handlePress = () => {
      playSound();
      setViews(generateMovements(numberOfMovements));
    };

    const finishTimer = () => {
      playSoundStart();
      setIsRunning(false);
      setTimerFinished(true);
      setIsSaved(false);
    };

    const hideTimerUI = () => {
      // animate flatListPosition back to 0
      Animated.timing(timerContainerHeight, {
        toValue: 0, 
        duration: 100,
        useNativeDriver: true
      }).start( () => {
        setShowTimer(false);
        setIsRunning(false);
        setTimerFinished(false);
        setSaveIcon('bookmark-outline');
        setIsSaved(false);
        Animated.timing(flatListPosition, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        }).start();
      });
    };


    const showTimerUI = () => {
      playSoundStart();
      setTime({ minutes: 0, seconds: 0, milliseconds: 0 });
      setIsRunning(true);
      setShowTimer(true);
      setIsSaved(false);
      setSaveIcon('bookmark-outline');
      setSaveTimeLocal(false);
      // animate flatListPosition
      Animated.timing(flatListPosition, {
          toValue: -250, // or -yourViewHeight
          duration: 300, // duration of the animation, 500ms in this case
          useNativeDriver: true // use native driver for better performance
      }).start(() => {
        Animated.timing(timerContainerHeight, {
          toValue: 1, 
          duration: 300,
          useNativeDriver: true
        }).start()
      });
    };

    const returnHome = () => {
        navigation.navigate('Home');
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
  
    //Save times

    // To retrieve all timings
    const retrieveTimings = async () => {
      try {
        const timingsJSON = await AsyncStorage.getItem('timings');
        const timings = timingsJSON != null ? JSON.parse(timingsJSON) : [];
        
        console.log(timings);
        return timings;
      } catch (error) {
        // Error retrieving data
        console.log(error);
      }
    };
    const saveTiming = async (newTiming) => {
      try {
        const timings = await retrieveTimings();
    
        let bestTiming = newTiming;
    
        // Iterate over all timings to find the best one and reset isBest flag
        for (let timing of timings) {
          if (timing.isBest && isTimeLower(timing.time, bestTiming.time)) {
            bestTiming = timing;
          }
          timing.isBest = false; // Reset isBest flag
        }
    
        // Check if the new timing is the best
        if (isTimeLower(newTiming.time, bestTiming.time)) {
          newTiming.isBest = true;
          bestTiming = newTiming;
        } else {
          newTiming.isBest = false;
        }
    
        timings.push(newTiming);
    
        // Set the best timing isBest flag to true
        for (let timing of timings) {
          if (timing === bestTiming) {
            timing.isBest = true;
          }
        }
        console.log(timings)
        await AsyncStorage.setItem('timings', JSON.stringify(timings));
      } catch (error) {
        // Error saving data
        console.log(error);
      }
    };
    

    const saveCurrentTime = async () => {
      const date = new Date();
      const dateString = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`; // Format the date as "day-month-year"
    
      const newTiming = {
        date: dateString,
        time: time,
        isBest: false
      };
      // console.log(newTiming);
      saveTiming(newTiming);
    };

    const deleteCurrentTime = async () => {
      try {
        // Retrieve all timings
        const timingsJSON = await AsyncStorage.getItem('timings');
        const timings = timingsJSON != null ? JSON.parse(timingsJSON) : [];
        
        // Check if there are timings
        if (timings.length > 0) {
          // Remove the last timing
          timings.pop();
    
          // Save the updated timings back to AsyncStorage
          // console.log(timings);
          await AsyncStorage.setItem('timings', JSON.stringify(timings));
        }
      } catch (error) {
        // Error deleting data
        console.log(error);
      }
    };
    


    function saveTimeIconStatus  () {
      setIsSaved(!isSavedClicked);
      if(!isSavedClicked){
        setSaveIcon('bookmark');
        setSaveTimeLocal(true);
        saveCurrentTime();
      } else {
        setSaveIcon('bookmark-outline');
        setSaveTimeLocal(false);
        deleteCurrentTime();
      }
    };

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
    
    // Back handler
    useEffect(() => {
      const backAction = () => {
        if (showtimer) {
          hideTimerUI();
          return true;
        }
        return false;
      };
      
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, [showtimer]);


    return (
        
        <SafeAreaView style={styles.container}>
          <StatusBar style="auto" />
          <Animated.View style={{ transform: [{ translateY: flatListPosition }] }}>
              <FlatList
                data={views}
                renderItem={({item}) => <Item value={item.value} />}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                key={2}
                ref={flatListRef}
                scrollEnabled={showtimer ? false : true}
                ListHeaderComponent={
                  <View style={styles.header}>
                      <Icon name="arrow-back-ios" size={30} style={styles.back_icon} onPress={() => {returnHome()}}/>
                      <Animated.View style={{...styles.refresh_icon, opacity: scaleAnim }}>
                        <Icon name="autorenew" size={30} color={'#434C5E'} onPress={() => {animateIcon(); handlePress();}}/>
                      </Animated.View>
                  </View>
                }
                ListFooterComponent={
                  <View style={styles.footer}>
                      <Text style={styles.text}> 
                        Start the timer and {'\n'}
                        solve the cube! 
                      </Text>
                      <Animated.View style={{...styles.timer_icon, opacity: scaleAnim }}>
                      {!showtimer &&<Icon name="timer" size={60}  color={'#434C5E'} onPress={() => {animateIcon(); showTimerUI();}}/>}
                      {showtimer &&<Icon name="close" size={60} style={styles.back_icon_timer} onPress={() => {hideTimerUI()}}/>}
                      </Animated.View>
                  </View>
                }
            />
            </Animated.View>
            {showtimer && <Animated.View style={{...styles.timer_container, opacity: timerContainerHeight }}>
                <Animated.Text style={{...styles.timer_text, color: timerFinished ? '#A3BE8C' : '#434C5E', opacity: fadeAnim}}>
                  {formatMinutes(time.minutes)}:{formatSeconds(time.seconds)}:{formatMillisecond(time.milliseconds)}
                </Animated.Text>

                {!timerFinished && <Animated.View style={{...styles.stop_timer_icon, opacity: scaleAnim } }>
                  <TouchableOpacity onPress={() => {animateIcon(); finishTimer();}} style={{marginTop: 10}}>
                    <Image source={require('../assets/images/stop_circle.png')} style={styles.stop_timer_image} onPress={() => {finishTimer();}}/>
                  </TouchableOpacity>
                </Animated.View>}

                {timerFinished && 
                <View style={styles.save_container}>
                  <Text style={styles.save_text}>Save your time! </Text>
                  <Animated.View style={{...styles.save_icon, opacity: scaleAnim }}>
                    <Icon name={saveIcon} size={50} color={'#434C5E'}onPress={() => {animateIcon(); saveTimeIconStatus();}}/>
                  </Animated.View>
                </View>}
              </Animated.View>}
            
        </SafeAreaView>
    );
};


export default MovementsPage;