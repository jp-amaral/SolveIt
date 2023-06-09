import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#434C5E',
    },
    cube_icon: {
      width: 150,
      height: 150,
      marginLeft: '50%',
      marginTop: '-10%',
      tintColor: '#E5E9F0',
      transform: [{ rotate: '9deg'}],
    },
    main_text: {
      color: '#E5E9F0',
      fontSize: 54,
      textAlign: 'left',
      marginTop: '30%',
      marginLeft: '8%',
      lineHeight: 70,
      fontStyle: 'normal',
      fontFamily: 'RobotoMono',
    },
    top_view: {
      flex: 0.55, 
      backgroundColor: '#434C5E'
    },
    bottom_view: {
      flex: 0.45, 
      backgroundColor: '#E5E9F0',
      borderTopRightRadius: 26,
      borderTopLeftRadius: 26,
      justifyContent: 'center',
      alignItems: 'center',
    },
    input_text: {
      fontFamily: 'RobotoMono',
      fontSize: 26,
      color: '#434C5E',
      fontStyle: 'normal',
      fontWeight: '300',
      textAlign: 'center',
      width: 100,
    },
    input_text_selected: {
      fontFamily: 'RobotoMono',
      fontSize: 36,
      color: '#434C5E',
      fontStyle: 'normal',
      fontWeight: '300',
      textAlign: 'center',
      opacity: 1,
      width: 100,
    },
    profile: {
      position: 'absolute',
      top: 0,
      right: 0,
      marginTop: '12%',
      marginRight: '3%',
      color: '#E5E9F0',
    },
    play_icon: {
      position: 'absolute',
      bottom: 0,
      marginBottom: '5%',
      color: '#434C5E',
    },
  });