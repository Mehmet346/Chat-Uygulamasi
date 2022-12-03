import React, {Component} from 'react';
import {View, Text, TouchableOpacity,SafeAreaView,FlatList,TextInput,StyleSheet,ImageBackground} from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome5";
import auth from "@react-native-firebase/auth";
import Message from "../../../Components/Rooms/Message";
import io from 'socket.io-client/dist/socket.io';
import firebase from "@react-native-firebase/app";
import database from '@react-native-firebase/database';
const connectionConfig = {
    jsonp: false,
    reconnection: true,
    reconnectionDelay: 100,
    reconnectionAttempts: 100000,
    transports: ['websocket'],
};

var socket = io('http://localhost:3000',connectionConfig);
export default class Index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages:[],
            text:'',
            connectedUserCount:0,
        }
    }


    static navigationOptions = ( { navigation }) => {
        return {
            title: navigation.getParam("name"),
            headerTitleAlign: 'center',
            headerRight:(navigation.getParam("userId") == navigation.getParam("roomUserId")) ? <TouchableOpacity onPress={navigation.getParam("_handleDelete")} style={{ marginRight:15,padding:5 }} ><Icon name={"trash"} size={17} color={"red"}/></TouchableOpacity>:null,
            headerShown: true,
            headerTransparent:true,
        }
    }

    _handleDelete = async () => {
        const roomId = this.props.navigation.getParam("id");
        await database()
            .ref('/rooms/'+roomId)
            .remove();
        await database()
            .ref('/messages/'+roomId)
            .remove();
        this.props.navigation.goBack();
    };

    componentDidMount() {
        const user = firebase.auth().currentUser;
        const userId = user.uid;
        this.props.navigation.setParams({ userId,_handleDelete:this._handleDelete})
        const roomId = this.props.navigation.getParam("id");

        socket.emit('connection-room',{ roomId});
        socket.on('connection-room-view',(data)=>{
            this.setState({
                connectedUserCount:data.count
            })
        })



        database()
            .ref(`messages/${roomId}`)
            .on('value',snapshot =>{
                var messages = [];
                snapshot.forEach((item)=>{
                    messages.push({
                        roomId:item.val().roomId,
                        text:item.val().text,
                        userName:item.val().userName,
                        userId:item.val().userId,
                        id:item.key
                    })

                })
                this.setState({ messages});


            });


    }

    renderItem = ({ item,index  }) => {
        return <Message item={item} index={index} />
    }

    componentWillUnmount() {
        socket.emit('leave-room',{ roomId:this.props.navigation.getParam("id") });
    }

    handleSend = () => {
        const { text } = this.state;
        const roomId = this.props.navigation.getParam("id");

        const user = firebase.auth().currentUser;
        const userId = user.uid;
        const userName = user.displayName;
        var database = firebase.database().ref(`messages/${roomId}`);
        database.push({
            roomId,
            text,
            userId,
            userName
        }).then((result) =>{
           this.setState({ text : ''})
        }).catch((error) => console.log(error));
    }

    render() {
        const { text , messages } = this.state;
        return (
            <SafeAreaView style={{ flex:1}}>
                <ImageBackground 
                    source={{uri: 'https://i.pinimg.com/564x/bd/df/04/bddf04ab2f81d93aa0e32a417879e904.jpg'}}
                    style={{ flex: 1,
                    width: null,
                    height: null,
                }}
            >
                <FlatList
                    inverted
                    ref={(ref)=> this.flatListRef = ref}
                    data={messages.reverse()}
                    renderItem={this.renderItem}
                    style={style.flatlist} />
                <View style={style.input_area}>
                    <View style={{ flexDirection:'row',alignItems:'center',}}>
                    <TextInput
                        value={text}
                        onChangeText={(text)=>this.setState({ text})}
                        style={style.input}
                        placeholder={"Yazınız..."}
                    />
                    <TouchableOpacity onPress={this.handleSend}>
                        <Icon style={{ marginLeft:10 }} color={"#30B485"} name={"paper-plane"} size={25} />
                    </TouchableOpacity>
                    </View>
                </View>
                </ImageBackground>
            </SafeAreaView>
        );
    }
}

const style = StyleSheet.create({
    flatlist:{
        marginTop:50,
        flex:1,
        padding:15
    },
    input_area:{
        flexDirection:'column',
        justifyContent:'flex-end',
        padding:15,

    },
    input:{
        borderWidth:1,
        borderColor:'#ddd',
        height:40,
        flex:1,
        backgroundColor:'white',
        paddingHorizontal:20,
        color:'black',
        borderRadius:5
    }
});
