import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { UserType } from '../UserContext';
import FriendRequest from '../components/FriendRequest';

const FriendsScreen = () => {
    const { userId, setUserId } = useContext(UserType)
    const [friendRequests, sentFriendRequests] = useState([])
    useEffect(() => {
        fetchFriendRequests();
    }, [])

    const fetchFriendRequests = async () => {
        try {
            const response = await axios.get(`http://192.168.8.194:8000/friend-request/${userId}`)
            if (response.status === 200) {
                const friendRequestsData = response.data.map((friendRequest) => ({
                    _id: friendRequest._id,
                    name: friendRequest.name,
                    email: friendRequest.email,
                    image: friendRequest.image

                }))

                sentFriendRequests(friendRequestsData);
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <View style={{ padding: 10, marginHorizontal: 12 }}>
            {friendRequests.length > 0 && <Text> Your Friend Requests</Text>}
            {friendRequests.map((item, index) => (
                <FriendRequest key={index} item={item} friendRequests={friendRequests} sentFriendRequests={sentFriendRequests} />
            ))}
        </View>
    )
}

export default FriendsScreen

const styles = StyleSheet.create({})