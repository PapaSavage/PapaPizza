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
import { View, Text, StyleSheet, Image } from "react-native";

import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
import "../global.css";

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
			<View className="p-4" style={styles.container}>
				<View className="flex flex-row gap-1 items-center">
					<Image
						source={require("@/assets/images/pizza-logo.png")}
						style={styles.pizzaLogo}
					/>
					<Text className="text-xl font-bold">НЯМ-НЯМ</Text>
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
	},
	logoContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 16,
		marginLeft: 16,
	},
	pizzaLogo: {
		width: 48,
		height: 48,
	},
});
