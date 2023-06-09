import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const itemWidth = width * 0.41; // adjust this value as needed


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  timer_container: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    width: '100%',
    height: 280,
    // borderWidth: 1,
    // borderColor: '#434C5E',
    backgroundColor: '#D8DEE9',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 10,
  },
  save_container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  default_text: {
      fontFamily: 'RobotoMono',
      fontSize: 20,
      color: '#434C5E',
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
      fontSize: 82,
      color: '#E5E9F0',
      fontStyle: 'normal',
      fontWeight: '300',
      textAlign: 'center',
      width: '100%',
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
      marginTop: 30,
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
      paddingLeft: 24,
    },
    refresh_icon: {
      color: '#434C5E',
      position: 'absolute',
      right: 0,
      paddingRight: 24,
    },
    play_icon: {
      color: '#434C5E',
      alignSelf: 'center',
    },
    timer_icon: {
      color: '#434C5E',
      width: 100,
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    back_icon_timer: {
      color: '#434C5E',
      width: 100,
      height: 100,
      paddingTop: 20,
      paddingLeft: 20,
    },
    back_icon_timer_border: {
      color: '#434C5E',
      width: 80,
      height: 80,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
      position: 'absolute',
      left: 0,
    },
    stop_timer_icon: {
      width: 100,
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      bottom: 0,
      marginBottom: 36,
    },
    stop_timer_image: {
      width: 76,
      height: 76,
      tintColor: '#D08770',
    },
    save_icon: {
      width: 100,
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      bottom:10,
    },
    save_text: {
      fontFamily: 'RobotoMono',
      fontSize: 30,
      color: '#434C5E',
      fontStyle: 'normal',
      fontWeight: '300',
      textAlign: 'center',
      marginLeft: 20,
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // This will give a semi-transparent dark background
      width: '120%',
      height: '140%',
      position: 'absolute',
      top: '-20%',
      left: '-10%',
      padding: 10,
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    modalTextTitle: {
      textAlign: "left",
      fontSize: 30,
      fontWeight: 'bold',
      paddingBottom: 30,
    },
    modalText: {
      textAlign: "left",
      fontSize: 20,
      paddingBottom: 20,
    },
    modalCloseIcon: {
      color: '#434C5E',
      position: 'absolute',
      right: 0,
      // borderWidth: 1,
      // borderColor: '#434C5E',
      width: 60,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
    },
});