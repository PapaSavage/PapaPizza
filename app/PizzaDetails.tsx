import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	Animated,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { addItemToCart } from "@/store/cartSlice";
import { useEffect, useRef } from "react";

export default function PizzaDetails() {
	const { id, name, description, price, image } = useLocalSearchParams();
	const navigation = useNavigation();
	const dispatch = useDispatch();

	// Animated value for fade-in effect
	const fadeAnim = useRef(new Animated.Value(0)).current;

	// Fade-in animation when the component is mounted
	useEffect(() => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 500,
			useNativeDriver: true,
		}).start();
	}, []);

	const handleAddToCart = () => {
		dispatch(
			addItemToCart({
				id,
				name,
				description,
				price,
				image,
				quantity: 1,
			})
		);
		navigation.goBack();
	};

	return (
		<Animated.View style={[styles.container, { opacity: fadeAnim }]}>
			<TouchableOpacity
				style={styles.closeButton}
				onPress={() => navigation.goBack()}
			>
				<View style={styles.closeButtonBackground}>
					<AntDesign name="close" size={20} color="#000" />
				</View>
			</TouchableOpacity>

			<Text style={styles.title}>{name}</Text>
			<Image source={{ uri: image }} style={styles.pizzaImage} />
			<Text style={styles.description}>{description}</Text>

			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={styles.button}
					onPress={handleAddToCart}
				>
					<Text style={styles.buttonText}>
						В корзину за {price} руб
					</Text>
				</TouchableOpacity>
			</View>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#FFFFFF",
		alignItems: "center",
	},
	closeButton: {
		position: "absolute",
		top: 20,
		left: 20,
		zIndex: 1,
	},
	closeButtonBackground: {
		width: 30,
		height: 30,
		borderRadius: 15,
		backgroundColor: "#E0E0E0",
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		textAlign: "center",
		fontFamily: "Onest",
	},
	pizzaImage: {
		width: 200,
		height: 200,
		borderRadius: 15,
		marginBottom: 20,
	},
	description: {
		fontSize: 16,
		color: "gray",
		marginBottom: 20,
		textAlign: "center",
		fontFamily: "Onest",
	},
	buttonContainer: {
		position: "absolute",
		bottom: 0,
		width: "100%",
		paddingHorizontal: 20,
		paddingBottom: 20,
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
