import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
    },
    itemContainer: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemContent: {
        flexDirection: 'column',
        marginLeft: 8
    },
    itemImage: {
        width: 48,
        height: 48,
        borderRadius: 24
    },
    itemText: {
        color: 'black',
    },
    itemAction: {
        width: 102,
        height: 24,
        resizeMode: 'contain',
        alignItems: 'center',
        justifyContent: 'center'
    },
    actionText: {
        marginLeft: 16
    },
    emptyContainer: {
        flexGrow:1,
        alignItems: 'center',
        marginTop: 40
    },
    emptyText:{
        fontSize: 16,
        fontWeight: 'bold'
    }
});
