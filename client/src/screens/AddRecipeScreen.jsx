import React, { useState, useContext } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    ActivityIndicator,
    useWindowDimensions
} from "react-native";

import { AuthContext } from "../context/AuthContext";
import { createRecipe } from "../services/api";

export default function AddRecipeScreen({ navigation }) {
    const { userToken } = useContext(AuthContext);
    const { width } = useWindowDimensions();

    const contentWidth = Math.min(width - 48, 600);

    const [title, setTitle] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [instructions, setInstructions] = useState("");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (
            !title.trim() ||
            !ingredients.trim() ||
            !instructions.trim() ||
            !category.trim()
        ) {
            Alert.alert("Fel", "Fyll i alla fält.");
            return;
        }

        try {
            setLoading(true);

            await createRecipe(
                {
                    title,
                    ingredients,
                    instructions,
                    category,
                },
                userToken
            );

            Alert.alert("Klart", "Receptet har sparats!");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Fel", error.message);
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
                <Text style={styles.title}>Nytt recept</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Receptets namn"
                    value={title}
                    onChangeText={setTitle}
                    accessibilityLabel="Receptets namn"
                />

                <TextInput
                    style={[styles.input, styles.multiline]}
                    placeholder="Ingredienser"
                    value={ingredients}
                    onChangeText={setIngredients}
                    multiline
                    accessibilityLabel="Ingredienser"
                />

                <TextInput
                    style={[styles.input, styles.multiline]}
                    placeholder="Instruktioner"
                    value={instructions}
                    onChangeText={setInstructions}
                    multiline
                    accessibilityLabel="Instruktioner"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Kategori, exempelvis Pasta"
                    value={category}
                    onChangeText={setCategory}
                    accessibilityLabel="Kategori"
                />

                <TouchableOpacity
                    style={[
                        styles.button,
                        loading && styles.disabledButton
                    ]}
                    onPress={handleSubmit}
                    disabled={loading}
                    accessibilityRole="button"
                    accessibilityLabel="Spara recept"
                    accessibilityState={{ disabled: loading }}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>
                            Spara recept
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: "center",
        paddingVertical: 24,
        paddingHorizontal: 12,
        backgroundColor: "#f8f8f8",
    },
    content: {
        alignSelf: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 25,
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
    multiline: {
        minHeight: 110,
        textAlignVertical: "top",
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
        fontSize: 16,
        fontWeight: "bold",
    },
});
