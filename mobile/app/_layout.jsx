import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator } from "react-native";

export default function RootLayout() {
    const { user, token, checkAuth, isCheckingAuth } = useAuthStore();
    const router = useRouter();
    const segments = useSegments();
    const [isNavigationReady, setIsNavigationReady] = useState(false);

    useEffect(() => {
        checkAuth().finally(() => {
            setIsNavigationReady(true);
        });
    }, []);

    useEffect(() => {
        if (!isNavigationReady) return;

        const isSignedIn = user && token;
        const inAuthGroup = segments[0] === "(auth)";

        if (!isSignedIn && !inAuthGroup) {
            router.replace("/(auth)/login");
        } else if (isSignedIn && inAuthGroup) {
            router.replace("/");
        }
    }, [user, token, segments, isNavigationReady]);

    // Show loading screen while checking auth and navigation is not ready
    if (!isNavigationReady || isCheckingAuth) {
        return (
            <SafeAreaProvider>
                <SafeScreen>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator size="large" />
                    </View>
                </SafeScreen>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <SafeScreen>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="(auth)" />
                </Stack>
            </SafeScreen>
            <StatusBar style={"dark"} />
        </SafeAreaProvider>
    );
}