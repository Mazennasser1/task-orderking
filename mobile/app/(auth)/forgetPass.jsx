import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import SafeScreen from "../../components/SafeScreen";

export default function ForgetPass() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!email.trim()) {
            Alert.alert("Validation", "Please enter your email");
            return;
        }
        try {
            setIsSubmitting(true);
            const response = await fetch("http://192.168.1.6:2025/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim() }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to send reset email");
            }
            Alert.alert("Success", data.message || "Reset instructions sent to your email");
            router.push({ pathname: "/(auth)/resetPass", params: { email: email.trim() } });
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeScreen>
            <View style={styles.container}>
                <Text style={styles.title}>Forgot Password</Text>
                <Text style={styles.subtitle}>Enter your email to receive reset instructions.</Text>

                <View style={styles.field}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="you@example.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={styles.input}
                    />
                </View>

                <TouchableOpacity style={[styles.button, isSubmitting && styles.buttonDisabled]} onPress={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send Reset Email</Text>}
                </TouchableOpacity>

                <TouchableOpacity style={styles.linkBtn} onPress={() => router.replace("/(auth)/login")}> 
                    <Text style={styles.linkText}>Back to Login</Text>
                </TouchableOpacity>
            </View>
        </SafeScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 24,
        gap: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        marginTop: 12,
    },
    subtitle: {
        fontSize: 14,
        color: "#6b7280",
        marginBottom: 8,
    },
    field: {
        marginTop: 8,
        gap: 8,
    },
    label: {
        fontSize: 14,
        color: "#374151",
    },
    input: {
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 10,
        paddingHorizontal: 14,
        height: 48,
        backgroundColor: "#fff",
    },
    button: {
        backgroundColor: "#111827",
        height: 50,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 12,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    linkBtn: {
        alignItems: "center",
        marginTop: 8,
    },
    linkText: {
        color: "#2563eb",
        fontSize: 14,
        fontWeight: "500",
    },
});


