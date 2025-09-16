import {create} from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

            return {success:true,isLoading:false};


        }catch (error) {
            set({ isLoading: false });
            console.error("Registration error:", error);
            return {success:false, message: error.message};
        }
    },
    login: async (credentials) => {
        set({ isLoading: true });
        try {
            const response = await fetch('http://localhost:2025/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }
            await AsyncStorage.setItem("user", JSON.stringify(data.user));
            await AsyncStorage.setItem('token', data.token);

            set({ user: data.user, token: data.token, isAuthenticated: true });

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
            set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            console.error("Logout error:", error);
        }
    },
}));