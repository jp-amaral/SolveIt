import { StyleSheet, Dimensions } from 'react-native';



export const styles = StyleSheet.create({
    container: {
        borderColor: '#434C5E',
        // borderBottomWidth: 1,
        flexDirection: 'row',
        marginBottom: 10,
        height: 52,
    },
    date_text: {
        fontFamily: 'RobotoMono',
        fontSize: 38,
        color: '#434C5E',
        fontWeight: '300',
        marginLeft: 10,
    },
    best_date_text: {
        fontFamily: 'RobotoMono',
        fontSize: 38,
        color: '#A3BE8C',
        fontWeight: '300',
        marginLeft: 10,
    },
    time_text: {
        fontFamily: 'RobotoMono',
        fontSize: 38,
        color: '#434C5E',
        fontWeight: 'bold',
        paddingLeft: 30,
        marginRight: 10,
    },
    best_time_text: {
        fontFamily: 'RobotoMono',
        fontSize: 38,
        color: '#A3BE8C',
        fontWeight: 'bold',
        paddingLeft: 30,
        marginRight: 10
    },
    border: {
        borderBottomColor: '#434C5E',
        borderBottomWidth: 1,
        width: '90%',
        position: 'absolute',
        bottom: 0,
        marginLeft: '5%',
    },

}); 