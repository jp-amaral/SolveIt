import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const itemWidth = width * 0.41; // adjust this value as needed


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '10%',
    alignItems: 'center',
  },

  default_text: {
      fontFamily: 'RobotoMono',
      fontSize: 20,
      color: '#434C5E',
  },
  scramble_button: {
      width: '50%',
      height: 50,
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#D8DEE9',
      borderRadius: 16,
      shadowColor: '#000',
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 5,
    },
    scramble_button_text: {
      fontFamily: 'RobotoMono',
      fontSize: 20,
      color: '#434C5E',
      fontStyle: 'normal',
      fontWeight: '300',
    },
    square: {
      backgroundColor: '#f9c2ff',
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 16,
      marginHorizontal: 16,
      width: itemWidth,
      height: itemWidth,
    },
    header: {
      width: '100%',
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      height: 100,
      flexDirection: 'row',
    },
    back_icon: {
      color: '#434C5E',
      position: 'absolute',
      left: 0,
      paddingLeft: 20,
    },
    refresh_icon: {
      color: '#434C5E',
      position: 'absolute',
      right: 0,
      paddingRight: 20,
    },
});