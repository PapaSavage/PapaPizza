import { useEffect, useRef } from "react";
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	TouchableOpacity,
	Image,
	TextInput,
	Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import {
	selectCartItems,
	updateCartItem,
	removeCartItem,
} from "@/store/cartSlice";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";

interface CartItem {
	id: string;
	name: string;
	quantity: number;
	price: number;
	description: string;
	image: string;
}

export default function CartPage() {
	const cartItems = useSelector(selectCartItems);
	const dispatch = useDispatch();
	const router = useRouter();
	const navigation = useNavigation();

	const fadeAnim = useRef(new Animated.Value(0)).current;

	// Fade-in animation when the component is mounted
	useEffect(() => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 500,
			useNativeDriver: true,
		}).start();
	}, []);

	useEffect(() => {
		if (cartItems.length === 0) {
			navigation.goBack();
		}
	}, [cartItems]);

	const calculateTotalPrice = () => {
		return cartItems.reduce(
			(total: number, item: CartItem) =>
				total + item.quantity * item.price,
			0
		);
	};

	const handleQuantityChange = (id: string, quantity: number) => {
		dispatch(updateCartItem({ id, quantity }));

		if (quantity === 0) {
			handleRemoveItem(id);
		}
	};

	const handleRemoveItem = (id: string) => {
		dispatch(removeCartItem(id));
	};

	const renderCartItem = ({ item }: { item: CartItem }) => (
		<TouchableOpacity
			style={styles.cartItem}
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
			<Image source={{ uri: item.image }} style={styles.cartItemImage} />
			<View style={styles.cartItemInfo} className="flex flex-row ">
				<View className="flex-grow">
					<Text style={styles.cartItemName}>{item.name}</Text>
					<View style={styles.priceContainer}>
						<Text style={styles.cartItemPrice}>
							{item.price} руб
						</Text>
					</View>
					<View className="flex flex-row items-center justify-between pt-3">
						<TouchableOpacity
							style={styles.removeButton}
							onPress={() => handleRemoveItem(item.id)}
						>
							<Ionicons name="trash" size={24} color="gray" />
						</TouchableOpacity>
						<View style={styles.quantityContainer}>
							<TouchableOpacity
								onPress={() =>
									handleQuantityChange(
										item.id,
										item.quantity - 1
									)
								}
								style={styles.quantityButton}
							>
								<Ionicons
									name="remove"
									size={20}
									color="#E7710B"
								/>
							</TouchableOpacity>
							<TextInput
								style={styles.quantityInput}
								value={String(item.quantity)}
								editable={false}
							/>
							<TouchableOpacity
								onPress={() =>
									handleQuantityChange(
										item.id,
										item.quantity + 1
									)
								}
								style={styles.quantityButton}
							>
								<Ionicons
									name="add"
									size={20}
									color="#E7710B"
								/>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);

	return (
		<Animated.View style={[styles.container, { opacity: fadeAnim }]}>
			<View style={styles.headerContainer}>
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					style={styles.backButton}
				>
					<Text style={styles.backButtonText}>Назад</Text>
				</TouchableOpacity>
				<Text style={styles.header}>Ваша корзина</Text>
				<View style={styles.emptySpace} />{" "}
			</View>
			{cartItems.length === 0 ? (
				<Text style={styles.emptyText}>Корзина пуста</Text>
			) : (
				<FlatList
					data={cartItems}
					renderItem={renderCartItem}
					keyExtractor={(item) => item.id}
					contentContainerStyle={styles.cartList}
				/>
			)}

			{cartItems.length > 0 && (
				<TouchableOpacity
					style={styles.checkoutButton}
					onPress={() =>
						router.push({
							pathname: "/OrderPage",
						})
					}
				>
					<Text style={styles.checkoutButtonText}>
						Оформить заказ за {calculateTotalPrice()} руб
					</Text>
				</TouchableOpacity>
			)}
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	closeButtonBackground: {
		borderRadius: 10,
		backgroundColor: "#E0E0E0",
		alignItems: "center",
		justifyContent: "center",
		fontFamily: "Onest",
		padding: 5,
		paddingHorizontal: 20,
	},
	container: {
		flex: 1,
		backgroundColor: "#FFFFFF",
		paddingHorizontal: 20,
	},
	emptyText: {
		fontSize: 18,
		color: "gray",
		textAlign: "center",
		fontFamily: "Onest",
	},
	cartList: {
		paddingBottom: 20,
	},
	cartItem: {
		flexDirection: "row",
		backgroundColor: "#f9f9f9",
		alignItems: "center",
		padding: 15,
		marginBottom: 15,
		borderRadius: 10,
	},
	cartItemImage: {
		width: 100,
		height: 100,
		borderRadius: 10,
		marginRight: 15,
	},
	cartItemInfo: {
		flex: 1,
	},
	cartItemName: {
		fontSize: 18,
		fontWeight: "bold",
		fontFamily: "Onest",
	},
	priceContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	cartItemPrice: {
		fontSize: 16,
		color: "gray",
		fontFamily: "Onest",
	},
	quantityContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	quantityButton: {
		padding: 5,
	},
	quantityInput: {
		width: 40,
		height: 30,
		borderWidth: 1,
		borderRadius: 5,
		textAlign: "center",
		marginHorizontal: 10,
	},
	removeButton: {
		padding: 5,
	},
	totalContainer: {
		padding: 20,
		backgroundColor: "#f9f9f9",
		borderRadius: 10,
		marginTop: 20,
	},
	totalText: {
		fontSize: 18,
		fontWeight: "bold",
		color: "black",
		fontFamily: "Onest",
	},
	checkoutButton: {
		backgroundColor: "#E7710B",
		marginBottom: 20,
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
	cartItemDescription: {
		fontSize: 14,
		color: "gray",
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
		fontSize: 18,
		fontWeight: "bold",
		color: "black",
		fontFamily: "Onest",
	},
	emptySpace: {
		flex: 1,
	},
});
