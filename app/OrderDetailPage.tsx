import { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
	ScrollView,
	Image,
	TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import axios from "../utils/axios";

interface OrderDetails {
	id: number;
	address: string;
	comment: string | null;
	client: { name: string; phone: string };
	listofpizza: {
		id: string;
		name: string;
		quantity: number;
		price: number;
	}[];
	status: number; // Добавляем статус в интерфейс
}

export default function OrderDetailsPage() {
	const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const { orderId } = useLocalSearchParams();

	useEffect(() => {
		const fetchOrderDetails = async () => {
			try {
				const response = await axios.get(`/orders/${orderId}`);
				const data = await response.data;

				if (response.status == 200) {
					setOrderDetails(data);
				} else {
					setError(data.message || "Ошибка загрузки данных");
				}
			} catch (err: any) {
				setError("Не удалось загрузить детали заказа");
				if (err.status == 401) {
					router.push("/");
				}
			} finally {
				setLoading(false);
			}
		};

		fetchOrderDetails();
	}, [orderId]);

	const getStatusText = (status: number) => {
		switch (status) {
			case 0:
				return "Обрабатывается";
			case 1:
				return "Доставляется";
			case 2:
				return "Выполнен";
			default:
				return "Неизвестный статус";
		}
	};

	if (loading) {
		return (
			<View style={styles.loaderContainer}>
				<ActivityIndicator size="large" color="#E7710B" />
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.errorContainer}>
				<Text style={styles.errorText}>{error}</Text>
			</View>
		);
	}

	if (!orderDetails) {
		return (
			<View style={styles.errorContainer}>
				<Text style={styles.errorText}>Данные заказа отсутствуют.</Text>
			</View>
		);
	}

	return (
		<ScrollView style={styles.container}>
			<Text style={styles.header}>Детали заказа</Text>

			<View style={styles.detailsContainer}>
				<View className="flex flex-col gap-3">
					<View className="flex flex-row justify-center">
						<Image
							source={require("@/assets/images/package.png")}
							style={{
								resizeMode: "cover",
								aspectRatio: 1,
							}}
						/>
					</View>
					<View>
						<Text style={styles.label}>ID заказа:</Text>
						<Text style={styles.value}>{orderDetails.id}</Text>
					</View>
					<View>
						<Text style={styles.label}>Адрес:</Text>
						<Text style={styles.value}>{orderDetails.address}</Text>
					</View>
					<View>
						<Text style={styles.label}>Статус:</Text>
						<Text style={styles.value}>
							{getStatusText(orderDetails.status)}
						</Text>
					</View>
					<View>
						<Text style={styles.label}>Получатель:</Text>
						<Text style={styles.value}>
							{orderDetails.client.name}
						</Text>
					</View>
					<View>
						<Text style={styles.label}>Телефон:</Text>
						<Text style={styles.value}>
							{orderDetails.client.phone}
						</Text>
					</View>
				</View>
			</View>
			<View className="pt-4" style={styles.buttonContainer}>
				<TouchableOpacity
					style={styles.button}
					onPress={() => router.push("/store")}
				>
					<Text style={styles.buttonText}>К покупкам</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFFFFF",
		padding: 20,
	},
	buttonContainer: {
		width: "100%",
		paddingHorizontal: 20,
		paddingBottom: 20,
	},
	header: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		color: "black",
		fontFamily: "Onest",
	},
	detailsContainer: {
		backgroundColor: "#F9F9F9",
		borderRadius: 10,
		padding: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	label: {
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 5,
		color: "#333",
		fontFamily: "Onest",
	},
	value: {
		fontSize: 16,
		color: "#555",
		fontFamily: "Onest",
	},
	item: {
		marginBottom: 15,
	},
	itemName: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#333",
		fontFamily: "Onest",
	},
	itemDetails: {
		fontSize: 14,
		color: "#666",
		fontFamily: "Onest",
	},
	loaderContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#FFFFFF",
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	errorText: {
		fontSize: 16,
		color: "red",
		textAlign: "center",
		fontFamily: "Onest",
	},
	button: {
		backgroundColor: "#E7710B",
		paddingVertical: 15,
		borderRadius: 10,
		alignItems: "center",
		width: "100%",
	},
	buttonText: {
		fontSize: 18,
		color: "#FFFFFF",
		fontWeight: "bold",
		fontFamily: "Onest",
	},
});
