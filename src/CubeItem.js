import React from 'react'
import {
  View,
  Text,
  Image
} from 'react-native'
import { styles } from './CubeItemStyles'
import images from './images'

const CubeItem = ({ label }) => {
  let image = images[label];
  //if the movement has the letter "N", we remove it and add a "'" at the end
  if (label.includes("N")) {
    label = label.replace("N", "") + "'";
  }
  return (
    <View style={styles.container}>
      <Text style={styles.default_text}>{label}</Text>
      <Image source={image} style={styles.cube}/>
    </View>
  )
}

export default CubeItem