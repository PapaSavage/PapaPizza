import { useEffect, useRef, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	Animated,
	TouchableOpacity,
	ActivityIndicator, // Импортируем ActivityIndicator
} from "react-native";
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { selectCartItems, clearCart } from "@/store/cartSlice";
import { useNavigation } from "@react-navigation/native";
import axios from "../utils/axios";

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
	const [loading, setLoading] = useState(false); // Состояние для лоадера

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

	const calculateTotalPrice = () => {
		return cartItems.reduce(
			(total: number, item: CartItem) =>
				total + item.quantity * item.price,
			0
		);
	};

	const calculateTotalItems = () => {
		return cartItems.reduce(
			(total: number, item: CartItem) => total + item.quantity,
			0
		);
	};

	const calculateFinalPrice = () => {
		const totalPrice = calculateTotalPrice();
		return totalPrice >= 500 ? totalPrice : totalPrice + 500;
	};

	const handleCheckout = async () => {
		if (!address) {
			alert("Пожалуйста, введите адрес.");
			return;
		}

		if (cartItems.length === 0) {
			alert("Корзина пуста. Пожалуйста, добавьте товары.");
			return;
		}

		const order = {
			address: address,
			comment: comment,
			listofpizza: cartItems.map((item: CartItem) => ({
				id: item.id,
				quantity: item.quantity,
			})),
			status: 0,
		};

		setLoading(true);

		try {
			const response = await axios.post("/create-order", order);

			const data = await response.data;

			dispatch(clearCart());
			if (data.message === "success") {
				router.push({
					pathname: "/OrderDetailPage",
					params: {
						orderId: data.order_id,
					},
				});
			}
		} catch (error: any) {
			console.error(
				"An error occurred while submitting the order:",
				error
			);
			if (error.status == 401) {
				router.push("/");
			}
			alert(
				"Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз."
			);
		} finally {
			setLoading(false); // Устанавливаем состояние загрузки в false после завершения запроса
		}
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

			<View style={styles.inputContainer}>
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

			<View style={styles.orderSummary}>
				<View style={styles.orderSummaryBlock}>
					<View style={styles.orderSummaryRow}>
						<Text style={styles.orderSummaryTitle}>Итого</Text>
						<Text style={styles.orderSummaryValue}>
							{calculateFinalPrice()} ₽
						</Text>
					</View>
					<View style={styles.orderSummaryRow}>
						<Text style={styles.orderSummaryLabel}>Товары</Text>
						<Text style={styles.orderSummaryValue}>
							{calculateTotalItems()} шт
						</Text>
					</View>
				</View>
				<View style={styles.buttonContainer}>
					<TouchableOpacity
						onPress={handleCheckout}
						style={styles.checkoutButton}
					>
						<Text style={styles.checkoutButtonText}>
							Оформить заказ
						</Text>
					</TouchableOpacity>
				</View>
			</View>

			{/* Отображение лоадера */}
			{loading && (
				<View style={styles.loaderContainer}>
					<ActivityIndicator size="large" color="#E7710B" />
				</View>
			)}
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFFFFF",
		paddingHorizontal: 20,
		justifyContent: "flex-start",
	},
	inputContainer: {
		flex: 1,
		marginBottom: 20,
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
	buttonContainer: {},
	checkoutButton: {
		backgroundColor: "#E7710B",
		borderRadius: 10,
		alignItems: "center",
		paddingVertical: 15,
	},
	checkoutButtonText: {
		color: "#ffffff",
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
	orderSummaryBlock: {
		paddingBottom: 20,
	},
	orderSummary: {
		marginBottom: 20,
		padding: 10,
		borderRadius: 10,
		backgroundColor: "#F9F9F9",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	orderSummaryRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 5,
	},
	orderSummaryTitle: {
		fontSize: 18,
		fontWeight: "bold",
	},
	orderSummaryLabel: {
		fontSize: 18,
		fontFamily: "Onest",
	},
	orderSummaryValue: {
		fontWeight: "bold",
		fontFamily: "Onest",
		fontSize: 18,
	},
	loaderContainer: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(255, 255, 255, 0.8)", // Полупрозрачный фон
	},
});
