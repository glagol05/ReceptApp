import React, { useState, useContext } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    Share,
    useWindowDimensions
} from "react-native";

import { AuthContext } from "../context/AuthContext";
import { updateRecipe, deleteRecipe } from "../services/api";

export default function RecipeDetailsScreen({ route, navigation }) {
    const { recipe } = route.params;
    const { userToken, userId } = useContext(AuthContext);
    const { width } = useWindowDimensions();

    const contentWidth = Math.min(width - 48, 600);

    const isOwner =
        userToken &&
        userId !== null &&
        String(recipe.user_id) === String(userId);

    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(recipe.title);
    const [ingredients, setIngredients] = useState(recipe.ingredients);
    const [instructions, setInstructions] = useState(recipe.instructions);
    const [category, setCategory] = useState(recipe.category);

    const handleShare = async () => {
        try {
            await Share.share({
                message:
                    `${recipe.title}\n\n` +
                    `Kategori: ${recipe.category}\n\n` +
                    `Ingredienser:\n${recipe.ingredients}\n\n` +
                    `Instruktioner:\n${recipe.instructions}`,
            });
        } catch (error) {
            Alert.alert("Fel", "Kunde inte dela receptet.");
        }
    };

    const handleUpdate = async () => {
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
            await updateRecipe(
                recipe.id,
                { title, ingredients, instructions, category },
                userToken
            );

            Alert.alert("Klart", "Receptet har uppdaterats.");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Fel", error.message);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "Ta bort recept",
            "Är du säker på att du vill ta bort receptet?",
            [
                { text: "Avbryt", style: "cancel" },
                {
                    text: "Ta bort",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteRecipe(recipe.id, userToken);
                            Alert.alert("Klart", "Receptet har tagits bort.");
                            navigation.goBack();
                        } catch (error) {
                            Alert.alert("Fel", error.message);
                        }
                    }
                }
            ]
        );
    };

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
        >
            <View style={[styles.content, { width: contentWidth }]}>
                <Text style={styles.title}>
                    {editing ? "Redigera recept" : recipe.title}
                </Text>

                {editing ? (
                    <>
                        <TextInput
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Receptets namn"
                            accessibilityLabel="Receptets namn"
                        />

                        <TextInput
                            style={[styles.input, styles.multiline]}
                            value={ingredients}
                            onChangeText={setIngredients}
                            placeholder="Ingredienser"
                            multiline
                            accessibilityLabel="Ingredienser"
                        />

                        <TextInput
                            style={[styles.input, styles.multiline]}
                            value={instructions}
                            onChangeText={setInstructions}
                            placeholder="Instruktioner"
                            multiline
                            accessibilityLabel="Instruktioner"
                        />

                        <TextInput
                            style={styles.input}
                            value={category}
                            onChangeText={setCategory}
                            placeholder="Kategori"
                            accessibilityLabel="Kategori"
                        />

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleUpdate}
                            accessibilityRole="button"
                            accessibilityLabel="Spara ändringar"
                        >
                            <Text style={styles.buttonText}>
                                Spara ändringar
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={() => setEditing(false)}
                            accessibilityRole="button"
                            accessibilityLabel="Avbryt redigering"
                        >
                            <Text style={styles.secondaryButtonText}>
                                Avbryt
                            </Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <Text style={styles.category}>
                            {recipe.category}
                        </Text>

                        <Text style={styles.sectionTitle}>
                            Ingredienser
                        </Text>
                        <Text style={styles.text}>
                            {recipe.ingredients}
                        </Text>

                        <Text style={styles.sectionTitle}>
                            Instruktioner
                        </Text>
                        <Text style={styles.text}>
                            {recipe.instructions}
                        </Text>

                        <TouchableOpacity
                            style={styles.shareButton}
                            onPress={handleShare}
                            accessibilityRole="button"
                            accessibilityLabel="Dela recept"
                        >
                            <Text style={styles.buttonText}>
                                Dela recept
                            </Text>
                        </TouchableOpacity>

                        {isOwner && (
                            <>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => setEditing(true)}
                                    accessibilityRole="button"
                                    accessibilityLabel="Redigera recept"
                                >
                                    <Text style={styles.buttonText}>
                                        Redigera recept
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={handleDelete}
                                    accessibilityRole="button"
                                    accessibilityLabel="Ta bort recept"
                                >
                                    <Text style={styles.buttonText}>
                                        Ta bort recept
                                    </Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </>
                )}
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
        marginBottom: 10,
        color: "#222",
    },
    category: {
        fontSize: 16,
        color: "#287a4b",
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
        color: "#444",
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
        marginTop: 20,
    },
    shareButton: {
        backgroundColor: "#356b9a",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 25,
    },
    secondaryButton: {
        borderWidth: 1,
        borderColor: "#287a4b",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 12,
    },
    secondaryButtonText: {
        color: "#287a4b",
        fontWeight: "bold",
    },
    deleteButton: {
        backgroundColor: "#b83232",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 12,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
