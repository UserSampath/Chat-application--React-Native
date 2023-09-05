import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const UserChat = ({ item }) => {
    const navigation = useNavigation();

    return (
        <Pressable onPress={() => navigation.navigate("Messages", { recepientId: item._id })} style={{ flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 0.7, padding: 10, borderColor: "#D0D0D0", borderTop: 0, borderLeft: 0, borderRight: 0 }}>
            <Image style={{ width: 50, height: 50, borderRadius: 25, resizeMode: "cover" }} source={{ uri: item?.image }} />

            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: "500" }}>{item.name}</Text>
                <Text style={{ marginTop: 3, color: "gray", fontWeight: "500" }}>last message</Text>
            </View>
            <View>
                <Text style={{ fontSize: 11, fontWeight: "400", color: "#585858" }}>3:00 pm</Text>
            </View>

        </Pressable>
    )
}

export default UserChat

const styles = StyleSheet.create({})