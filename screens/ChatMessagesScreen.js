import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, TextInput, Pressable, Image } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import EmojiSelector from 'react-native-emoji-selector';
import { UserType } from '../UserContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker"
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

const ChatMessagesScreen = () => {
    const [showEmojiSelector, setShowEmojiSelector] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedImage, setSelectedImage] = useState("")
    const [recepientData, setRecepientData] = useState();
    const [messages, setMessages] = useState([]);
    const [selectedMessages, setSelectedMessages] = useState([]);

    const { userId, setUserId } = useContext(UserType);
    const route = useRoute();
    const { recepientId } = route.params;
    const navigation = useNavigation();

    const handleEmojiPress = () => {
        setShowEmojiSelector(!showEmojiSelector)

    }

    const fetchMessages = async () => {
        try {
            const response = await fetch(`http://192.168.8.100:8000/messages/${userId}/${recepientId}`)
            const data = await response.json();
            if (response.ok) {
                setMessages(data);
                console.log(data, "xxxxxxxx");
            } else {
                console.log("error showing messages", response.status.message)
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchMessages();
    }, [])

    useEffect(() => {
        const fetchRecepientData = async () => {
            try {

                const response = await fetch(`http://192.168.8.100:8000/user/${recepientId}`)
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

            const response = await fetch("http://192.168.8.100:8000/messages", {
                method: "POST",
                body: formData
            })

            if (response.ok) {
                setMessage("");
                setSelectedImage("");
                fetchMessages();
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
                    <Ionicons onPress={() => navigation.goBack()} name="arrow-back" size={24} color="black" />

                    {selectedMessages.length > 0 ? (
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: "500" }}>
                                {selectedMessages.length}
                            </Text>
                        </View>
                    ) : (
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Image style={{ width: 40, height: 40, borderRadius: 20, resizeMode: "cover" }} source={{ uri: recepientData?.image }} />
                            <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold" }}>{recepientData?.name} </Text>
                        </View>
                    )}




                </View>
            ),
            headerRight: () => selectedMessages.length > 0 ? (
                <View style={{ alignItems: "center", gap: 10, flexDirection: "row" }}>
                    <Ionicons name="md-arrow-redo-sharp" size={24} color="black" />
                    <Ionicons name="md-arrow-undo" size={24} color="black" />
                    <FontAwesome name="star" size={24} color="black" />
                    <MaterialIcons onPress={() => deleteMessages(selectedMessages)} name="delete" size={24} color="black" />
                </View>
            ) : null
        })
    }, [recepientData, selectedMessages])

    const deleteMessages = async (messageIds) => {
        try {
            const response = await fetch("http://192.168.8.100:8000/deleteMessages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ messages: messageIds })
            })

            if (response.ok) {
                setSelectedMessages((previousMessages) => previousMessages.filter((id) => !messageIds.includes(id)))
                fetchMessages();
            }
            else {
                console.log("Failed to delete")
            }


        } catch (err) {
            console.log(err, "deleteMessages error")
        }

    }

    const formatTime = (time) => {
        const options = { hour: "numeric", minute: "numeric" };
        return new Date(time).toLocaleString("en-US", options)
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        console.log(result);
        if (!result.canceled) {
            handleSend("image", result.uri)
        }


    }

    const handleSelectMessage = (message) => {
        //if message already selected
        const isSelected = selectedMessages.includes(message._id);
        if (isSelected) {
            setSelectedMessages((previousMessages) => previousMessages.filter((id) => id !== message._id))

        } else {
            setSelectedMessages((previousMessages) => [...previousMessages, message._id]);
        }
    };
    console.log(selectedMessages, "selectedMessages")

    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#f0f0f0" }}>
            <ScrollView>
                {messages.map((item, index) => {
                    if (item.messageType === "text") {
                        const isSelected = selectedMessages.includes(item._id);
                        return (
                            <Pressable onLongPress={() => handleSelectMessage(item)} key={index} style={[item?.senderId?._id === userId ? { alignSelf: "flex-end", backgroundColor: "#DCF8C6", padding: 8, maxWidth: "60%", borderRadius: 7, margin: 10 } : { alignSelf: "flex-start", backgroundColor: "white", padding: 8, borderRadius: 8, margin: 10, maxWidth: "60% " }, isSelected && { width: "100%", backgroundColor: "#f0ffff" }]}>
                                <Text style={{ fontSize: 13, textAlign: isSelected ? "right" : "left" }}>
                                    {item?.message}
                                </Text>
                                <Text style={{ textAlign: "right", fontSize: 9, color: "gray", marginTop: 5 }}>
                                    {formatTime(item.timeStamp)}
                                </Text>
                            </Pressable>
                        )
                    }
                    if (item.messageType === "image") {
                        const baseUrl = "/Users/SAMPATH/Desktop/appp/ChatApp/api/files/";
                        const imageUrl = item.imageUrl;
                        const filename = imageUrl.split("/").pop();
                        const source = { uri: baseUrl + "/" + filename };

                        return (
                            <Pressable key={index} style={[item?.senderId?._id === userId ? { alignSelf: "flex-end", backgroundColor: "#DCF8C6", padding: 8, maxWidth: "60%", borderRadius: 7, margin: 10 } : { alignSelf: "flex-start", backgroundColor: "white", padding: 8, borderRadius: 8, margin: 10, maxWidth: "60% " }]}>
                                <View>
                                    <Image source={source} style={{ width: 200, height: 200, borderRadius: 7 }} />
                                    <Text style={{ textAlign: "right", fontSize: 9, position: "absolute", right: 10, color: "white", marginTop: 5, bottom: 7 }}>
                                        {formatTime(item?.timeStamp)}
                                    </Text>
                                </View>
                            </Pressable>
                        )
                    }
                })}
            </ScrollView>

            <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: "#dddddd", marginBottom: showEmojiSelector ? 0 : 25 }}>
                <Entypo onPress={handleEmojiPress} style={{ marginRight: 5 }} name="emoji-happy" size={24} color="gray" />
                <TextInput value={message} onChangeText={(text) => setMessage(text)} style={{ flex: 1, height: 40, borderWidth: 1, borderColor: "#dddddd", borderRadius: 20, paddingHorizontal: "10" }} placeholder='Type your message..' />
                <View style={{ flexDirection: "row", alignItems: "center", gap: 7, marginHorizontal: 8 }}>
                    <Entypo onPress={pickImage} name="camera" size={24} color="gray" />
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