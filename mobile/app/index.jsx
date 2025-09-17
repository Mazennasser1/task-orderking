import { Text, View, TouchableOpacity, StyleSheet, ActivityIndicator, Modal, ScrollView } from "react-native";
import QRCode from 'react-native-qrcode-svg';
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";
import { useTheme } from "../components/ThemeProvider";

export default function Index() {
    const { theme, toggleTheme } = useTheme();
    const { user, token, checkAuth, logout, getUserInfo } = useAuthStore();
    const [uuid, setUuid] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showUserModal, setShowUserModal] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [loadingUserInfo, setLoadingUserInfo] = useState(false);

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

    const handleUserInfoPress = async () => {
        setLoadingUserInfo(true);
        const result = await getUserInfo();
        if (result.success) {
            setUserInfo(result.user);
            setShowUserModal(true);
        } else {
            console.error('Failed to fetch user info:', result.message);
        }
        setLoadingUserInfo(false);
    }

    useEffect(() => {
        // fetch immediately
        fetchUUID();

        // refresh every 60 seconds
        const interval = setInterval(fetchUUID, 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
                {/* HEADER */}
                <View style={styles.header}>
                    <View style={styles.welcomeSection}>
                        <TouchableOpacity onPress={handleUserInfoPress} disabled={loadingUserInfo}>
                        <Ionicons
                            name="person-circle-outline"
                            size={32}
                            color={theme.primary}
                            style={styles.userIcon}
                        />
                        </TouchableOpacity>
                        <Text style={[styles.welcomeText, { color: theme.textSecondary }]}>Welcome back,</Text>
                        <Text style={[styles.username, { color: theme.primary }]}>{user?.username}</Text>
                    </View>
                    <TouchableOpacity onPress={toggleTheme} style={{ position: 'absolute', right: 0, top: 0, padding: 6 }}>
                        <Ionicons name="contrast-outline" size={20} color={theme.textPrimary} />
                    </TouchableOpacity>
                </View>

                {/* QR CODE SECTION */}
                <View style={styles.qrSection}>
                    <Text style={[styles.qrTitle, { color: theme.textPrimary }]}>Your QR Code</Text>
                    <Text style={[styles.qrSubtitle, { color: theme.textSecondary }]}>Present this code for verification</Text>

                    <View style={styles.qrContainer}>
                        {loading ? (
                            <View style={[styles.loadingContainer, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}>
                                <ActivityIndicator size="large" color={theme.primary} />
                                <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Generating QR Code...</Text>
                            </View>
                        ) : (
                            <>
                                {uuid && (
                                    <View style={[styles.qrCodeWrapper, { backgroundColor: theme.white, borderColor: theme.border }]}>
                                        <QRCode
                                            value={uuid}
                                            size={200}
                                            backgroundColor={theme.white}
                                            color={theme.textDark}
                                        />
                                    </View>
                                )}
                                <Text style={[styles.uuidText, { color: theme.textSecondary, backgroundColor: theme.inputBackground, borderColor: theme.border }]}>{uuid}</Text>
                                <View style={styles.refreshIndicator}>
                                    <Ionicons
                                        name="refresh-outline"
                                        size={16}
                                        color={theme.textSecondary}
                                    />
                                    <Text style={[styles.refreshText, { color: theme.textSecondary }]}>Auto-refreshes every 60 seconds</Text>
                                </View>
                            </>
                        )}
                    </View>
                </View>

                {/* ACTION BUTTONS */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity style={[styles.userInfoButton, { borderColor: theme.primary, backgroundColor: theme.white }]} onPress={handleUserInfoPress} disabled={loadingUserInfo}>
                        <Ionicons
                            name="person-outline"
                            size={20}
                            color={theme.primary}
                            style={styles.userInfoIcon}
                        />
                        {loadingUserInfo ? (
                            <ActivityIndicator size="small" color={theme.primary} />
                        ) : (
                            <Text style={[styles.userInfoText, { color: theme.primary }]}>User Info</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.logoutButton, { backgroundColor: theme.primary }]} onPress={logout}>
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

            {/* USER INFO MODAL */}
            <Modal
                visible={showUserModal}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowUserModal(false)}
            >
                <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
                    <View style={[styles.modalHeader, { backgroundColor: theme.cardBackground, borderBottomColor: theme.border }]}>
                        <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>User Information</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowUserModal(false)}
                        >
                            <Ionicons name="close" size={24} color={theme.textPrimary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent}>
                        {userInfo && (
                            <View style={[styles.userInfoContainer, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
                                <View style={[styles.infoRow, { borderBottomColor: theme.border }]}>
                                    <Ionicons name="person-circle-outline" size={24} color={theme.primary} />
                                    <View style={styles.infoContent}>
                                        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Username</Text>
                                        <Text style={[styles.infoValue, { color: theme.textPrimary }]}>{userInfo.username}</Text>
                                    </View>
                                </View>

                                <View style={[styles.infoRow, { borderBottomColor: theme.border }]}>
                                    <Ionicons name="mail-outline" size={24} color={theme.primary} />
                                    <View style={styles.infoContent}>
                                        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Email</Text>
                                        <Text style={[styles.infoValue, { color: theme.textPrimary }]}>{userInfo.email}</Text>
                                    </View>
                                </View>

                                <View style={[styles.infoRow, { borderBottomColor: theme.border }]}>
                                    <Ionicons name="calendar-outline" size={24} color={theme.primary} />
                                    <View style={styles.infoContent}>
                                        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Member Since</Text>
                                        <Text style={[styles.infoValue, { color: theme.textPrimary }]}>
                                            {new Date(userInfo.createdAt).toLocaleDateString()}
                                        </Text>
                                    </View>
                                </View>

                                <View style={[styles.infoRow, { borderBottomColor: theme.border }]}>
                                    <Ionicons name="time-outline" size={24} color={theme.primary} />
                                    <View style={styles.infoContent}>
                                        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Last Updated</Text>
                                        <Text style={[styles.infoValue, { color: theme.textPrimary }]}>
                                            {new Date(userInfo.updatedAt).toLocaleDateString()}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </Modal>
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
    actionButtons: {
        flexDirection: "row",
        gap: 12,
    },
    userInfoButton: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        height: 50,
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: COLORS.primary,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    userInfoIcon: {
        marginRight: 8,
    },
    userInfoText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: "600",
    },
    logoutButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        height: 50,
        flex: 1,
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
    // Modal styles
    modalContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        paddingTop: 60,
        backgroundColor: COLORS.cardBackground,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: COLORS.textPrimary,
    },
    closeButton: {
        padding: 8,
    },
    modalContent: {
        flex: 1,
        padding: 20,
    },
    userInfoContainer: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: 16,
        padding: 20,
        borderWidth: 2,
        borderColor: COLORS.border,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    infoContent: {
        marginLeft: 16,
        flex: 1,
    },
    infoLabel: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        color: COLORS.textPrimary,
        fontWeight: "500",
    },
});