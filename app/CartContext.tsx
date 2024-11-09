import React, { createContext, useState, useContext } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
	const [cart, setCart] = useState([]);

	// Function to add items to the cart
	const addToCart = (item) => {
		setCart((prevCart) => [...prevCart, item]);
	};

	return (
		<CartContext.Provider value={{ cart, addToCart }}>
			{children}
		</CartContext.Provider>
	);
}

// Custom hook for using cart context
export const useCart = () => useContext(CartContext);
