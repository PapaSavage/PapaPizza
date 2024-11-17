import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

interface Order {
	id: number;
	client_id: number;
	cart_id: number;
	address: string;
	comment: string;
	status: number;
	created_at: string;
	updated_at: string;
}

export default function OrdersPage() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const router = useRouter();

	const navigation = useNavigation();

	useEffect(() => {
		// Fetch orders from API
		const fetchOrders = async () => {
			try {
				const response = await fetch(
					"http://127.0.0.1:8000/api/clients/29"
				);
				if (!response.ok) {
					throw new Error(`Ошибка загрузки: ${response.status}`);
				}
				const data = await response.json();
				setOrders(data.orders); // Предполагается, что `data` - это массив заказов
			} catch (err: any) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchOrders();
	}, []);

	const renderOrder = ({ item }: { item: Order }) => (
		<View style={styles.orderCard}>
			<View style={styles.orderInfo}>
				<Text style={styles.orderTitle}>Заказ #{item.id}</Text>
				<Text style={styles.orderAddress}>Адрес: {item.address}</Text>
				<Text style={styles.orderStatus}>
					Статус: {item.status === 1 ? "Выполнен" : "В процессе"}
				</Text>
				<Text style={styles.orderDate}>
					Создан: {new Date(item.created_at).toLocaleString()}
				</Text>
			</View>
			<View style={styles.orderActions}>
				<TouchableOpacity
					style={styles.detailsButton}
					onPress={() =>
						router.push({
							pathname: "/OrderDetailPage",
							params: { orderId: item.id },
						})
					}
				>
					<Text style={styles.detailsButtonText}>Подробнее</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	if (loading) {
		return (
			<View style={styles.container}>
				<ActivityIndicator size="large" color="#E7710B" />
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.container}>
				<Text style={styles.errorText}>Ошибка: {error}</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.headerContainer}>
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					style={styles.backButton}
				>
					<Text style={styles.backButtonText}>Назад</Text>
				</TouchableOpacity>
				<Text style={styles.header}>Ваши заказы</Text>
				<View style={styles.emptySpace} />
			</View>
			{orders.length === 0 ? (
				<Text style={styles.emptyText}>Заказов пока нет</Text>
			) : (
				<FlatList
					data={orders}
					renderItem={renderOrder}
					keyExtractor={(item) => item.id.toString()}
					contentContainerStyle={styles.listContent}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFFFFF",
		padding: 20,
	},
	header: {
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
		color: "#333",
	},
	emptyText: {
		fontSize: 18,
		color: "gray",
		textAlign: "center",
		marginTop: 50,
	},
	listContent: {
		paddingBottom: 20,
	},
	orderCard: {
		backgroundColor: "#f9f9f9",
		padding: 15,
		marginBottom: 15,
		borderRadius: 10,
		elevation: 2,
	},
	orderInfo: {
		marginBottom: 10,
	},
	orderTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#000",
		marginBottom: 5,
	},
	orderAddress: {
		fontSize: 16,
		color: "#555",
	},
	orderStatus: {
		fontSize: 16,
		color: "#777",
		marginBottom: 5,
	},
	orderDate: {
		fontSize: 14,
		color: "#999",
	},
	orderActions: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	detailsButton: {
		backgroundColor: "#E7710B",
		paddingVertical: 10,
		paddingHorizontal: 15,
		borderRadius: 10,
	},
	detailsButtonText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "bold",
	},
	cancelButton: {
		padding: 10,
	},
	errorText: {
		fontSize: 16,
		color: "red",
		textAlign: "center",
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
	emptySpace: {
		flex: 1,
	},
});
