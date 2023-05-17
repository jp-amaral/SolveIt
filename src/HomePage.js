import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, Button, TouchableOpacity,Alert, TextInput, Animated  } from 'react-native';
import { styles } from '../styles';
import React, { useState, useEffect, useRef } from 'react';
import  Icon  from 'react-native-vector-icons/MaterialIcons';
import ScrollPicker from 'react-native-wheel-scrollview-picker';
import {Audio} from 'expo-av';


const HomePage = ({ navigation }) => {
  
  const [numberOfMovements, setNumberOfMovements] = useState('20');
  const soundObject = new Audio.Sound();
  const [validNumbers, setValidNumbers] = useState([]);

  const playSound = async () => {
    try {
      await soundObject.loadAsync(require('../assets/sounds/tick.mp3'));
      await soundObject.playAsync();
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
    }
  };

  useEffect(() => {
    const numbers = [];
    for (let i = 10; i <= 40; i++) {
      numbers.push(i.toString());
    }
    setValidNumbers(numbers);
  }, []);

  const handlePress = () => {
    const parsedValue = parseInt(numberOfMovements, 10);
    navigation.navigate('Movements', { numberOfMovements: parsedValue });
  };

  const showProfile = () => {
    navigation.navigate('Profile',);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.top_view}>
        <Icon name="person" size={30} style={styles.profile} onPress={() => {showProfile()}}/>
          <Text style={styles.main_text}>
            Scramble {'\n'}your {'\n'}cube!
          </Text>
          <Image source={require('../assets/images/icon_cube.png')} style={styles.cube_icon} />
      </View>
      <View style={styles.bottom_view}>
          <View style={{
            position: 'absolute',
            top: '20%',
            height: '40%',
            borderWidth: 0,
            borderColor: '#434C5E',
          }}>
            <ScrollPicker
              dataSource={validNumbers}
              selectedIndex={10}
              itemHeight={46}
              wrapperHeight={150}
              wrapperWidth={350}
              wrapperColor='#E5E9F0'
              highlightColor='#b3b3b3'
              renderItem={(data, index, isSelected) => (
                <View>
                  <Text style={isSelected ? styles.input_text_selected : styles.input_text}>{data}</Text>
                </View>
              )}
              onValueChange={(data, selectedIndex) => {
                setNumberOfMovements(data);
                playSound();
              }}
            />
          </View>
        <Icon name="play-arrow" size={55} style={styles.play_icon} onPress={() => {handlePress()}}/>
      </View>
    </View>
  );
}

export default HomePage;

