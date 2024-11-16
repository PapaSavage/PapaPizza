import { useEffect, useState, useRef } from "react";
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	Image,
	Animated,
	TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { selectCartItems } from "@/store/cartSlice";
import { ActivityIndicator } from "react-native";
import {
	ThemeProvider,
	DarkTheme,
	DefaultTheme,
} from "@react-navigation/native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";

interface Pizza {
	id: number;
	name: string;
	description: string;
	price: number;
	image: string;
}

interface CartItem {
	id: string;
	name: string;
	quantity: number;
	description: string;
	price: number;
}

export default function PizzaPage() {
	const [pizzas, setPizzas] = useState<Pizza[]>([]);
	const [loading, setLoading] = useState(true);

	const colorScheme = useColorScheme();
	const router = useRouter();
	const cartItems = useSelector(selectCartItems);

	// Animated value for fade-in effect
	const fadeAnim = useRef(new Animated.Value(0)).current;

	// Fetch pizzas from API
	useEffect(() => {
		const fetchPizzas = async () => {
			try {
				const response = await fetch(
					"http://127.0.0.1:8000/api/pizzas"
				);
				const data = await response.json();
				setPizzas(data);
			} catch (error) {
				console.error("Error fetching pizzas:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchPizzas();
	}, []);

	// Trigger fade-in effect
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

	const renderPizza = ({ item }: { item: Pizza }) => (
		<TouchableOpacity
			style={styles.pizzaItem}
			onPress={() =>
				router.push({
					pathname: "/PizzaDetails",
					params: {
						id: item.id,
						name: item.name,
						description: item.description,
						price: item.price,
						image: item.image,
					},
				})
			}
		>
			<Image source={{ uri: item.image }} style={styles.pizzaImage} />
			<View style={styles.pizzaInfo}>
				<Text style={styles.pizzaName}>{item.name}</Text>
				<Text style={styles.pizzaDescription}>{item.description}</Text>
				<View style={styles.priceBadge}>
					<Text style={styles.pizzaPrice}>{item.price} руб</Text>
				</View>
			</View>
		</TouchableOpacity>
	);

	if (loading) {
		return (
			<Animated.View
				style={[styles.loadingContainer, { opacity: fadeAnim }]}
			>
				<ActivityIndicator size="large" color="#E7710B" />
				<Text style={styles.loadingText}>Загрузка меню...</Text>
			</Animated.View>
		);
	}

	return (
		<ThemeProvider
			value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
		>
			<Animated.View style={[styles.container, { opacity: fadeAnim }]}>
				<Text style={styles.header}>Меню пицц</Text>
				<FlatList
					data={pizzas}
					renderItem={renderPizza}
					keyExtractor={(item) => item.id.toString()}
					contentContainerStyle={styles.list}
					showsVerticalScrollIndicator={false}
				/>
			</Animated.View>
			{cartItems.length > 0 && (
				<TouchableOpacity
					style={styles.cartButton}
					onPress={() => router.push("/CartPage")}
				>
					<Ionicons name="cart" size={24} color="white" />
					<Text style={styles.cartText}>
						{calculateTotalPrice()} руб
					</Text>
				</TouchableOpacity>
			)}
		</ThemeProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFFFFF",
	},
	header: {
		fontSize: 28,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 20,
		color: "black",
		fontFamily: "Onest",
	},
	list: {
		paddingBottom: 20,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#FFFFFF",
	},
	loadingText: {
		fontSize: 18,
		color: "gray",
		fontFamily: "Onest",
	},
	pizzaItem: {
		flexDirection: "row",
		backgroundColor: "#f9f9f9",
		alignItems: "center",
		padding: 15,
		marginBottom: 15,
		borderRadius: 10,
	},
	pizzaImage: {
		width: 100,
		height: 100,
		borderRadius: 10,
		marginRight: 15,
	},
	pizzaInfo: {
		flex: 1,
		justifyContent: "space-between",
		gap: 10,
	},
	pizzaName: {
		fontSize: 20,
		fontWeight: "bold",
		fontFamily: "Onest",
	},
	pizzaDescription: {
		fontSize: 16,
		color: "gray",
		fontFamily: "Onest",
	},
	priceBadge: {
		alignSelf: "flex-start",
		backgroundColor: "#E7710B",
		borderRadius: 5,
		paddingVertical: 4,
		paddingHorizontal: 8,
	},
	pizzaPrice: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "bold",
		fontFamily: "Onest",
	},
	cartButton: {
		position: "absolute",
		bottom: 20,
		right: 20,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#E7710B",
		paddingVertical: 10,
		paddingHorizontal: 15,
		borderRadius: 50,
		elevation: 5,
	},
	cartText: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
		marginLeft: 10,
		fontFamily: "Onest",
	},
});
