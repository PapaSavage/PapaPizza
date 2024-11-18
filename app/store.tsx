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
import axios from "../utils/axios";

interface Pizza {
	id: number;
	name: string;
	description: string;
	price: number;
	image: string;
	category_id: number;
}

interface CartItem {
	id: string;
	name: string;
	quantity: number;
	description: string;
	price: number;
}

const categories = [
	{ id: 2, title: "Пицца" },
	{ id: 3, title: "Роллы" },
];

export default function PizzaPage() {
	const [pizzas, setPizzas] = useState<Pizza[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState<number | null>(2); // состояние для выбранной категории

	const colorScheme = useColorScheme();
	const router = useRouter();
	const cartItems = useSelector(selectCartItems);

	const fadeAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		const fetchPizzas = async () => {
			try {
				const response = await axios.get("/pizzas");

				const data = await response.data;
				setPizzas(data);
			} catch (error: any) {
				if (error.status == 401) {
					router.push("/");
				}
				console.error("Error fetching pizzas:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchPizzas();
	}, []);

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

	// Фильтрация пицц по выбранной категории
	const filteredPizzas = selectedCategory
		? pizzas.filter((pizza) => pizza.category_id === selectedCategory)
		: pizzas;

	return (
		<ThemeProvider
			value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
		>
			<Animated.View style={[styles.container, { opacity: fadeAnim }]}>
				<View style={styles.categoryContainer}>
					{categories.map((category) => (
						<TouchableOpacity
							key={category.id}
							style={[
								styles.categoryButton,
								selectedCategory === category.id &&
									styles.selectedCategoryButton,
							]}
							onPress={() => setSelectedCategory(category.id)}
						>
							<Text style={styles.categoryButtonText}>
								{category.title}
							</Text>
						</TouchableOpacity>
					))}
					<TouchableOpacity
						style={styles.categoryButton}
						onPress={() => router.push("/OrdersPage")}
					>
						<Text style={styles.categoryButtonText}>
							Мои заказы
						</Text>
					</TouchableOpacity>
					<View style={styles.cartContainer}>
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
					</View>
				</View>

				<FlatList
					data={filteredPizzas}
					renderItem={renderPizza}
					keyExtractor={(item) => item.id.toString()}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={styles.flatList}
				/>
				<View style={styles.infoContainer}>
					<Text style={styles.infoHeader}>
						Юридическая информация
					</Text>
					<Text style={styles.infoText}>
						ООО "Ваш Магазин", ИНН 1234567890
					</Text>
					<Text style={styles.infoText}>КПП 123456789</Text>
					<Text style={styles.infoText}>ОГРН 1234567890123</Text>
					<Text style={styles.infoHeader}>Расписание работы</Text>
					<Text style={styles.infoText}>Пн-Пт: 9:00 - 21:00</Text>
					<Text style={styles.infoText}>Сб-Вс: 10:00 - 18:00</Text>
					<Text style={styles.infoHeader}>Положение магазина</Text>
					<Text className="pb-3" style={styles.infoText}>
						г. Киров, ул. Профсоюзная, д. 1
					</Text>
					<Image
						source={require("@/assets/images/address.png")}
						style={{
							width: "100%",
							height: 150,
							resizeMode: "cover",
							borderRadius: 5,
						}}
					/>
				</View>
			</Animated.View>
		</ThemeProvider>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#FFFFFF", position: "relative" },
	categoryContainer: {
		flexDirection: "row",
		marginBottom: 2,
		paddingVertical: 10, // Добавлено для отступа сверху и снизу
	},
	categoryButton: {
		padding: 10,
		backgroundColor: "#E7710B",
		borderRadius: 20,
		marginHorizontal: 5, // Добавлено для горизонтальных отступов между кнопками
	},
	selectedCategoryButton: {
		backgroundColor: "#b24e0c",
	},
	categoryButtonText: {
		color: "white",
		fontWeight: "bold",
		fontFamily: "Onest",
	},
	header: {
		fontSize: 28,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 20,
		color: "black",
		fontFamily: "Onest",
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#FFFFFF",
	},
	loadingText: { fontSize: 18, color: "gray", fontFamily: "Onest" },
	pizzaItem: {
		flexDirection: "row",
		backgroundColor: "#f9f9f9",
		alignItems: "center",
		padding: 15,
		marginBottom: 15,
		borderRadius: 10,
	},
	pizzaImage: { width: 100, height: 100, borderRadius: 10, marginRight: 15 },
	pizzaInfo: { flex: 1, justifyContent: "space-between", gap: 10 },
	pizzaName: { fontSize: 20, fontWeight: "bold", fontFamily: "Onest" },
	pizzaDescription: { fontSize: 16, color: "gray", fontFamily: "Onest" },
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
		right: 0,
		top: -7,
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
	infoContainer: {
		marginTop: 20,
		padding: 10,
		backgroundColor: "#f9f9f9",
		borderRadius: 10,
	},
	infoHeader: {
		fontSize: 16,
		fontWeight: "bold",
		color: "black",
		fontFamily: "Onest",
		marginBottom: 5,
	},
	infoText: { fontSize: 14, color: "gray", fontFamily: "Onest" },
	flatList: {
		flexGrow: 1,
		paddingBottom: 20,
	},
	cartContainer: {
		flex: 1,
	},
});
