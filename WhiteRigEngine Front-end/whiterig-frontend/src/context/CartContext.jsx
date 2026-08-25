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
    let warningMessage = null;

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      const currentQty = existingItem ? existingItem.quantity : 0;
      const newQuantity = currentQty + 1;

      if (product.stockQuantity <= 0) {
        warningMessage = "Spiacenti, questo prodotto è esaurito.";
        return prevItems;
      }

      if (newQuantity > product.stockQuantity) {
        warningMessage = `Disponibilità massima raggiunta per ${product.name} (${product.stockQuantity} pezzi disponibili).`;
        return prevItems;
      }

      const existingIndex = prevItems.findIndex(
        (item) => item.id === product.id,
      );

      if (existingIndex > -1) {
        return prevItems.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });

    return warningMessage;
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => {
        const currentId =
          item.id !== undefined
            ? item.id
            : item.componentId !== undefined
              ? item.componentId
              : item?.component?.id;
        return currentId !== productId;
      }),
    );
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return null;
    }

    let warningMessage = null;

    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        const currentId =
          item.id !== undefined
            ? item.id
            : item.componentId !== undefined
              ? item.componentId
              : item?.component?.id;

        if (currentId === productId) {
          const maxStock =
            item.stockQuantity !== undefined ? item.stockQuantity : 999;
          if (quantity > maxStock) {
            warningMessage = `Disponibilità massima raggiunta (${maxStock} pezzi).`;
            return { ...item, quantity: maxStock };
          }
          return { ...item, quantity: quantity };
        }
        return item;
      });
    });

    return warningMessage;
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
