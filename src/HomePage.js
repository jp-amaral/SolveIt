import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, Button, TouchableOpacity,Alert, TextInput, Animated  } from 'react-native';
import { useFonts, RobotoMono_300Light } from '@expo-google-fonts/dev';
import { styles } from '../styles';
import React, { useState, useEffect, useRef } from 'react';
import  Icon  from 'react-native-vector-icons/MaterialIcons';

const HomePage = ({ navigation }) => {
  
  const [numberOfMovements, setNumberOfMovements] = useState('');

  const handlePress = () => {
    // playSound();
    if (numberOfMovements.trim() === '') {
      Alert.alert('Invalid Input', 'Please enter a number of movements.');
      return;
    }

    const parsedValue = parseInt(numberOfMovements, 10);

    if (isNaN(parsedValue)) {
      Alert.alert('Invalid Input', 'Please enter a valid number of movements.');
      return;
    }

    if (parsedValue < 4 || parsedValue > 50) {
      Alert.alert('Invalid Input', 'Please enter a number of movements between 4 and 50.');
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
          <TextInput 
            style={styles.input_text}
            placeholder='Number of movements'
            keyboardType='numeric'
            value={numberOfMovements}
            onChangeText={setNumberOfMovements}
          />
          {/* <TouchableOpacity onPress={handlePress} style={styles.scramble_button}>
            <Text style={styles.scramble_button_text}>Scramble!</Text>
          </TouchableOpacity>         */}
          <Icon name="play-arrow" size={50} style={styles.play_icon} onPress={() => {handlePress()}}/>
      </View>
    </View>
  );
}

export default HomePage;

