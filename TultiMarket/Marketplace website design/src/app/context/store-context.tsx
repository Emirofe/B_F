import React, { createContext, useContext, useState, useCallback } from "react";
import { Product, CartItem, Order, User, mockOrders, mockAddresses, Address, mockUsers } from "../data/mock-data";

interface StoreState {
  currentUser: User | null;
  cart: CartItem[];
  wishlist: Product[];
  orders: Order[];
  addresses: Address[];
  isLoggedIn: boolean;
  login: (email: string, password: string) => User | null;
  register: (name: string, email: string, password: string, role: string) => boolean;
  logout: () => void;
  addToCart: (product: Product, quantity?: number, selectedDate?: string, selectedTime?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  placeOrder: (address: string) => Order;
  addAddress: (address: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;
}

const StoreContext = createContext<StoreState | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);

  const login = useCallback((email: string, _password: string) => {
    // Si el email coincide con algun mock, usamos ese rol. Si no, default a comprador.
    const existingUser = mockUsers.find((u) => u.email === email);
    
    if (existingUser) {
      setCurrentUser(existingUser);
      return existingUser;
    } else {
      const newUser: User = {
        id: "current-user",
        name: email.split("@")[0],
        email,
        role: "comprador",
        registrationDate: "2026-01-01",
        status: "Activo",
        phone: "55 1234 5678",
      };
      setCurrentUser(newUser);
      return newUser;
    }
  }, []);

  const register = useCallback((name: string, email: string, _password: string, role: string) => {
    setCurrentUser({
      id: "current-user",
      name,
      email,
      role: role as any,
      registrationDate: new Date().toISOString().split("T")[0],
      status: "Activo",
    });
    return true;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setCart([]);
  }, []);

  const addToCart = useCallback((product: Product, quantity = 1, selectedDate?: string, selectedTime?: string) => {
    setCart((prev) => {
      // If it's a service with a specific date/time, treat it as a unique item
      const isService = product.type === "servicio";
      const existing = prev.find((item) => 
        item.product.id === product.id && 
        (!isService || (item.selectedDate === selectedDate && item.selectedTime === selectedTime))
      );
      
      if (existing) {
        // Cap at product stock for physical products
        const maxQty = !isService ? product.stock : Infinity;
        const newQty = Math.min(existing.quantity + quantity, maxQty);
        return prev.map((item) =>
          item.product.id === product.id && (!isService || (item.selectedDate === selectedDate && item.selectedTime === selectedTime))
            ? { ...item, quantity: newQty }
            : item
        );
      }
      // Cap initial quantity at stock
      const cappedQty = !isService ? Math.min(quantity, product.stock) : quantity;
      return [...prev, { product, quantity: cappedQty, selectedDate, selectedTime }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const getCartTotal = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const getCartCount = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const addToWishlist = useCallback((product: Product) => {
    setWishlist((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => wishlist.some((p) => p.id === productId),
    [wishlist]
  );

  const placeOrder = useCallback(
    (address: string) => {
      const newOrder: Order = {
        id: `o${orders.length + 1}`,
        folio: `ORD-2026-${String(orders.length + 1).padStart(3, "0")}`,
        date: new Date().toISOString().split("T")[0],
        items: [...cart],
        total: cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
        status: "En preparacion",
        buyerName: currentUser?.name || "Usuario",
        buyerId: currentUser?.id || "unknown",
        address,
      };
      setOrders((prev) => [newOrder, ...prev]);
      setCart([]);
      return newOrder;
    },
    [cart, orders.length, currentUser]
  );

  const addAddress = useCallback((address: Omit<Address, "id">) => {
    setAddresses((prev) => [...prev, { ...address, id: `a${Date.now()}` }]);
  }, []);

  const removeAddress = useCallback((id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return (
    <StoreContext.Provider
      value={{
        currentUser,
        cart,
        wishlist,
        orders,
        addresses,
        isLoggedIn: !!currentUser,
        login,
        register,
        logout,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        placeOrder,
        addAddress,
        removeAddress,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}
