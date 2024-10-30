import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { Slot } from "expo-router";
import { View, Text, StyleSheet, Image, TextInput, Button } from "react-native";
import CustomButton from "@/components/CustomButton";

import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
import "../global.css";
import { red } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
		Inter: require("../assets/fonts/Inter.ttf"),
		Unbounded: require("../assets/fonts/Unbounded.ttf"),
	});

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<ThemeProvider
			value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
		>
			<View className="flex-1 p-4" style={styles.container}>
				<View style={styles.loginContainer}>
					<TextInput style={styles.input} placeholder="Логин" />
					<TextInput
						style={styles.input}
						placeholder="Пароль"
						secureTextEntry
					/>
					<CustomButton title="Войти" onPress={() => {}} />
				</View>

				<Slot />
			</View>
		</ThemeProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFFFFF",
		justifyContent: "center", // Center items vertically
		alignItems: "center",
	},
	loginContainer: {
		width: "80%",
	},
	input: {
		fontFamily: "Unbounded",
		height: 40,
		borderColor: "gray",
		borderWidth: 1,
		marginBottom: 12,
		paddingLeft: 10,
		borderRadius: 5,
	},
	button: {
		fontFamily: "Unbounded",
	},
});
