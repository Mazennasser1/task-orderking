import {create} from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Keep a module-scoped timer reference to avoid multiple timers
let autoLogoutTimerId = null;

const decodeJwtExpMs = (token) => {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
        let jsonString = "";
        if (typeof atob === "function") {
            jsonString = decodeURIComponent(
                atob(padded)
                    .split("")
                    .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
            );
        } else if (typeof Buffer !== "undefined") {
            jsonString = Buffer.from(padded, "base64").toString("utf8");
        } else {
            return null;
        }
        const payload = JSON.parse(jsonString);
        if (!payload || !payload.exp) return null;
        return payload.exp * 1000;
    } catch {
        return null;
    }
};

const scheduleAutoLogout = async (logoutFn, token) => {
    // Clear any previous timer
    if (autoLogoutTimerId) {
        clearTimeout(autoLogoutTimerId);
        autoLogoutTimerId = null;
    }
    const expMs = decodeJwtExpMs(token);
    if (!expMs) return;
    const delayMs = expMs - Date.now();
    if (delayMs <= 0) {
        // Already expired
        await logoutFn();
        return;
    }
    autoLogoutTimerId = setTimeout(() => {
        logoutFn();
    }, delayMs);
};

export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isLoading: false,
    isAuthenticated: false,

    register: async (username,email,password) => {
        set({ isLoading: true });
        try {
            const response = await fetch('http://192.168.1.6:2025/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }
            await AsyncStorage.setItem("user", JSON.stringify(data.user));
            await AsyncStorage.setItem('token', data.token);

            set({ user: data.user, token: data.token, isAuthenticated: true });
            // Schedule auto logout when token expires
            await scheduleAutoLogout(() => useAuthStore.getState().logout(), data.token);

            return {success:true,isLoading:false};


        }catch (error) {
            set({ isLoading: false });
            console.error("Registration error:", error);
            return {success:false, message: error.message};
        }
    },
    login: async (email,password) => {
        set({ isLoading: true });
        try {
            const response = await fetch('http://192.168.1.6:2025/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }
            await AsyncStorage.setItem("user", JSON.stringify(data.user));
            await AsyncStorage.setItem('token', data.token);

            set({ user: data.user, token: data.token, isAuthenticated: true });
            // Schedule auto logout when token expires
            await scheduleAutoLogout(() => useAuthStore.getState().logout(), data.token);

            return {success:true};

        }catch (error) {
            set({ isLoading: false });
            console.error("Login error:", error);
            return {success:false, message: error.message};
        }
    },
    checkAuth: async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const userJson = await AsyncStorage.getItem("user");
            const user = userJson ? JSON.parse(userJson) : null;
            set({ token, user });
            if (token) {
                // Schedule auto logout based on stored token
                await scheduleAutoLogout(() => useAuthStore.getState().logout(), token);
            }
        } catch (error) {
            console.log("Auth check failed", error);
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    logout: async () => {
        set({ isLoading: true });
        try {
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('token');
            // Clear any auto-logout timer
            if (autoLogoutTimerId) {
                clearTimeout(autoLogoutTimerId);
                autoLogoutTimerId = null;
            }
            set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            console.error("Logout error:", error);
        }
    },
}));