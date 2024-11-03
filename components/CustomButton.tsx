import React from "react";
import { Text, StyleSheet, Pressable, PressableProps } from "react-native";

interface ButtonProps extends PressableProps {
	onPress: () => void; // Function to handle press event
	title?: string; // Optional title prop
}

const Button: React.FC<ButtonProps> = ({
	onPress,
	title = "Save",
	style,
	...rest
}) => {
	return (
		<Pressable style={[styles.button]} onPress={onPress} {...rest}>
			<Text style={styles.text}>{title}</Text>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	button: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 12,
		paddingHorizontal: 32,
		borderRadius: 4,
		elevation: 3,
		backgroundColor: "black",
	},
	text: {
		fontSize: 16,
		lineHeight: 21,
		fontWeight: "bold",
		letterSpacing: 0.25,
		color: "white",
		fontFamily: "Onest",
	},
});

export default Button;
