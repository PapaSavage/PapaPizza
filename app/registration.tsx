import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { View, Text, StyleSheet, TextInput } from "react-native";
import CustomButton from "@/components/CustomButton";
import { useColorScheme } from "@/hooks/useColorScheme";
import axios from "../utils/axios"; // Предполагается, что у вас есть настроенный axios
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

const Registration = () => {
	const colorScheme = useColorScheme();
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [phone, setPhone] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
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

	const handleRegistration = async () => {
		if (password !== confirmPassword) {
			alert("Пароли не совпадают");
			return;
		}

		try {
			const response = await axios.post("/register", {
				name,
				phone,
				email,
				password,
			});
			if (response.status === 201) {
				const response = await axios.post("/login", {
					email,
					password,
				});
				if (response.status === 200) {
					const token = response.data.token;
					await AsyncStorage.setItem("token", token);
					router.push("/store");
				}
			}
		} catch (error: any) {
			console.error("Ошибка регистрации:", error);
			alert(
				"Ошибка регистрации. Пожалуйста, проверьте данные и попробуйте снова."
			);
			if (error.status == 401) {
				router.push("/");
			}
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
		getToken(); // Вызываем функцию для получения токена при загрузке компонента
	}, []);

	if (!loaded) {
		return null;
	}

	return (
		<ThemeProvider
			value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
		>
			<View style={styles.container}>
				<Text style={styles.text}>
					Зарегистрируйтесь, чтобы создать аккаунт
				</Text>
				<View style={styles.registerContainer}>
					<TextInput
						style={styles.input}
						placeholder="Имя"
						value={name}
						onChangeText={setName}
					/>
					<TextInput
						style={styles.input}
						placeholder="Телефон"
						value={phone}
						onChangeText={setPhone}
					/>
					<TextInput
						style={styles.input}
						placeholder="Email"
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
					<TextInput
						style={styles.input}
						placeholder="Подтвердите пароль"
						secureTextEntry
						value={confirmPassword}
						onChangeText={setConfirmPassword}
					/>
					<CustomButton
						title="Зарегистрироваться"
						onPress={handleRegistration}
					/>
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
	registerContainer: {
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
});

export default Registration;
