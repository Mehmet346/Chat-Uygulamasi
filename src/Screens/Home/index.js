import React from 'react';
import {View,TouchableOpacity,Text,SafeAreaView,FlatList,ImageBackground } from 'react-native';
import auth from '@react-native-firebase/auth';
import firebase from "@react-native-firebase/app";
import Icon from 'react-native-vector-icons/FontAwesome5';
import database from '@react-native-firebase/database';
import RoomItem from "../../Components/Rooms/RoomItem";
export default class index extends React.Component
{
    constructor() {
        super();
        this.state = {
            rooms: []
        }
    }

    static navigationOptions = ( { navigation }) => {
        return {
            title:'Sohbet Odaları',
            headerTitleAlign: 'center',
            headerLeft:<TouchableOpacity style={{marginLeft:15}} onPress={()=>navigation.navigate('ChatRoomCreate')}><Icon color={"#ddd"} name={"plus"} size={25}/></TouchableOpacity>,
            headerRight:<TouchableOpacity onPress={() => {auth().signOut().then(() => {navigation.navigate('Auth');}); }} style={{ marginRight:15,padding:5 }}><Icon color={"#ddd"} name={"sign-out-alt"} size={25}/></TouchableOpacity>,
            headerStyle: {
                backgroundColor: '#21ABA5',
                borderBottomRightRadius: 5,
                borderBottomLeftRadius: 5,
              },
              headerTitleStyle: {
                color: '#fff'
              },
              headerTintColor: 'white',
        }
        

    }

    getData = () => {
        database()
            .ref('/rooms')
            .orderByChild('name')
            .on('value',snapshot =>{
                var rooms = [];
                snapshot.forEach((item)=>{
                    rooms.push({
                        name:item.val().name,
                        userName:item.val().userName,
                        userId:item.val().userId,
                        id:item.key
                    })

                })
                this.setState({ rooms})
            });
    };


    componentDidMount() {
        const user = firebase.auth().currentUser;
        this.getData();
        /*
        this.props.navigation.addListener('willFocus',()=>{
            this.getData();
        })
         */

    }

    renderItem = ({ item }) => {
        return <RoomItem item={item}/>
    }

    render() {
    return(
    <SafeAreaView style={{flex:1}}>
        <ImageBackground 
          source={{uri: 'https://i.pinimg.com/564x/bd/df/04/bddf04ab2f81d93aa0e32a417879e904.jpg'}}
          style={{ flex: 1,
            width: null,
            height: null,
            }}
        >
            <FlatList
               style={{ flex:1,padding:5}}
                data={this.state.rooms}
                renderItem={this.renderItem}    
            />
        </ImageBackground >
    </SafeAreaView>
    )}
}
