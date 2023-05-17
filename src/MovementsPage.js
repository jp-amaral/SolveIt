import React , { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  Animated,
  TouchableOpacity,
  BackHandler,
  StatusBar
} from 'react-native';
import { styles } from './MovementsPageStyles'
import CubeItem from './CubeItem';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Audio} from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { activateKeepAwakeAsync , deactivateKeepAwake } from 'expo-keep-awake';
import Toast from 'react-native-toast-message';
import Modal from 'react-native-modal';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

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
  const [showtimer, setShowTimer] = useState(false);
  const [time, setTime] = useState({ minutes: 0, seconds: 0, milliseconds: 0 }); 
  const [isRunning, setIsRunning] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);
  const flatListRef = useRef(null);
  const [isModalVisible, setModalVisible] = useState(true);
  const [hasSeenModal, setHasSeenModal] = useState(false);

  useEffect(() => {
    async function getHasSeenModal() {
      try {
        const value = await AsyncStorage.getItem('@hasSeenModal')
        console.log(value);
        if(value !== null) {
          setHasSeenModal(value);
        } else {
          setHasSeenModal(false);
          await AsyncStorage.setItem('@hasSeenModal', 'false');
        }
      } catch(e) {
        // error reading value
      }
    }
    getHasSeenModal();
  }, []);
  const toastConfig = {
    custom: ({ ...rest }) => (
      <Animated.View
        style={{ 
          backgroundColor : showtimer ?  backgroundColor : '#D08770',
          height: 102, 
          borderRadius: 30, 
          alignItems: 'center', 
          justifyContent: 'center', 
          textAlign: 'center',
          width: '100%',
          elevation: 10,
          padding: 0,
          marginBottom: 10,
        }}
        >
          <TouchableOpacity onPress={() => finishTimer() } style={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
          <Text style={styles.timer_text}>
            {formatMinutes(time.minutes)}:{formatSeconds(time.seconds)}:{formatMillisecond(time.milliseconds)}
          </Text>
          </TouchableOpacity>
      </Animated.View>
    )
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

    //make sure that the timer doesn't pass 60 minutes
    if (time.minutes >= 60) {
      finishTimer();
    }

    return () => clearInterval(timer);
  }, [isRunning]);

  //sounds

  //Refresh sound
  const playSound = async () => {
    try {
      await soundObject.loadAsync(require('../assets/sounds/refresh.mp3'));
      await soundObject.playAsync();
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
    }
  };

  //Click sound
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

  const opacityAnim = useRef(new Animated.Value(1)).current; // Initial value for scale: 1
  
  const animateIcon = () => {
    Animated.sequence([
        Animated.timing(opacityAnim, {
            toValue: 0.3, // increase size to 130%
            duration: 75,
            useNativeDriver: true
        }),
        Animated.timing(opacityAnim, {
            toValue: 1, // decrease size back to original
            duration: 300,
            useNativeDriver: true
        })
    ]).start();
  };

  const colorAnim = useRef(new Animated.Value(0)).current;
  const isGreen = useRef(false); // to keep track of color state
  const [saved, setSaved] = useState(false); // to keep track of color state
  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#D08770', '#A3BE8C']
  });

  const animateBackground = () => {
    Animated.timing(colorAnim, {
      toValue: isGreen.current ? 1 : 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
    isGreen.current = !isGreen.current;
  };

  //Looping animation
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
    const handleScroll = () => {
      flatListRef.current?.scrollToOffset({ offset: 30 });
    };
    
    const { numberOfMovements } = route.params;
    const [views, setViews] = useState([]);

    useEffect(() => {
      handleScroll();
      setViews(generateMovements(numberOfMovements));
    }, []);

    const handleRefresh = () => {
      console.log("reseting modal")
      playSound();
      setViews(generateMovements(numberOfMovements));
      async function storeHasSeenModal() {
        try {
          await AsyncStorage.setItem('@hasSeenModal', 'false');
        } catch (error) {
          console.log(error);
        }
      }
      storeHasSeenModal();
      async function getHasSeenModal() {
        try {
          await AsyncStorage.getItem('@hasSeenModal').then((value) => {
            console.log(value);
          });
        } catch (error) {
          console.log(error);
        }
      }
      getHasSeenModal();
      
      setHasSeenModal('false');
      setModalVisible(true);
    };

    const savedRef = useRef(saved);
    useEffect(() => {
      savedRef.current = saved;
      console.log('Current value of savedRef: ', savedRef.current);
    }, [saved]);

    const timeRef = useRef(time);
    useEffect(() => {
      timeRef.current = time;
    }, [time]);

    const finishTimer = () => {
      playSoundStart();
      setIsRunning(false);
      setTimerFinished(true);
      animateBackground();
      deactivateKeepAwake();
      setSaved(!saved);
    };
    
    const startTimerToast = () => {
      console.log(hasSeenModal)
      setModalVisible(false);
      if(hasSeenModal === 'true' || hasSeenModal === true){
        console.log('start timer')
        activateKeepAwakeAsync();
        playSoundStart();
        setTime({ minutes: 0, seconds: 0, milliseconds: 0 });
        setIsRunning(true);
        setShowTimer(true);
        animateBackground();
        Toast.show({
          type: 'custom',
          visibilityTime: 1200,
          autoHide: false,
          position: 'bottom',
          visibilityTime: 1200,
          onShow: () => {
            setSaved(false);
          },
          onHide: () => {
            console.log("Closed toast saving: ", savedRef.current);
            if(savedRef.current){
              saveCurrentTime(time);
            }
            setShowTimer(false);
            setTimerFinished(false);
            isGreen.current = 0;
          },
          bottomOffset: 10,
        });
      }
    };

    const closeToast = () => {
      Toast.hide();
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

    const saveTiming = async (newTiming) => {
      try {
        // const timings = await retrieveTimings();
        const timingsJSON = await AsyncStorage.getItem('timings');
        const timings = timingsJSON != null ? JSON.parse(timingsJSON) : [];
        console.log(timings);

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
        await AsyncStorage.setItem('timings', JSON.stringify(timings));
      } catch (error) {
        // Error saving data
        console.log(error);
      }
    };
    

    const saveCurrentTime = async () => {
      const date = new Date();
      const dateString = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`; // Format the date as "day-month-year"
      console.log(timeRef.current)
    
      const newTiming = {
        date: dateString,
        time: timeRef.current,
        isBest: false
      };
      await saveTiming(newTiming);
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
        Toast.hide();
      };
      
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, [showtimer]);

    // Modal
    const handleCloseModal = () => {
      setModalVisible(false);
      setHasSeenModal(true);
      async function storeHasSeenModal() {
        try {
          await AsyncStorage.setItem('@hasSeenModal', 'true');
        } catch (error) {
          console.log(error);
        }
      }
      storeHasSeenModal();
    };

    return (
        
        <SafeAreaView style={styles.container}>
          <StatusBar style="auto" />
            {hasSeenModal === 'false' && <Modal
              animationType="fade"
              transparent={true}
              visible={!isModalVisible}
              onRequestClose={() => {
                handleCloseModal();
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <TouchableOpacity style={styles.modalCloseIcon} onPress={() => {handleCloseModal()}}>
                    <Icon name="close" size={20} />
                  </TouchableOpacity>
                  <Text style={styles.modalTextTitle}>How to use the timer?</Text>
                  <View style={styles.modalLine}></View>
                  <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>1. </Text>Tap the timer icon to <Text style={{fontWeight:'bold'}}>start</Text></Text>
                  <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>2. </Text>Tap the timer again to <Text style={{fontWeight:'bold'}}>stop</Text> and the background will change to <Text style={{color:'#A3BE8C'}}>green</Text>, indicating that the time will be <Text style={{fontWeight:'bold'}}>saved</Text></Text>
                  <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>3. </Text>If you decide not to save the time, just click on the timer again. The background will turn back to <Text style={{color:'#D08770'}}>red</Text>, showing that the time <Text style={{fontWeight:'bold'}}>won't be saved </Text>. </Text>
                  <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>4. </Text>To see your saved times, tap on the <Text style={{fontWeight:'bold'}}>profile</Text> icon on the home screen</Text>
                </View>
              </View>
            </Modal>}
          <Animated.View style={{ transform: [{ translateY: flatListPosition }] }}>
              <FlatList
                data={views}
                renderItem={({item}) => <Item value={item.value} />}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                key={2}
                ref={flatListRef}
                // scrollEnabled={showtimer ? false : true}
                ListHeaderComponent={
                  <View style={styles.header}>
                    <Animated.View style={{...styles.back_icon, opacity: opacityAnim }}>
                      <Icon name="arrow-back-ios" size={30}  onPress={() => {returnHome()}} />
                    </Animated.View>
                    <Animated.View style={{...styles.refresh_icon, opacity: opacityAnim }}>
                      <Icon name="autorenew" size={30} color={'#434C5E'} onPress={() => {animateIcon(); handleRefresh(); closeToast()}}/>
                    </Animated.View>
                  </View>
                }
                ListFooterComponent={
                  <View style={styles.footer}>
                      <Text style={styles.text}> 
                        Start the timer and {'\n'}
                        solve the cube! 
                      </Text>
                      <TouchableOpacity onPress={() => {startTimerToast();}}>
                        <Animated.View style={{...styles.timer_icon, opacity: opacityAnim }}>
                          <Icon name="timer" size={60}  color={'#434C5E'} />
                        </Animated.View>
                      </TouchableOpacity>
                  </View>
                }
            />
            <Toast config={toastConfig}/>
            </Animated.View>
        </SafeAreaView>
    );
};


export default MovementsPage;