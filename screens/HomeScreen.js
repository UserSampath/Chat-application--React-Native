import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { UserType } from '../UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import User from '../components/User';


const HomeScreen = () => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [users, setUsers] = useState([])
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>Swift Chat</Text>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons onPress={() => navigation.navigate("Chats")} name="chatbox-ellipses-outline" size={24} color="black" />
          <MaterialIcons onPress={() => navigation.navigate("Friends")} name="people-outline" size={24} color="black" />
        </View>
      )
    })
  }, [])

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);

      axios.get(`http://192.168.8.100:8000/users/${userId}`).then((response) => {
        setUsers(response.data)
      }).catch((error) => {
        console.log("users", error);
      })
    }
    fetchUsers();
  }, [])
  console.log("users", users)
  return (
    <View>
      <View style={{ padding: 10 }}>
        {users && users.map((item, index) => (
          <User key={index} item={item} />
        ))}
      </View>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})