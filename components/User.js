import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { UserType } from '../UserContext'
import axios from 'axios';

const User = ({ item }) => {
    const { userId, setUserId } = useContext(UserType)
    const [requestSent, setRequestSent] = useState(false);
    const sendFriendRequest = async (currentUserId, selectedUserId) => {
        try {
            const response = await fetch("http://192.168.8.100:8000/friend-request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ currentUserId, selectedUserId }),
            });

            if (response.ok) {
                setRequestSent(true);
                console.log("Request sent successfully");
            } else {
                console.log("Request failed with status:", response.status);
            }
        } catch (err) {
            console.log("Error:", err);
        }
    };
    return (
        <Pressable style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }} >
            <View>
                <Image style={{ width: 50, height: 50, borderRadius: 25, resizeMode: "cover" }} source={{ uri: item.image }} />
            </View>
            <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ fontWeight: "bold" }}>{item?.name}</Text>
                <Text style={{ marginTop: 3, color: "gray" }}>{item?.email}</Text>

            </View>
            <Pressable
                onPress={() => sendFriendRequest(userId, item._id)}
                style={{ backgroundColor: "#567189", padding: 10, borderRadius: 6, width: 105 }}>
                <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
                    Add friend
                </Text>
            </Pressable>
        </Pressable>
    )
}

export default User

const styles = StyleSheet.create({})