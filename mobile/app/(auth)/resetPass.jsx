import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import SafeScreen from "../../components/SafeScreen";

export default function ResetPass() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (typeof params.email === "string") setEmail(params.email);
        if (typeof params.token === "string") setToken(params.token);
        if (typeof params.userId === "string") setUserId(params.userId);
    }, [params]);

    const handleSubmit = async () => {
        if (!token.trim()) {
            Alert.alert("Validation", "Missing reset token");
            return;
        }
        if (!userId.trim()) {
            Alert.alert("Validation", "Missing user ID");
            return;
        }
        if (!password || password.length < 6) {
            Alert.alert("Validation", "Password must be at least 6 characters");
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("Validation", "Passwords do not match");
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await fetch("http://192.168.1.6:2025/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: token.trim(), userId: userId.trim(), newPassword: password }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to reset password");
            }
            Alert.alert("Success", data.message || "Password reset successfully", [
                { text: "OK", onPress: () => router.replace("/(auth)/login") },
            ]);
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeScreen>
            <View style={styles.container}>
                <Text style={styles.title}>Reset Password</Text>
                <Text style={styles.subtitle}>Enter the token from your email and choose a new password.</Text>

                <View style={styles.field}>
                    <Text style={styles.label}>Email (optional)</Text>
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

                <View style={styles.field}>
                    <Text style={styles.label}>Reset Token</Text>
                    <TextInput
                        value={token}
                        onChangeText={setToken}
                        placeholder="Enter token"
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={styles.input}
                    />
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>User ID</Text>
                    <TextInput
                        value={userId}
                        onChangeText={setUserId}
                        placeholder="Enter user ID"
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={styles.input}
                    />
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>New Password</Text>
                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Enter new password"
                        secureTextEntry
                        style={styles.input}
                    />
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Confirm Password</Text>
                    <TextInput
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Confirm new password"
                        secureTextEntry
                        style={styles.input}
                    />
                </View>

                <TouchableOpacity style={[styles.button, isSubmitting && styles.buttonDisabled]} onPress={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Reset Password</Text>}
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


