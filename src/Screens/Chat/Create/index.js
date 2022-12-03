import React, {Component} from 'react';
import {View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {Formik} from "formik";
import * as Yup from "yup";
import Icon from "react-native-vector-icons/FontAwesome5";
import database  from '@react-native-firebase/database';
import firebase from '@react-native-firebase/app';

export default class Index extends Component {

    static navigationOptions = ({navigation}) => {
        return{
            title: 'Oda Oluştur',
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: '#21ABA5',
                borderBottomRightRadius: 5,
                borderBottomLeftRadius: 5,
              },
              headerTitleStyle: {
                color: '#fff'
              },
              headerTintColor: 'white',
              headerShown: true,
              headerTransparent:true,
        }
    }

    _handleSubmit = (values,{ resetForm}) => {


        const user = firebase.auth().currentUser;
        const userId = user.uid;
        const userName = user.displayName;
        var database = firebase.database().ref('/rooms');
        database.push({
           name:values.name,
           userId,
           userName
        }).then((result) =>{
            resetForm({ values:''});
            this.props.navigation.goBack();
        })
            .catch((error) => console.log(error));


    };


    render() {
        return (
            <SafeAreaView style={{ flex:1}}>
                <View style={{ backgroundColor:'powderblue',justifyContent:'center',flex:1,paddingVertical:50,alignItems:'center'}}>

                    <Formik
                        initialValues={{
                            name:'',
                        }}
                        onSubmit={this._handleSubmit}
                        validationSchema={
                            Yup.object().shape({
                                name:Yup.string().required('Bu kısım boş bırakılamaz')
                            })
                        }
                    >
                        {
                            ({
                                 values,
                                 handleSubmit,
                                 isValid,
                                 isSubmitting,
                                 errors,
                                 handleChange
                             }) => (
                                <View style={style.form}>
                                    <TextInput
                                        value={values.name}
                                        onChangeText={handleChange('name')}
                                        placeholder={"Oda ismi giriniz"}
                                        placeholderTextColor={"#302D4C"}
                                        style={style.input}/>
                                    {(errors.name) && <Text style={style.error}>{errors.name}</Text>}


                                    <TouchableOpacity
                                        disabled={!isValid}
                                        onPress={handleSubmit}
                                        style={style.button}>
                                        <Text style={style.button_text}>Oda Oluştur</Text>
                                    </TouchableOpacity>


                                </View>
                            )
                        }
                    </Formik>
                </View>
            </SafeAreaView>
        );
    }
}


const style = StyleSheet.create({
    hero: { color:'#1C1939',fontWeight:'600',fontSize:40},
    hero_description:{ color:'rgba(26,25,57,0.8)',fontSize:17,marginTop:15,fontWeight:'500'},
    form:{ flex:1,marginTop:80},
    input:{
        backgroundColor:'#F7F7F7',
        padding:15,
        width:300,
        height:50,
        borderRadius:10,
        paddingHorizontal:25,
        marginBottom:10
    },
    forgot:{
        flexDirection:'row',justifyContent:'flex-end',
        marginTop:10,
        color:'#706E83'
    },
    button:{
        backgroundColor: '#7165E3',
        padding:20,
        marginTop:45,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems:'center'
    },
    button_text:{
        color:'white',
        fontWeight:'600',
        fontSize:18,
        textAlign:'center'
    },
    bottom:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center',
        marginTop:20,
    },
    error:{
        color:'red'
    }
})
