import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { UserType } from '../UserContext';
import { useNavigation } from '@react-navigation/native';
import UserChat from '../components/UserChat';

const ChatsScreen = () => {
    const [acceptedFriends, setAcceptedFriends] = useState([]);
    const { userId, setUserId } = useContext(UserType);
    const navigation = useNavigation();

    useEffect(() => {
        const acceptedFriendList = async () => {
            try {
                const response = await fetch(`http://192.168.8.103:8000/accepted-friends/${userId}`)
                const data = await response.json();
                if (response.ok) {
                    setAcceptedFriends(data);
                    console.log(data);
                }
            } catch (err) {
                console.log(err);
            }
        }
        acceptedFriendList();

    }, [])

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Pressable>
                {acceptedFriends.map((item,index) => (
                    <UserChat key={index} item={item} />
                ))}
            </Pressable>

        </ScrollView>
    )
}

export default ChatsScreen

const styles = StyleSheet.create({})