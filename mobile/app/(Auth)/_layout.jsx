import {View,Text} from 'react-native'
import {SafeAreaProvider} from "react-native-safe-area-context";
import {Stack} from "expo-router";
import SafeScreen from "../../components/SafeScreen";
export default function AuthLayout(){
    return(
        <SafeAreaProvider>
            <SafeScreen>
                <Stack screenOptions={{headerShown:false}}>

                </Stack>
            </SafeScreen>
        </SafeAreaProvider>
    )
}