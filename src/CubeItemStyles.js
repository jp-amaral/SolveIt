import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const itemWidth = width * 0.35; // adjust this value as needed


export const styles = StyleSheet.create({

    container: {
        borderColor: '#D8DEE9',
        // borderWidth: 1,
    },
    cube : {
        width: 130,
        height: 157,
        resizeMode: 'contain',
        marginHorizontal: 24,
        marginBottom: 24,
    },
    default_text: {
        fontFamily: 'RobotoMono',
        fontSize: 30,
        color: '#434C5E',
        fontWeight: '300',
        paddingLeft: 30,
        borderColor: '#434C5E',
        // borderWidth: 1,
        position: 'absolute',
    },
});