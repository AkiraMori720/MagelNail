import { StyleSheet } from "react-native";

export default StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e5e8'
    },
    titleText: {
        color: 'grey',
        fontSize: 12,
        textTransform: 'uppercase'
    },
    itemText: {
        color: 'black',
        fontSize: 16
    }
});
