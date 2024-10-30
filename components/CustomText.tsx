import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";

interface CustomTextProps extends TextProps {}

const CustomText: React.FC<CustomTextProps> = ({ style, ...props }) => {
	return <Text style={[styles.default, style]} {...props} />;
};

const styles = StyleSheet.create({
	default: {
		fontFamily: "Unbounded",
	},
});

export default CustomText;
