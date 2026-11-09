import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { loginUser, registerUser } from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [userToken, setUserToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    const getUserId = (token) => {
        try {
            const decoded = jwtDecode(token);
            return decoded.id || null;
        } catch (error) {
            return null;
        }
    };

    useEffect(() => {
        loadToken();
    }, []);

    const loadToken = async () => {
        try {
            let token = await SecureStore.getItemAsync("userToken");

            if (!token) {
                const oldToken = await AsyncStorage.getItem("userToken");

                if (oldToken) {
                    await SecureStore.setItemAsync("userToken", oldToken);
                    await AsyncStorage.removeItem("userToken");
                    token = oldToken;
                }
            }

            if (token) {
                const id = getUserId(token);

                if (id) {
                    setUserToken(token);
                    setUserId(id);
                } else {
                    await SecureStore.deleteItemAsync("userToken");
                }
            }
        } catch (error) {
            console.log("Kunde inte läsa token:", error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const data = await loginUser(email, password);
        const id = getUserId(data.token);

        if (!id) {
            throw new Error("Kunde inte läsa användarens ID.");
        }

        await SecureStore.setItemAsync("userToken", data.token);
        setUserToken(data.token);
        setUserId(id);
    };

    const register = async (email, password) => {
        return await registerUser(email, password);
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync("userToken");
        setUserToken(null);
        setUserId(null);
    };

    return (
        <AuthContext.Provider
            value={{
                userToken,
                userId,
                loading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
