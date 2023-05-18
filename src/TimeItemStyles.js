import { StyleSheet, Dimensions } from 'react-native';



export const styles = StyleSheet.create({
    container: {
        borderColor: '#434C5E',
        // borderBottomWidth: 1,
        flexDirection: 'row',
        marginBottom: 0,
        height: 52,
    },
    date_text: {
        fontFamily: 'RobotoMono',
        fontSize: 32,
        color: '#434C5E',
        fontWeight: '300',
        marginLeft: 10,
    },
    best_date_text: {
        fontFamily: 'RobotoMono',
        fontSize: 32,
        color: '#A3BE8C',
        fontWeight: '300',
        marginLeft: 10,
    },
    time_text: {
        fontFamily: 'RobotoMono',
        fontSize: 32,
        color: '#434C5E',
        fontWeight: '300',
        paddingLeft: 30,
        marginRight: 10,
    },
    best_time_text: {
        fontFamily: 'RobotoMono',
        fontSize: 32,
        color: '#A3BE8C',
        fontWeight: '300',
        paddingLeft: 30,
        marginRight: 10
    },
    border: {
        borderBottomColor: '#434C5E',
        borderBottomWidth: 1,
        width: '94%',
        position: 'absolute',
        bottom: 0,
        marginBottom: 8,
        marginLeft: '4%',
    },

}); 