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

  const getItemId = (item) => {
    if (!item) return null;
    return item.id !== undefined
      ? item.id
      : item.componentId !== undefined
        ? item.componentId
        : item?.component?.id;
  };

  const addToCart = (product) => {
    let warningMessage = null;
    const productId = getItemId(product);

    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => getItemId(item) === productId,
      );
      const currentQty = existingItem ? existingItem.quantity : 0;
      const newQuantity = currentQty + 1;

      if (product.stockQuantity <= 0) {
        warningMessage = "Spiacenti, questo prodotto è esaurito.";
        return prevItems;
      }

      if (newQuantity > product.stockQuantity) {
        warningMessage = `Disponibilità massima raggiunta per ${product.name || "questo articolo"} (${product.stockQuantity} pezzi disponibili).`;
        return prevItems;
      }

      if (existingItem) {
        return prevItems.map((item) =>
          getItemId(item) === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        const normalizedProduct = {
          ...product,
          id: productId,
          quantity: 1,
        };
        return [...prevItems, normalizedProduct];
      }
    });

    return warningMessage;
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => getItemId(item) !== productId),
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
        const currentId = getItemId(item);

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

  const addBulkToCart = (componentsList) => {
    setCartItems((prevItems) => {
      let updatedItems = [...prevItems];

      componentsList.forEach((comp) => {
        const compId = getItemId(comp);
        if (!compId) return;

        const existingIndex = updatedItems.findIndex(
          (item) => getItemId(item) === compId,
        );

        if (existingIndex > -1) {
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: updatedItems[existingIndex].quantity + 1,
          };
        } else {
          updatedItems.push({
            ...comp,
            id: compId,
            quantity: 1,
          });
        }
      });

      return updatedItems;
    });
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
        addBulkToCart,
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
