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
import { red } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

SplashScreen.preventAutoHideAsync();

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
			<View className="flex-1 p-4 gap-5" style={styles.container}>
				<Text className="text-center" style={styles.text}>
					Войдите, чтобы сделать заказ
				</Text>
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
		justifyContent: "center",
		alignItems: "center",
	},
	loginContainer: {
		width: "80%",
	},
	input: {
		fontFamily: "Onest",
		height: 40,
		borderColor: "gray",
		borderWidth: 1,
		marginBottom: 12,
		paddingLeft: 10,
		borderRadius: 5,
	},
	button: {
		fontFamily: "Onest",
	},
	text: {
		fontSize: 24,
		lineHeight: 21,
		fontWeight: "bold",
		letterSpacing: 0.25,
		color: "black",
		fontFamily: "Onest",
	},
});
