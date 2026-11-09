import React, { useContext } from "react";
import {
    NavigationContainer
} from "@react-navigation/native";
import {
    createNativeStackNavigator
} from "@react-navigation/native-stack";
import {
    ActivityIndicator,
    View,
    StyleSheet
} from "react-native";

import {
    AuthProvider,
    AuthContext
} from "./src/context/AuthContext";

import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import RecipeDetailsScreen from "./src/screens/RecipeDetailsScreen";
import AddRecipeScreen from "./src/screens/AddRecipeScreen";

const Stack = createNativeStackNavigator();

function AppNavigator() {
    const { userToken, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#287a4b" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerStyle: { backgroundColor: "#ffffff" },
                    headerTintColor: "#222222",
                    headerTitleStyle: { fontWeight: "bold" },
                }}
            >
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ title: "Receptappen" }}
                />

                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ title: "Logga in" }}
                />

                <Stack.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={{ title: "Registrera" }}
                />

                <Stack.Screen
                    name="RecipeDetails"
                    component={RecipeDetailsScreen}
                    options={{ title: "Receptdetaljer" }}
                />

                {userToken && (
                    <Stack.Screen
                        name="AddRecipe"
                        component={AddRecipeScreen}
                        options={{ title: "Nytt recept" }}
                    />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppNavigator />
        </AuthProvider>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
    },
});
