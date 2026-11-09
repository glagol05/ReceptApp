import React, { useState, useContext, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    TextInput,
    ActivityIndicator,
    useWindowDimensions
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { AuthContext } from "../context/AuthContext";
import { getRecipes } from "../services/api";

export default function HomeScreen({ navigation }) {
    const { userToken, logout } = useContext(AuthContext);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");

    const { width } = useWindowDimensions();
    const contentWidth = Math.min(width - 48, 600);

    useFocusEffect(
        useCallback(() => {
            loadRecipes();
        }, [])
    );

    const loadRecipes = async () => {
        try {
            setLoading(true);
            const data = await getRecipes();
            setRecipes(data);
        } catch (error) {
            Alert.alert("Fel", "Kunde inte hämta recepten.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        Alert.alert("Utloggad", "Du har loggat ut.");
    };

    const filteredRecipes = recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={[styles.content, { width: contentWidth }]}>
                <Text style={styles.title}>Receptappen</Text>

                <Text style={styles.subtitle}>
                    Hitta inspiration till nästa måltid!
                </Text>

                {userToken ? (
                    <>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate("AddRecipe")}
                        >
                            <Text style={styles.buttonText}>
                                Lägg till recept
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={handleLogout}
                        >
                            <Text style={styles.secondaryButtonText}>
                                Logga ut
                            </Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate("Login")}
                        >
                            <Text style={styles.buttonText}>Logga in</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={() => navigation.navigate("Register")}
                        >
                            <Text style={styles.secondaryButtonText}>
                                Skapa konto
                            </Text>
                        </TouchableOpacity>
                    </>
                )}

                <Text style={styles.sectionTitle}>Recept</Text>

                <TextInput
                    style={styles.searchInput}
                    placeholder="Sök recept efter titel..."
                    value={searchText}
                    onChangeText={setSearchText}
                    accessibilityLabel="Sök recept efter titel"
                />

                {loading ? (
                    <ActivityIndicator size="large" color="#287a4b" />
                ) : recipes.length === 0 ? (
                    <Text style={styles.info}>Inga recept ännu.</Text>
                ) : filteredRecipes.length === 0 ? (
                    <Text style={styles.info}>
                        Inga recept matchar din sökning.
                    </Text>
                ) : (
                    filteredRecipes.map((recipe) => (
                        <TouchableOpacity
                            key={recipe.id}
                            style={styles.recipeCard}
                            onPress={() =>
                                navigation.navigate("RecipeDetails", {
                                    recipe
                                })
                            }
                            accessibilityRole="button"
                            accessibilityLabel={`Öppna receptet ${recipe.title}`}
                        >
                            <Text style={styles.recipeTitle}>
                                {recipe.title}
                            </Text>

                            <Text style={styles.recipeCategory}>
                                {recipe.category}
                            </Text>
                        </TouchableOpacity>
                    ))
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 24,
        backgroundColor: "#f8f8f8",
    },
    content: {
        alignSelf: "center",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        marginTop: 30,
        marginBottom: 10,
        color: "#222",
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 30,
    },
    button: {
        backgroundColor: "#287a4b",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 12,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    secondaryButton: {
        borderWidth: 1,
        borderColor: "#287a4b",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 12,
    },
    secondaryButtonText: {
        color: "#287a4b",
        fontSize: 16,
        fontWeight: "bold",
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginTop: 25,
        marginBottom: 15,
    },
    searchInput: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 14,
        fontSize: 16,
        marginBottom: 15,
    },
    info: {
        color: "#777",
        fontSize: 16,
    },
    recipeCard: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        marginBottom: 12,
        elevation: 2,
    },
    recipeTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 6,
    },
    recipeCategory: {
        fontSize: 14,
        color: "#287a4b",
    },
});
