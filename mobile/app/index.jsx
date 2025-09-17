import { Text, View, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import QRCode from 'react-native-qrcode-svg';
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";

export default function Index() {
    const { user, token, checkAuth, logout } = useAuthStore();
    const [uuid, setUuid] = useState(null);
    const [loading, setLoading] = useState(true);

    console.log("user from store", user);
    console.log('token from store', token);

    const fetchUUID = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://192.168.1.6:2025/qr/current', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch UUID');
            }
            setUuid(data.uuid);
        } catch (err) {
            console.error('Error fetching UUID:', err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // fetch immediately
        fetchUUID();

        // refresh every 60 seconds
        const interval = setInterval(fetchUUID, 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                {/* HEADER */}
                <View style={styles.header}>
                    <View style={styles.welcomeSection}>
                        <Ionicons
                            name="person-circle-outline"
                            size={32}
                            color={COLORS.primary}
                            style={styles.userIcon}
                        />
                        <Text style={styles.welcomeText}>Welcome back,</Text>
                        <Text style={styles.username}>{user?.username}</Text>
                    </View>
                </View>

                {/* QR CODE SECTION */}
                <View style={styles.qrSection}>
                    <Text style={styles.qrTitle}>Your QR Code</Text>
                    <Text style={styles.qrSubtitle}>Present this code for verification</Text>

                    <View style={styles.qrContainer}>
                        {loading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={COLORS.primary} />
                                <Text style={styles.loadingText}>Generating QR Code...</Text>
                            </View>
                        ) : (
                            <>
                                {uuid && (
                                    <View style={styles.qrCodeWrapper}>
                                        <QRCode
                                            value={uuid}
                                            size={200}
                                            backgroundColor={COLORS.white}
                                            color={COLORS.textDark}
                                        />
                                    </View>
                                )}
                                <Text style={styles.uuidText}>{uuid}</Text>
                                <View style={styles.refreshIndicator}>
                                    <Ionicons
                                        name="refresh-outline"
                                        size={16}
                                        color={COLORS.textSecondary}
                                    />
                                    <Text style={styles.refreshText}>Auto-refreshes every 60 seconds</Text>
                                </View>
                            </>
                        )}
                    </View>
                </View>

                {/* LOGOUT BUTTON */}
                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <Ionicons
                        name="log-out-outline"
                        size={20}
                        color={COLORS.white}
                        style={styles.logoutIcon}
                    />
                    <Text style={styles.logoutText}>Sign Out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 20,
        justifyContent: "center",
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
    welcomeSection: {
        alignItems: "center",
    },
    userIcon: {
        marginBottom: 8,
    },
    welcomeText: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: "center",
        marginBottom: 4,
    },
    username: {
        fontSize: 24,
        fontWeight: "700",
        fontFamily: "JetBrainsMono-Medium",
        color: COLORS.primary,
        textAlign: "center",
    },
    qrSection: {
        alignItems: "center",
        marginBottom: 32,
    },
    qrTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: COLORS.textPrimary,
        marginBottom: 8,
        textAlign: "center",
    },
    qrSubtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: "center",
        marginBottom: 24,
    },
    qrContainer: {
        alignItems: "center",
        width: "100%",
    },
    loadingContainer: {
        alignItems: "center",
        justifyContent: "center",
        height: 200,
        width: 200,
        backgroundColor: COLORS.inputBackground,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: "center",
    },
    qrCodeWrapper: {
        padding: 16,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    uuidText: {
        marginTop: 16,
        fontSize: 12,
        color: COLORS.textSecondary,
        textAlign: "center",
        fontFamily: "monospace",
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: COLORS.inputBackground,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    refreshIndicator: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12,
    },
    refreshText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginLeft: 4,
    },
    logoutButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        height: 50,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    logoutIcon: {
        marginRight: 8,
    },
    logoutText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "600",
    },
});