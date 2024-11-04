import { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import {
	ThemeProvider,
	DarkTheme,
	DefaultTheme,
} from "@react-navigation/native";
import { useColorScheme } from "@/hooks/useColorScheme";

interface Pizza {
	id: string;
	name: string;
	description: string;
	price: number;
}

const pizzas: Pizza[] = [
	{
		id: "1",
		name: "Маргарита",
		description: "Томатный соус, сыр моцарелла",
		price: 300,
	},
	{
		id: "2",
		name: "Пепперони",
		description: "Томатный соус, сыр моцарелла, пепперони",
		price: 400,
	},
	{
		id: "3",
		name: "Гавайская",
		description: "Томатный соус, сыр моцарелла, ананас, ветчина",
		price: 555,
	},
	{
		id: "4",
		name: "С мясом",
		description: "Томатный соус, сыр моцарелла, говядина, курица, колбаса",
		price: 555,
	},
	{
		id: "5",
		name: "Вегетарианская",
		description: "Томатный соус, сыр моцарелла, овощи",
		price: 666,
	},
];

export default function PizzaPage() {
	const colorScheme = useColorScheme();
	const router = useRouter();
	const [cart, setCart] = useState<Pizza[]>([]);

	const addToCart = (pizza: Pizza) => {
		setCart((prevCart) => [...prevCart, pizza]);
		alert(`${pizza.name} добавлена в корзину!`);
	};

	const renderPizza = ({ item }: { item: Pizza }) => (
		<View style={styles.pizzaItem}>
			<Text style={styles.pizzaName}>{item.name}</Text>
			<Text style={styles.pizzaDescription}>{item.description}</Text>
			<Text style={styles.pizzaPrice}>{item.price}руб</Text>
			<TouchableOpacity
				style={styles.addButton}
				onPress={() => addToCart(item)}
			>
				<Text style={styles.addButtonText}>Добавить в корзину</Text>
			</TouchableOpacity>
		</View>
	);

	return (
		<ThemeProvider
			value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
		>
			<View style={styles.container}>
				<Text style={styles.header}>Меню пицц</Text>
				<FlatList
					data={pizzas}
					renderItem={renderPizza}
					keyExtractor={(item) => item.id}
					contentContainerStyle={styles.list}
					showsVerticalScrollIndicator={false}
				/>
			</View>
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
	pizzaItem: {
		backgroundColor: "#f9f9f9",
		padding: 15,
		marginBottom: 15,
		borderRadius: 10,
		fontFamily: "Onest",
	},
	pizzaName: {
		fontSize: 20,
		fontWeight: "bold",
		fontFamily: "Onest",
	},
	pizzaDescription: {
		fontSize: 16,
		color: "gray",
		marginTop: 5,
		fontFamily: "Onest",
	},
	pizzaPrice: {
		fontSize: 18,
		color: "black",
		marginTop: 10,
		fontWeight: "semibold",
		fontFamily: "Onest",
	},
	addButton: {
		backgroundColor: "#E7710B",
		padding: 10,
		borderRadius: 5,
		marginTop: 10,
		alignItems: "center",
		fontFamily: "Onest",
	},
	addButtonText: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "bold",
		fontFamily: "Onest",
	},
});
