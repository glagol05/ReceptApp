import React, { useState, useContext } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    ScrollView,
    useWindowDimensions
} from "react-native";

import { AuthContext } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
    const { login } = useContext(AuthContext);
    const { width } = useWindowDimensions();

    const contentWidth = Math.min(width - 48, 450);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email.trim() || !password) {
            Alert.alert("Fel", "Fyll i e-post och lösenord.");
            return;
        }

        try {
            setLoading(true);

            await login(email.trim(), password);

            Alert.alert("Klart", "Du är nu inloggad!");
            navigation.navigate("Home");
        } catch (error) {
            Alert.alert("Inloggningen misslyckades", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
        >
            <View style={[styles.content, { width: contentWidth }]}>
                <Text style={styles.title}>Logga in</Text>

                <TextInput
                    style={styles.input}
                    placeholder="E-postadress"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    accessibilityLabel="E-postadress"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Lösenord"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    accessibilityLabel="Lösenord"
                />

                <TouchableOpacity
                    style={[
                        styles.button,
                        loading && styles.disabledButton
                    ]}
                    onPress={handleLogin}
                    disabled={loading}
                    accessibilityRole="button"
                    accessibilityLabel="Logga in"
                    accessibilityState={{ disabled: loading }}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Logga in</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate("Register")}
                    accessibilityRole="button"
                    accessibilityLabel="Gå till registrering"
                >
                    <Text style={styles.link}>
                        Har du inget konto? Registrera dig
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        backgroundColor: "#f8f8f8",
    },
    content: {
        alignSelf: "center",
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 30,
        textAlign: "center",
        color: "#222",
    },
    input: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        backgroundColor: "#287a4b",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    disabledButton: {
        opacity: 0.7,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    link: {
        color: "#287a4b",
        textAlign: "center",
        marginTop: 25,
    },
});
