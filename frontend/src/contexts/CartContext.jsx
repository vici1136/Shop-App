import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext({});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Inițializăm coșul din localStorage ca să nu se piardă la refresh
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart(prev => {
      // Verificăm dacă produsul e deja în coș
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        // Dacă există, creștem cantitatea
        return prev.map(p => 
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      // Dacă nu, îl adăugăm cu cantitatea 1
      return [...prev, { ...product, quantity: 1 }];
    });
    alert(`${product.name} a fost adăugat în coș!`); // Feedback vizual simplu
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(p => p.id !== productId));
  };

  const clearCart = () => setCart([]);

  // Calculăm totalul produselor pentru iconița din meniu
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};