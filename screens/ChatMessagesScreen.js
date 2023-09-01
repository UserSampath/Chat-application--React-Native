import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, TextInput, Pressable, Image } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import EmojiSelector from 'react-native-emoji-selector';
import { UserType } from '../UserContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
const ChatMessagesScreen = () => {
    const [showEmojiSelector, setShowEmojiSelector] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedImage, setSelectedImage] = useState("")
    const [recepientData, setRecepientData] = useState();


    const { userId, setUserId } = useContext(UserType);
    const route = useRoute();
    const { recepientId } = route.params;
    const navigation = useNavigation();

    const handleEmojiPress = () => {
        setShowEmojiSelector(!showEmojiSelector)

    }


    useEffect(() => {
        const fetchRecepientData = async () => {
            try {

                const response = await fetch(`http://192.168.8.103:8000/user/${recepientId}`)
                const data = await response.json();
                setRecepientData(data)
                console.log(data, "aaaaaaaa")

            } catch (err) {
                console.log("getting user data error", err);
            }
        }
        fetchRecepientData();
    }, [])

    const handleSend = async (messageType, imageUri) => {
        try {
            const formData = new FormData();
            formData.append("senderId", userId);
            formData.append("recepientId", recepientId)

            // if the message type is image or normal text
            if (messageType === "image") {
                formData.append("messageType", "image");
                formData.append("imageFile", {
                    uri: imageUri,
                    name: "imageUri.jpg",
                    type: "image/jpeg"
                })
            } else {
                formData.append("messageType", "text");
                formData.append("messageText", message);
            }

            const response = await fetch("http://192.168.8.103:8000/messages", {
                method: "POST",
                body: formData
            })

            if (response.ok) {
                setMessage("");
                setSelectedImage("")
            }
        } catch (err) {
            console.log("error in sending message")
        }

    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "",
            headerLeft: () => (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Ionicons onPress={()=>navigation.goBack()} name="arrow-back" size={24} color="black" />
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Image style={{ width: 40, height: 40, borderRadius: 20, resizeMode: "cover" }} source={{ uri: recepientData?.image }} />
                        <Text style={{marginLeft:5,fontSize:15,fontWeight:"bold"}}>{recepientData?.name}</Text>
                    </View>

                </View>
            )
        })
    }, [recepientData])


    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#f0f0f0" }}>
            <ScrollView>
                {/* all the chat messages go here */}
            </ScrollView>

            <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: "#dddddd", marginBottom: showEmojiSelector ? 0 : 25 }}>
                <Entypo onPress={handleEmojiPress} style={{ marginRight: 5 }} name="emoji-happy" size={24} color="gray" />
                <TextInput value={message} onChangeText={(text) => setMessage(text)} style={{ flex: 1, height: 40, borderWidth: 1, borderColor: "#dddddd", borderRadius: 20, paddingHorizontal: "10" }} placeholder='Type your message..' />
                <View style={{ flexDirection: "row", alignItems: "center", gap: 7, marginHorizontal: 8 }}>
                    <Entypo name="camera" size={24} color="gray" />
                    <Feather name="mic" size={24} color="gray" />
                </View>

                <Pressable
                    onPress={() => handleSend("text")}
                    style={{ backgroundColor: "#007bff", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, }}>
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                        Send
                    </Text>
                </Pressable>
            </View>

            {
                showEmojiSelector && (
                    <EmojiSelector style={{ height: 250 }} onEmojiSelected={(emoji) => { setMessage((prevMessage) => prevMessage + emoji) }} />
                )
            }
        </KeyboardAvoidingView>
    )
}

export default ChatMessagesScreen

const styles = StyleSheet.create({})