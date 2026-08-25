/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useMemo } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("whiterig_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("whiterig_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.id === product.id,
      );
      if (existingIndex > -1) {
        const currentItem = prevItems[existingIndex];
        const newQuantity = currentItem.quantity + 1;

        if (newQuantity > product.stockQuantity) {
          alert(
            `Disponibilità massima raggiunta per ${product.name} (${product.stockQuantity} pezzi disponibili).`,
          );
          return prevItems;
        }

        return prevItems.map((item, index) =>
          index === existingIndex ? { ...item, quantity: newQuantity } : item,
        );
      } else {
        if (product.stockQuantity <= 0) {
          alert("Spiacenti, questo prodotto è esaurito.");
          return prevItems;
        }
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId),
    );
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === productId) {
          if (quantity > item.stockQuantity) {
            alert(
              `Disponibilità massima raggiunta (${item.stockQuantity} pezzi).`,
            );
            return { ...item, quantity: item.stockQuantity };
          }
          return { ...item, quantity: quantity };
        }
        return item;
      }),
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalAmount = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + Number(item.price) * Number(item.quantity),
      0,
    );
  }, [cartItems]);

  const totalItemsCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        totalItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
