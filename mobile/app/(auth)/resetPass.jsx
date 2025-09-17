import { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Platform,
    KeyboardAvoidingView,
    ScrollView
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import SafeScreen from "../../components/SafeScreen";
import COLORS from "../../constants/colors";


export default function ResetPass() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (typeof params.email === "string") setEmail(params.email);
        if (typeof params.code === "string") setCode(params.code);
    }, [params]);

    const handleSubmit = async () => {
        if (!email.trim()) {
            Alert.alert("Validation", "Missing email");
            return;
        }
        if (!code.trim()) {
            Alert.alert("Validation", "Missing reset code");
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
                body: JSON.stringify({ email: email.trim(), code: code.trim(), newPassword: password }),
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
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.container}>
                        <View style={styles.card}>
                            {/* HEADER */}
                            <View style={styles.header}>
                                <Ionicons
                                    name="key-outline"
                                    size={48}
                                    color={COLORS.primary}
                                    style={styles.headerIcon}
                                />
                                <Text style={styles.title}>Reset Password</Text>
                                <Text style={styles.subtitle}>
                                    Enter the token from your email and create a new secure password.
                                </Text>
                            </View>

                            <View style={styles.formContainer}>
                                {/* EMAIL INPUT */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Email (Optional)</Text>
                                    <View style={styles.inputContainer}>
                                        <Ionicons
                                            name="mail-outline"
                                            size={20}
                                            color={COLORS.primary}
                                            style={styles.inputIcon}
                                        />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="you@example.com"
                                            placeholderTextColor={COLORS.placeholderText}
                                            value={email}
                                            onChangeText={setEmail}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                        />
                                    </View>
                                </View>

                                {/* CODE INPUT */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Reset Code</Text>
                                    <View style={styles.inputContainer}>
                                        <Ionicons
                                            name="key-outline"
                                            size={20}
                                            color={COLORS.primary}
                                            style={styles.inputIcon}
                                        />
                                        <TextInput
                                            value={code}
                                            onChangeText={setCode}
                                            placeholder="6-digit code"
                                            keyboardType="number-pad"
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            maxLength={6}
                                            style={styles.input}
                                        />
                                    </View>
                                </View>

                                {/* PASSWORD INPUT */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>New Password</Text>
                                    <View style={styles.inputContainer}>
                                        <Ionicons
                                            name="lock-closed-outline"
                                            size={20}
                                            color={COLORS.primary}
                                            style={styles.inputIcon}
                                        />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter new password"
                                            placeholderTextColor={COLORS.placeholderText}
                                            value={password}
                                            onChangeText={setPassword}
                                            secureTextEntry={!showPassword}
                                        />
                                        <TouchableOpacity
                                            onPress={() => setShowPassword(!showPassword)}
                                            style={styles.eyeIcon}
                                        >
                                            <Ionicons
                                                name={showPassword ? "eye-outline" : "eye-off-outline"}
                                                size={20}
                                                color={COLORS.primary}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* CONFIRM PASSWORD INPUT */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Confirm Password</Text>
                                    <View style={styles.inputContainer}>
                                        <Ionicons
                                            name="checkmark-circle-outline"
                                            size={20}
                                            color={COLORS.primary}
                                            style={styles.inputIcon}
                                        />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Confirm new password"
                                            placeholderTextColor={COLORS.placeholderText}
                                            value={confirmPassword}
                                            onChangeText={setConfirmPassword}
                                            secureTextEntry={!showConfirmPassword}
                                        />
                                        <TouchableOpacity
                                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                            style={styles.eyeIcon}
                                        >
                                            <Ionicons
                                                name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                                                size={20}
                                                color={COLORS.primary}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* SUBMIT BUTTON */}
                                <TouchableOpacity
                                    style={[styles.button, isSubmitting && styles.buttonDisabled]}
                                    onPress={handleSubmit}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <ActivityIndicator color={COLORS.white} />
                                    ) : (
                                        <>
                                            <Ionicons
                                                name="shield-checkmark-outline"
                                                size={20}
                                                color={COLORS.white}
                                                style={styles.buttonIcon}
                                            />
                                            <Text style={styles.buttonText}>Reset Password</Text>
                                        </>
                                    )}
                                </TouchableOpacity>

                                {/* FOOTER */}
                                <View style={styles.footer}>
                                    <Text style={styles.footerText}>Remember your password?</Text>
                                    <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
                                        <Text style={styles.link}>Back to Login</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeScreen>
    );
}

const styles = {
    container: {
        flexGrow: 1,
        backgroundColor: COLORS.background,
        padding: 20,
        justifyContent: "center",
        minHeight: "100%",
    },
    card: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: 16,
        padding: 24,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 2,
        borderColor: COLORS.border,
    },
    header: {
        alignItems: "center",
        marginBottom: 32,
    },
    headerIcon: {
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        fontFamily: "JetBrainsMono-Medium",
        color: COLORS.primary,
        marginBottom: 12,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: "center",
        lineHeight: 22,
    },
    formContainer: {
        marginBottom: 16
    },
    inputGroup: {
        marginBottom: 20
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
        color: COLORS.textPrimary,
        fontWeight: "500",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.inputBackground,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: 12,
    },
    inputIcon: {
        marginRight: 10
    },
    input: {
        flex: 1,
        height: 48,
        color: COLORS.textDark,
        fontSize: 16,
    },
    eyeIcon: {
        padding: 8
    },
    button: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        height: 50,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 16,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonIcon: {
        marginRight: 8,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "600",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 24,
    },
    footerText: {
        color: COLORS.textSecondary,
        marginRight: 5,
        fontSize: 14,
    },
    link: {
        color: COLORS.primary,
        fontWeight: "600",
        fontSize: 14,
    },
};

