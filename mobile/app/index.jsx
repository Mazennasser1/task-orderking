import { Text, View,TouchableOpacity } from "react-native";
import {Link} from "expo-router";
import {useAuthStore} from "../store/authStore";
import {useEffect} from "react";

export default function Index() {

    const{user,token,checkAuth}=useAuthStore();
    console.log("user from store",user);
    useEffect(() => {
        checkAuth();
    },[])
    console.log("token from store",token);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>welcome,{user?.username}</Text>
        <Link href={"/(Auth)/signup"} >signUP</Link>
    </View>
  );
}
