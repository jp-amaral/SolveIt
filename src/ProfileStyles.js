import { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#E5E9F0',
  },
  back_icon: {
    color: '#434C5E',
    position: 'absolute',
    left: 0,
    paddingLeft: 20,
    top: 60,
  },
  delete_icon: {
    color: '#D08770',
    position: 'absolute',
    right: 0,
    paddingRight: 20,
    top: 60,
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
  main_text_alt: {
    fontFamily: 'RobotoMono',
    fontSize: 30,
    color: '#434C5E',
    fontStyle: 'normal',
    fontWeight: '300',
    textAlign: 'center',
    marginTop: '100%',
  }, 
  time_text: {
    fontFamily: 'RobotoMono',
    fontSize: 80,
    color: '#A3BE8C',
    fontStyle: 'normal',
    fontWeight: '300',
    textAlign: 'center',
    marginTop: '5%',
    marginBottom: '4%',
  },  
  line: {
    marginBottom: '5%',
    width: '80%',
    height: 1,
    backgroundColor: '#434C5E',
  },
  line2: {
    marginBottom: '5%',
    width: '80%',
    height: 1,
    backgroundColor: '#434C5E',
  },
  avg_time_text: {
    fontFamily: 'RobotoMono',
    fontSize: 80,
    color: '#434C5E',
    fontStyle: 'normal',
    fontWeight: '300',
    textAlign: 'center',
    marginTop: '4%',
    marginBottom: '4%',
  },  
  previous_text: {
    fontFamily: 'RobotoMono',
    fontSize: 30,
    color: '#434C5E',
    fontStyle: 'normal',
    fontWeight: '300',
    textAlign: 'center',
  },
  average_text: {
    fontFamily: 'RobotoMono',
    fontSize: 30,
    color: '#434C5E',
    fontStyle: 'normal',
    fontWeight: '300',
    textAlign: 'center',
  },
  list: {
    width: '100%',
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '8%',
    marginBottom: '8%',
  },
  image: {
    width: 100,
    height: 100,
    marginTop: '20%',
    marginBottom: '10%',
    tintColor: '#434C5E',
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
  gradientOverlay: {
    height: 100, // Adjust the height as needed
  },
});
