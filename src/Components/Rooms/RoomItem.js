import React from 'react';
import { View , Text,StyleSheet,TouchableOpacity} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5'
import NavigationService from "../NavigationService";

const RoomItem = ({ item }) => {
    return (<TouchableOpacity onPress={
        ()=>NavigationService.navigate('ChatRoomDetail',{
            id : item.id,
            name: item.name,
            roomUserId:item.userId
        })
    } style={style.item}>
        <Icon name={"user-circle"} size={50} />
        <View style={{ marginLeft:10}}>
            <Text style={style.title}>{item.name}</Text>
            <Text style={style.createdUser}>{item.userName}</Text>
        </View>
    </TouchableOpacity>)
};

const style = StyleSheet.create({
    item:{
        backgroundColor:'powderblue',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        
        elevation: 2,
        padding:10,
        marginBottom:5,
        
        borderRadius:16,
        flexDirection:'row',
        alignItems:'center',
    },
    title:{
        fontSize:20,
        color:'black',
        fontWeight:'600'
    },
    createdUser:{
        fontSize:13,
        color:'#a4a4a4'
    }
})
export default RoomItem;
