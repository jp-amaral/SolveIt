import React , { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Animated

} from 'react-native';
import { styles } from './MovementsPageStyles'
import CubeItem from './CubeItem';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Audio} from 'expo-av';

const Item = ({value}) => (
  <CubeItem label={value} />
);

const movementLabels = ["F", "F'", "B", "B'", "U", "U'", "D", "D'", "L", "L'", "R", "R'"];

const complementaryMovements = {
  "F": "F'",
  "F'": "F",
  "B": "B'",
  "B'": "B",
  "U": "U'",
  "U'": "U",
  "D": "D'",
  "D'": "D",
  "L": "L'",
  "L'": "L",
  "R": "R'",
  "R'": "R"
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

  const playSound = async () => {
    try {
      await soundObject.loadAsync(require('../assets/sounds/refresh.mp3'));
      await soundObject.playAsync();
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
    }
  };

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
  
    
    const { numberOfMovements } = route.params;
    const [views, setViews] = useState([]);

    useEffect(() => {
      setViews(generateMovements(numberOfMovements));
    }, []);

    const handlePress = () => {
      playSound();
      setViews(generateMovements(numberOfMovements));
    };

    const returnHome = () => {
        navigation.navigate('Home');
    };
    
    
    return (
        <SafeAreaView style={styles.container}>
          <View>
            <FlatList
                data={views}
                renderItem={({item}) => <Item value={item.value} />}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                key={2}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                  <View style={styles.header}>
                      <Icon name="arrow-back-ios" size={30} style={styles.back_icon} onPress={() => {returnHome()}}/>
                      <Animated.View style={{...styles.refresh_icon, opacity: scaleAnim }}>
                        <Icon name="autorenew" size={30} color={'#434C5E'} onPress={() => {animateIcon(); handlePress();}}/>
                      </Animated.View>
                  </View>
                }
            />
          </View>
        </SafeAreaView>
    );
};


export default MovementsPage;