import { useEffect, useRef, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	Animated,
	TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { selectCartItems } from "@/store/cartSlice";
import { useNavigation } from "@react-navigation/native";

export default function CartPage() {
	const cartItems = useSelector(selectCartItems);
	const dispatch = useDispatch();
	const router = useRouter();
	const navigation = useNavigation();

	const fadeAnim = useRef(new Animated.Value(0)).current;

	const [address, setAddress] = useState("");
	const [comment, setComment] = useState("");
	const [phone, setPhone] = useState("");
	const [fio, setFio] = useState("");

	interface CartItem {
		id: string;
		name: string;
		quantity: number;
		price: number;
		description: string;
		image: string;
	}

	useEffect(() => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 500,
			useNativeDriver: true,
		}).start();
	}, []);

	const handleCheckout = () => {
		if (!address) {
			alert("Пожалуйста, введите адрес.");
			return;
		}

		const order = {
			fio: fio,
			phone: phone,
			address: address,
			comment: comment,
			listofpizza: cartItems.value.map((item: CartItem) => ({
				id: item.id,
				quantity: item.quantity,
			})),
		};
		// try {
		// 	const data = await fetch("http://127.0.0.1:8000/api/create-order", {
		// 		method: "post",
		// 		body: order,
		// 	});

		// 	if (data.message === "success") {
		// 		isOrderSuccessful.value = true;
		// 		setTimeout(() => {
		// 			isOrderSuccessful.value = false;
		// 		}, 4000);
		// 		ordercred.value = {
		// 			name: "",
		// 			phone: "",
		// 			address: "",
		// 			comment: "",
		// 		};
		// 		cartStore.clearCart();
		// 		setTimeout(() => {
		// 			navigateTo("/");
		// 		}, 4000);
		// 	} else {
		// 		console.error("Order submission failed:", data);
		// 	}
		// } catch (error) {
		// 	console.error(
		// 		"An error occurred while submitting the order:",
		// 		error
		// 	);
		// }

		alert("Заказ оформлен!");
	};

	return (
		<Animated.View style={[styles.container, { opacity: fadeAnim }]}>
			<View style={styles.headerContainer}>
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					style={styles.backButton}
				>
					<Text style={styles.backButtonText}>Назад</Text>
				</TouchableOpacity>
				<Text style={styles.header}>Оформление заказа</Text>
				<View style={styles.emptySpace} />
			</View>

			{/* Инпуты находятся в верхней части */}
			<View style={styles.inputContainer}>
				<TextInput
					style={styles.input}
					placeholder="Введите ФИО"
					value={fio}
					onChangeText={setFio}
				/>
				<TextInput
					style={styles.input}
					placeholder="Введите телефон"
					value={phone}
					onChangeText={setPhone}
				/>
				<TextInput
					style={styles.input}
					placeholder="Введите адрес"
					value={address}
					onChangeText={setAddress}
				/>
				<TextInput
					style={styles.input}
					placeholder="Комментарий (необязательно)"
					value={comment}
					onChangeText={setComment}
				/>
			</View>

			{/* Кнопка Оплатить внизу */}
			<View style={styles.buttonContainer}>
				<TouchableOpacity
					onPress={handleCheckout}
					style={styles.checkoutButton}
				>
					<Text style={styles.checkoutButtonText}>Оплатить</Text>
				</TouchableOpacity>
			</View>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFFFFF",
		paddingHorizontal: 20,
		justifyContent: "flex-start", // Размещает элементы в верхней части
	},
	inputContainer: {
		flex: 1, // Позволяет инпутам занимать доступное пространство
		marginBottom: 20, // Отступ снизу для отделения от кнопки
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
	buttonContainer: {
		paddingBottom: 20, // Отступ снизу для кнопки
	},
	checkoutButton: {
		backgroundColor: "#E7710B",
		borderRadius: 10,
		alignItems: "center",
	},
	checkoutButtonText: {
		color: "#ffffff",
		paddingVertical: 15,
		paddingHorizontal: 20,
		fontSize: 18,
		fontWeight: "bold",
		fontFamily: "Onest",
	},
	headerContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginVertical: 20,
	},
	backButton: {
		flex: 1,
	},
	backButtonText: {
		color: "#E7710B",
		fontSize: 18,
		fontFamily: "Onest",
	},
	header: {
		flex: 1,
		textAlign: "center",
		fontSize: 28,
		fontWeight: "bold",
		color: "black",
		fontFamily: "Onest",
	},
	emptySpace: {
		flex: 1,
	},
});
