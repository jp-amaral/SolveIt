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
import { Stopwatch } from 'react-native-stopwatch-timer'

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
  let scrollOffset = 0; // Initialize scroll offset
  let isScrolling = false; // Initialize scroll state
  let scrollIntervalId = null;

  useEffect(() => {
    async function getHasSeenModal() {
      try {
        const value = await AsyncStorage.getItem('@hasSeenModalTimer')
        if(value !== null) {
          setHasSeenModal(value);
          console.log("Not first time loading movements page")
        } else {
          setHasSeenModal(false);
          console.log("First time loading movements page")
          await AsyncStorage.setItem('@hasSeenModalTimer', 'false');
        }
      } catch(e) {
        // error reading value
      }
    }
    getHasSeenModal();
    setModalVisible(false);
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
          <TouchableOpacity onPress={() => finishTimer() } style={{width: '100%',height: '100%',alignItems: 'center',justifyContent: 'center'}}>
          <Text style={styles.timer_text}>
            <Stopwatch msecs start={isRunning} reset={!showtimer} options={options} getTime={getFormattedTime} />
          </Text>
          </TouchableOpacity>
      </Animated.View>
    )
  };
  const options = {
    container: {
      width: '100%',
    },
    text: {
      fontFamily: 'RobotoMono',
      fontSize: 82,
      color: '#E5E9F0',
      fontStyle: 'normal',
      fontWeight: '300',
      textAlign: 'center',
      width: '100%',
      paddingBottom: 5,
    }
  };
  getFormattedTime = (time) => {
    this.currentTime = time;
  };

  //AutoScroll
  // Function to start scrolling
  const startAutoScroll = () => {
    if (!isScrolling) {
      console.log("Start autoscroll");
      isScrolling = true;
      scrollIntervalId = setInterval(() => {
        scrollOffset += 180; // Update scroll offset. You can control speed here.
        flatListRef.current.scrollToOffset({ animated: true, offset: scrollOffset });
      }, 2000); // Control the scroll interval. Lower value = faster scroll.
    }
  };

  // Function to stop scrolling
  const stopAutoScroll = () => {
    isScrolling = false;
    if (scrollIntervalId !== null) {
      clearInterval(scrollIntervalId);
      scrollOffset = 0;
    }
  };

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
    const { numberOfMovements } = route.params;
    const [views, setViews] = useState([]);

    useEffect(() => {
      setViews(generateMovements(numberOfMovements));
    }, []);

    const handleRefresh = () => {
      playSound();
      setViews(generateMovements(numberOfMovements));
    };

    const savedRef = useRef(saved);
    useEffect(() => {
      savedRef.current = saved;
    }, [saved]);

    const seenModalRef = useRef(hasSeenModal);
    useEffect(() => {
      seenModalRef.current = hasSeenModal;
    }, [hasSeenModal]);

    const showtimerRef = useRef(showtimer);
    useEffect(() => {
      showtimerRef.current = showtimer;
      console.log("showtimeref: ",showtimerRef.current)
    }, [showtimer]);


    const finishTimer = () => {
      playSoundStart();
      setIsRunning(false);
      setTimerFinished(true);
      animateBackground();
      deactivateKeepAwake();
      setSaved(!saved);
      console.log(currentTime)
    };
    
    const startTimer = () => {
      console.log(hasSeenModal)
      setModalVisible(true);
      if(hasSeenModal === 'true' || hasSeenModal === true){
        activateKeepAwakeAsync();
        playSoundStart();
        // setTime({ minutes: 0, seconds: 0, milliseconds: 0 });
        setIsRunning(true);
        setShowTimer(true);
        animateBackground();
        console.log('start timer')
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
            if(savedRef.current){
              saveCurrentTime(time);
            }
            console.log("colse toast")
            setIsRunning(false);
            setShowTimer(false);
            setTimerFinished(false);
            setSaved(false);
            isGreen.current = 0;
          },
          bottomOffset: 10,
        });
      }
    };

    const returnHome = () => {
        navigation.navigate('Home');
    };

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
      const timeString = currentTime.split(':'); // Split the time string into an array of [minutes, seconds, milliseconds]
      const newTiming = {
        date: dateString,
        time: {
          minutes: parseInt(timeString[0]),
          seconds: parseInt(timeString[1]),
          milliseconds: parseInt(timeString[2])*10
        },
        isBest: false
      };
    
      console.log(newTiming);
      await saveTiming(newTiming);
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
        stopAutoScroll();
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
          await AsyncStorage.setItem('@hasSeenModalTimer', 'true');
        } catch (error) {
          console.log(error);
        }
      }
      storeHasSeenModal();
    };

    return (
        
        <SafeAreaView style={styles.container}>
          <StatusBar style="auto" />
            {seenModalRef.current === false && <Modal
              animationType="fade"
              transparent={true}
              visible={isModalVisible}
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
                  <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>5. </Text>Swipe on the timer, up or down, to <Text style={{fontWeight:'bold'}}>close</Text> it</Text>
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
                // onEndReached={() => {
                //   stopAutoScroll();
                //   console.log('end reached');
                // }}
                scrollEnabled={showtimer ? false : true}
                // onTouchMove={() => {
                //   stopAutoScroll();
                //   console.log('touch move');
                // }}
                ListHeaderComponent={
                  <View style={styles.header}>
                    <Animated.View style={{...styles.back_icon, opacity: opacityAnim }}>
                      <Icon name="arrow-back-ios" size={30}  onPress={() => {returnHome()}} />
                    </Animated.View>
                    <Animated.View style={{...styles.refresh_icon, opacity: opacityAnim }}>
                      <Icon name="autorenew" size={30} color={'#434C5E'} onPress={() => {animateIcon(); handleRefresh();}}/>
                    </Animated.View>
                    {/* <Animated.View style={{...styles.play_icon, opacity: opacityAnim }}>
                      <Icon name="play-arrow" size={36} color={'#434C5E'} onPress={() => {animateIcon(); startAutoScroll();}}/>
                    </Animated.View> */}
                  </View>
                }
                ListFooterComponent={
                  <View style={styles.footer}>
                      <Text style={styles.text}> 
                        Start the timer and {'\n'}
                        solve the cube! 
                      </Text>
                      <TouchableOpacity onPress={() => {startTimer();}}>
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