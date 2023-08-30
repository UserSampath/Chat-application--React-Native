import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const User = ({ item }) => {
    return (
        <Pressable style={{flexDirection:"row",alignItems:"center",marginVertical:10}} >
            <View>
            <Image style={{ width: 50, height: 50, borderRadius: 25, resizeMode: "cover" }} source={{ uri: item.image }} />
            </View>
            <View style={{marginLeft:12,flex:1}}>
                <Text style={{fontWeight:"bold"}}>{item?.name}</Text>
                <Text style={{marginTop:3,color:"gray"}}>{item?.email}</Text>

            </View>
            <Pressable style={{backgroundColor:"#567189",padding:10,borderRadius:6,width:105}}>
                <Text style={{textAlign:"center",color:"white",fontSize:13}}>
                    Add friend
                </Text>
            </Pressable>
        </Pressable>
    )
}

export default User

const styles = StyleSheet.create({})