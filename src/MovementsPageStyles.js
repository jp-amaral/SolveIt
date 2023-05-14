import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const itemWidth = width * 0.41; // adjust this value as needed


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '10%',
    alignItems: 'center',
  },
  timer_container: {
    flex: 1,
    marginTop: '9.6%',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  save_container: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
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
    text: {
      fontFamily: 'RobotoMono',
      fontSize: 20,
      color: '#434C5E',
      fontStyle: 'normal',
      fontWeight: '300',
      textAlign: 'center',
      marginBottom: 20,
    },
    timer_text: {
      fontFamily: 'RobotoMono',
      fontSize: 90,
      color: '#434C5E',
      fontStyle: 'normal',
      fontWeight: '300',
      textAlign: 'center',
      marginBottom: 80,
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
    footer: {
      width: '100%',
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      height: 200,
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
    timer_icon: {
      color: '#434C5E',
      marginBottom: 30,
    },
    back_icon_timer: {
      color: '#434C5E',
      position: 'absolute',
      left: 2,
      paddingLeft: 20,
      top: 0,
    },
    stop_timer_icon: {
      width: 100,
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 0,
      marginBottom: 36,
    },
    stop_timer_image: {
      width: 46,
      height: 46,
      tintColor: '#D08770',
    },
    save_icon: {
      width: 100,
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 0,
      marginBottom: 32,
    },
    save_text: {
      fontFamily: 'RobotoMono',
      fontSize: 30,
      color: '#434C5E',
      fontStyle: 'normal',
      fontWeight: '300',
      textAlign: 'center',
      marginBottom: 140,
      marginLeft: 20,
    },
});