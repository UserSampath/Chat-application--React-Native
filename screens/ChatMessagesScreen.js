import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, TextInput, Pressable } from 'react-native'
import React from 'react'
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
const ChatMessagesScreen = () => {
    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#f0f0f0" }}>
            <ScrollView>
                {/* all the chat messages go here */}
            </ScrollView>

            <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: "#dddddd", marginBottom: 25 }}>
                <Entypo style={{ marginRight: 5 }} name="emoji-happy" size={24} color="gray" />
                <TextInput style={{ flex: 1, height: 40, borderWidth: 1, borderColor: "#dddddd", borderRadius: 20, paddingHorizontal: "10" }} placeholder='Type your message..' />
                <View style={{ flexDirection: "row", alignItems: "center", gap: 7, marginHorizontal: 8 }}>
                    <Entypo name="camera" size={24} color="gray" />
                    <Feather name="mic" size={24} color="gray" />
                </View>

                <Pressable style={{ backgroundColor: "#007bff", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, }}>
                    <Text style={{color:"white",fontWeight:"bold"}}>
                        Send
                    </Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    )
}

export default ChatMessagesScreen

const styles = StyleSheet.create({})