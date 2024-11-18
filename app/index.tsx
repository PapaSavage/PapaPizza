import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { View, Text, StyleSheet, TextInput } from "react-native";
import CustomButton from "@/components/CustomButton";
import { useColorScheme } from "@/hooks/useColorScheme";
import axios from "../utils/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

const Login = () => {
	const colorScheme = useColorScheme();
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
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

	const handleLogin = async () => {
		try {
			const response = await axios.post("/login", {
				email,
				password,
			});
			if (response.status === 200) {
				const token = response.data.token;
				await AsyncStorage.setItem("token", token);
				router.push("/store");
			}
		} catch (error) {
			console.error("Ошибка входа:", error);
		}
	};

	const getToken = async () => {
		try {
			const token = await AsyncStorage.getItem("token");

			let notAuth = false;
			if (token != null) {
				try {
					const response = await axios.get("/pizzas");
				} catch (error: any) {
					if (error.status == 401) {
						notAuth = true;
					}
				}
			}
			if (
				!notAuth &&
				token != null &&
				token != "" &&
				token != undefined
			) {
				console.log(token);
				router.push("/store");
			}
		} catch (error) {
			console.error("Ошибка получения токена:", error);
		}
	};

	useEffect(() => {
		getToken();
	}, []);

	if (!loaded) {
		return null;
	}

	return (
		<ThemeProvider
			value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
		>
			<View style={styles.container}>
				<Text style={styles.text}>Войдите, чтобы сделать заказ</Text>
				<View style={styles.loginContainer}>
					<TextInput
						style={styles.input}
						placeholder="Почта"
						value={email}
						onChangeText={setEmail}
					/>
					<TextInput
						style={styles.input}
						placeholder="Пароль"
						secureTextEntry
						value={password}
						onChangeText={setPassword}
					/>
					<CustomButton title="Войти" onPress={handleLogin} />
				</View>

				<View style={styles.registrationContainer}>
					<Text style={styles.noAccountText}>Нет аккаунта? </Text>
					<Text
						style={styles.registerLink}
						onPress={() => router.push("/registration")}
					>
						Зарегистрироваться
					</Text>
				</View>
			</View>
		</ThemeProvider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFFFFF",
		justifyContent: "center",
		alignItems: "center",
		padding: 16,
	},
	loginContainer: {
		width: "80%",
	},
	input: {
		height: 40,
		borderColor: "gray",
		borderWidth: 1,
		marginBottom: 12,
		paddingLeft: 10,
		borderRadius: 5,
	},
	text: {
		fontSize: 24,
		lineHeight: 21,
		fontWeight: "bold",
		letterSpacing: 0.25,
		color: "black",
		marginBottom: 20,
	},
	registrationContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 20,
	},
	noAccountText: {
		color: "gray",
	},
	registerLink: {
		color: "black",
		textDecorationLine: "underline",
	},
});

export default Login;
