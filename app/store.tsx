import { useState } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { selectCartItems } from "@/store/cartSlice";

import {
	ThemeProvider,
	DarkTheme,
	DefaultTheme,
} from "@react-navigation/native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { TouchableOpacity } from "react-native";

interface Pizza {
	id: string;
	name: string;
	description: string;
	price: number;
}

interface CartItem {
	id: string;
	name: string;
	quantity: number;
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
	const cartItems = useSelector(selectCartItems);

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
					},
				})
			}
		>
			<Image
				source={require("@/assets/images/peperoni.png")}
				style={styles.pizzaImage}
			/>
			<View style={styles.pizzaInfo}>
				<Text style={styles.pizzaName}>{item.name}</Text>
				<Text style={styles.pizzaDescription}>{item.description}</Text>
				<View style={styles.priceBadge}>
					<Text style={styles.pizzaPrice}>{item.price} руб</Text>
				</View>
			</View>
		</TouchableOpacity>
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
			<View>
				<Text>Корзина</Text>
				{cartItems.length === 0 ? (
					<Text>Корзина пуста</Text>
				) : (
					cartItems.map((item: CartItem, index: number) => (
						<View key={item.id || index.toString()}>
							<Text>
								{item.name} - {item.quantity} шт.
							</Text>
						</View>
					))
				)}
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
		fontFamily: "Onest",
	},
	pizzaPrice: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "bold",
		fontFamily: "Onest",
	},
});
