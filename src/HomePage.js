import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, Button, TouchableOpacity,Alert, TextInput, Animated  } from 'react-native';
import { useFonts, RobotoMono_300Light } from '@expo-google-fonts/dev';
import { styles } from '../styles';
import React, { useState, useEffect, useRef } from 'react';
import {Audio} from 'expo-av';

const HomePage = ({ navigation }) => {
  const soundObject = new Audio.Sound();

  const playSound = async () => {
    try {
      await soundObject.loadAsync(require('../assets/sounds/click.mp3'));
      await soundObject.playAsync();
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
    }
  };
  
  const [numberOfMovements, setNumberOfMovements] = useState('');

  const handlePress = () => {
    playSound();
    if (numberOfMovements.trim() === '') {
      Alert.alert('Invalid Input', 'Please enter a number of movements.');
      return;
    }

    const parsedValue = parseInt(numberOfMovements, 10);

    if (isNaN(parsedValue)) {
      Alert.alert('Invalid Input', 'Please enter a valid number of movements.');
      return;
    }

    if (parsedValue < 1 || parsedValue > 50) {
      Alert.alert('Invalid Input', 'Please enter a number of movements between 1 and 50.');
      return;
    }
   
    navigation.navigate('Movements', { numberOfMovements: parsedValue });
  };

  const [fontsLoaded] = useFonts({
    RobotoMono: RobotoMono_300Light,
  });

  if (!fontsLoaded) {
    return null; // or render a loading component
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.top_view}>
          <Text style={styles.main_text}>
            Scramble {'\n'}your {'\n'}cube!
          </Text>
          <Image source={require('../assets/images/icon_cube.png')} style={styles.cube_icon} />
      </View>
      <View style={styles.bottom_view}>
          <TextInput 
            style={styles.input_text}
            placeholder='Number of movements'
            keyboardType='numeric'
            value={numberOfMovements}
            onChangeText={setNumberOfMovements}
          />
          <TouchableOpacity onPress={handlePress} style={styles.scramble_button}>
            <Text style={styles.scramble_button_text}>Scramble!</Text>
          </TouchableOpacity>        
      </View>
    </View>
  );
}

export default HomePage;

