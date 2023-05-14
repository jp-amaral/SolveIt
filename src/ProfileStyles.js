import { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '10%',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  back_icon: {
    color: '#434C5E',
    position: 'absolute',
    left: 0,
    paddingLeft: 20,
    top: 40,
  },
  delete_icon: {
    color: '#D08770',
    position: 'absolute',
    right: 0,
    paddingRight: 20,
    top: 40,
  },
  main_text: {
    fontFamily: 'RobotoMono',
    fontSize: 30,
    color: '#434C5E',
    fontStyle: 'normal',
    fontWeight: '300',
    textAlign: 'center',
    marginTop: '38%',
  },  
  time_text: {
    fontFamily: 'RobotoMono',
    fontSize: 80,
    color: '#A3BE8C',
    fontStyle: 'normal',
    fontWeight: '300',
    textAlign: 'center',
    marginTop: '10%',
    marginBottom: '10%',
  },  
  previous_text: {
    fontFamily: 'RobotoMono',
    fontSize: 30,
    color: '#434C5E',
    fontStyle: 'normal',
    fontWeight: '300',
    textAlign: 'center',
  },
  list: {
    width: '100%',
    height: '40%',
    marginBottom: '15%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '15%',
  },
});
