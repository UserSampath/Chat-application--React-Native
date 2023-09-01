import { Alert, KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { TextInput } from 'react-native'
import { Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';



export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState('');

  const navigation = useNavigation();

  const handelRegister = () => {
    const user = { name: name, email: email, password: password, image: image }
    //send a post request 
    axios.post("http://192.168.8.103:8000/register", user).then((response) => {
      console.log(response.data.message);
      Alert.alert(response.data.message,"Success")
      setName('');
      setPassword('');
      setEmail('');
      setImage('');
    }).catch((error) => { 
      Alert.alert("error","ddd")
      console.log(error);
    });
  }

  return (
    <View style={{ flex: 1, backgroundColor: "while", padding: 18, alignItems: "center" }}>
      <KeyboardAvoidingView>
        <View style={{ marginTop: 100, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "#4A55A2", fontSize: 17, fontWeight: "600" }}>
            Sign Up
          </Text>
          <Text style={{ fontSize: 17, fontWeight: "600", marginTop: 15 }}>
            Register to your account
          </Text>
        </View>
        <View style={{ marginTop: 50 }}>
          <View>
            <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 15 }}>
              name
            </Text>
            <TextInput value={name} onChangeText={(text) => setName(text)} style={{ fontSize: 18, borderBottomColor: "gray", borderBottomWidth: 1, marginVertical: 10, width: 300 }} placeholderTextColor={"black"} placeholder='enter your Name' />
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 15 }}>
              Email
            </Text>
            <TextInput value={email} onChangeText={(text) => setEmail(text)} style={{ fontSize: 18, borderBottomColor: "gray", borderBottomWidth: 1, marginVertical: 10, width: 300 }} placeholderTextColor={"black"} placeholder='enter your Email' />
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 15 }}>
              Password
            </Text>
            <TextInput secureTextEntry={true} value={password} onChangeText={(text) => setPassword(text)} style={{ fontSize: 18, borderBottomColor: "gray", borderBottomWidth: 1, marginVertical: 10, width: 300 }} placeholderTextColor={"black"} placeholder='enter your Password' />
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 15 }}>
              Image
            </Text>
            <TextInput value={image} onChangeText={(text) => setImage(text)} style={{ fontSize: 18, borderBottomColor: "gray", borderBottomWidth: 1, marginVertical: 10, width: 300 }} placeholderTextColor={"black"} placeholder='enter your image' />
          </View>
          <Pressable onPress={handelRegister} style={{ width: 200, backgroundColor: "#4A55A2", padding: 15, marginTop: 50, marginLeft: "auto", marginRight: "auto", borderRadius: 6 }}>
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold", textAlign: "center" }}>
              Register
            </Text>
          </Pressable>
          <Pressable style={{ marginTop: 20 }} onPress={() => navigation.goBack()}>
            <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
              already have an account ? Sign in
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({})