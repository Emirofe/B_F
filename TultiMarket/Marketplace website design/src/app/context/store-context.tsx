import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  Product,
  CartItem,
  Order,
  User,
  Address,
  PaymentMethod,
} from "../data/mock-data";
import {
  loginApi,
  registerApi,
  logoutApi,
  getMiCuentaApi,
  getMisDireccionesApi,
  addDireccionApi,
  deleteDireccionApi,
  getMisMetodosPagoApi,
  getCarritoApi,
  addProductoAlCarritoApi,
  addServicioAlCarritoApi,
  updateItemCarritoApi,
  deleteItemCarritoApi,
  vaciarCarritoApi,
  checkoutApi,
  getWishlistItemsApi,
  addToWishlistApi,
  removeFromWishlistApi,
} from "../api/api-client";

// ─── Tipo extendido del CarritoItem para guardar el id_item del backend ───────
interface CartItemConId extends CartItem {
  idItem?: number; // id del registro en carrito_items de la BD
}

interface WishlistProduct extends Product {
  wishlistItemId?: number;
}

interface StoreState {
  currentUser: User | null;
  cart: CartItemConId[];
  wishlist: WishlistProduct[];
  orders: Order[];
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  negocioId: number | null; // Para vendedores: id del negocio vinculado
  isLoggedIn: boolean;
  isLoading: boolean;
  // Auth
  login: (email: string, password: string) => Promise<User | null>;
  register: (name: string, email: string, password: string, role: "admin" | "comprador" | "vendedor") => Promise<boolean>;
  logout: () => Promise<void>;
  // Cart
  addToCart: (product: Product, quantity?: number, selectedDate?: string, selectedTime?: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateCartQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartCount: () => number;
  // Wishlist
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  // Orders
  placeOrder: (address: string, idDireccion?: number, idMetodoPago?: number) => Promise<Order>;
  // Addresses
  addAddress: (address: Omit<Address, "id">) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
  reloadAddresses: () => Promise<void>;
  reloadPaymentMethods: () => Promise<void>;
  updateNegocioId: (id: number) => void;
}

const StoreContext = createContext<StoreState | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItemConId[]>([]);
  const [wishlist, setWishlist] = useState<WishlistProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [negocioId, setNegocioId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ─── Carga el carrito desde el backend ───────────────────────────────────
  const reloadCart = useCallback(async () => {
    try {
      const carritoData = await getCarritoApi();
      const newCart: CartItemConId[] = carritoData.items.map((item) => ({
        idItem: item.id_item,
        product: {
          id: String(item.id_producto ?? item.id_servicio ?? 0),
          name: item.nombre,
          description: "",
          price: item.precio_unitario,
          image: "",
          images: [],
          category: "general",
          rating: 0,
          reviewCount: 0,
          stock: 99,
          sellerId: "0",
          sellerName: item.empresa,
          reviews: [],
          type: item.tipo_item,
          status: "Aprobado" as const,
        },
        quantity: item.cantidad,
      }));
      setCart(newCart);
    } catch {
      // Si falla (no logueado o carrito vacío) no hacemos nada
    }
  }, []);

  // ─── Carga las direcciones del backend ───────────────────────────────────
  const reloadAddresses = useCallback(async () => {
    try {
      const dirs = await getMisDireccionesApi();
      setAddresses(dirs);
    } catch {
      setAddresses([]);
    }
  }, []);

  // ─── Carga los métodos de pago del backend ───────────────────────────────
  const reloadPaymentMethods = useCallback(async () => {
    try {
      const metodos = await getMisMetodosPagoApi();
      setPaymentMethods(metodos);
    } catch {
      setPaymentMethods([]);
    }
  }, []);

  const reloadWishlist = useCallback(async () => {
    try {
      const data = await getWishlistItemsApi();
      const products: WishlistProduct[] = data.items.map((item) => {
        const isService = item.id_servicio != null;
        return {
          wishlistItemId: item.id,
          id: String(item.id_producto ?? item.id_servicio ?? item.id),
          name: item.producto_nombre ?? item.servicio_nombre ?? "Item guardado",
          description: "",
          price: Number(item.producto_precio ?? item.servicio_precio ?? 0),
          image: "",
          images: [],
          category: "general",
          rating: 0,
          reviewCount: 0,
          stock: 99,
          sellerId: "0",
          sellerName: "",
          reviews: [],
          type: isService ? "servicio" : "producto",
          status: "Aprobado" as const,
        };
      });
      setWishlist(products);
    } catch {
      setWishlist([]);
    }
  }, []);

  // ─── AUTH ─────────────────────────────────────────────────────────────────

  const login = useCallback(async (email: string, password: string): Promise<User | null> => {
    setIsLoading(true);
    try {
      const userWithNegocio = await loginApi(email, password);
      setCurrentUser(userWithNegocio);
      // Guardar id_negocio si es vendedor
      if (userWithNegocio.id_negocio) {
        setNegocioId(userWithNegocio.id_negocio);
      }
      // Cargar datos del usuario al loguearse
      await reloadCart();
      await reloadAddresses();
      await reloadPaymentMethods();
      await reloadWishlist();
      return userWithNegocio;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [reloadCart, reloadAddresses, reloadPaymentMethods, reloadWishlist]);

  const register = useCallback(async (
    name: string,
    email: string,
    password: string,
    role: "admin" | "comprador" | "vendedor"
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      await registerApi(name, email, password, role as "admin" | "comprador" | "vendedor");
      // Después del registro, hacer login automático
      const user = await loginApi(email, password);
      setCurrentUser(user);
      return true;
    } catch (error) {
      console.error("Error al registrar:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await logoutApi();
    } catch {
      // Ignoramos errores de logout (el back puede redirigir)
    } finally {
      setCurrentUser(null);
      setCart([]);
      setWishlist([]);
      setOrders([]);
      setAddresses([]);
      setPaymentMethods([]);
      setNegocioId(null);
      setIsLoading(false);
    }
  }, []);

  // ─── CARRITO ──────────────────────────────────────────────────────────────

  const addToCart = useCallback(async (
    product: Product,
    quantity = 1,
    _selectedDate?: string,
    _selectedTime?: string
  ) => {
    if (!currentUser) {
      // Si no está logueado, mostrar en local temporalmente
      setCart((prev) => {
        const existing = prev.find((i) => i.product.id === product.id);
        if (existing) {
          return prev.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock || 99) }
              : i
          );
        }
        return [...prev, { product, quantity }];
      });
      return;
    }

    try {
      if (product.type === "servicio") {
        await addServicioAlCarritoApi(Number(product.id), quantity);
      } else {
        await addProductoAlCarritoApi(Number(product.id), quantity);
      }
      await reloadCart();
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      throw error; // Propaga para que la página pueda mostrar el error
    }
  }, [currentUser, reloadCart]);

  const removeFromCart = useCallback(async (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    if (!item?.idItem || !currentUser) {
      // Local (no logueado)
      setCart((prev) => prev.filter((i) => i.product.id !== productId));
      return;
    }
    try {
      await deleteItemCarritoApi(item.idItem);
      await reloadCart();
    } catch (error) {
      console.error("Error al eliminar del carrito:", error);
    }
  }, [cart, currentUser, reloadCart]);

  const updateCartQuantity = useCallback(async (productId: string, quantity: number) => {
    const item = cart.find((i) => i.product.id === productId);
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    if (!item?.idItem || !currentUser) {
      // Local
      setCart((prev) =>
        prev.map((i) => i.product.id === productId ? { ...i, quantity } : i)
      );
      return;
    }
    try {
      await updateItemCarritoApi(item.idItem, quantity);
      await reloadCart();
    } catch (error) {
      console.error("Error al actualizar carrito:", error);
    }
  }, [cart, currentUser, removeFromCart, reloadCart]);

  const clearCart = useCallback(async () => {
    if (!currentUser) {
      setCart([]);
      return;
    }
    try {
      await vaciarCarritoApi();
      setCart([]);
    } catch (error) {
      console.error("Error al vaciar carrito:", error);
    }
  }, [currentUser]);

  const getCartTotal = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const getCartCount = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // ─── WISHLIST (local por ahora) ───────────────────────────────────────────

  const addToWishlist = useCallback(async (product: Product) => {
    if (!currentUser) {
      setWishlist((prev) => {
        if (prev.find((p) => p.id === product.id)) return prev;
        return [...prev, product];
      });
      return;
    }

    try {
      const result = await addToWishlistApi(
        product.type === "servicio" ? undefined : Number(product.id),
        product.type === "servicio" ? Number(product.id) : undefined
      );
      setWishlist((prev) => {
        if (prev.find((p) => p.id === product.id)) return prev;
        return [...prev, { ...product, wishlistItemId: result.item.id }];
      });
    } catch (error) {
      console.error("Error al agregar a wishlist:", error);
      throw error;
    }
  }, [currentUser]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    const item = wishlist.find((p) => p.id === productId);
    if (!currentUser || !item?.wishlistItemId) {
      setWishlist((prev) => prev.filter((p) => p.id !== productId));
      return;
    }

    try {
      await removeFromWishlistApi(item.wishlistItemId);
      setWishlist((prev) => prev.filter((p) => p.id !== productId));
    } catch (error) {
      console.error("Error al eliminar de wishlist:", error);
      throw error;
    }
  }, [currentUser, wishlist]);

  const isInWishlist = useCallback(
    (productId: string) => wishlist.some((p) => p.id === productId),
    [wishlist]
  );

  // ─── PEDIDOS ──────────────────────────────────────────────────────────────

  const placeOrder = useCallback(async (
    _address: string,
    idDireccion?: number,
    idMetodoPago?: number
  ): Promise<Order> => {
    setIsLoading(true);
    try {
      const result = await checkoutApi(idDireccion, idMetodoPago);
      const newOrder: Order = {
        id: String(result.pedido.id),
        folio: `ORD-${result.pedido.id}`,
        date: result.pedido.fecha_creacion?.split("T")[0] ?? new Date().toISOString().split("T")[0],
        items: [...cart],
        total: result.pedido.total,
        status: "En preparacion",
        buyerName: currentUser?.name ?? "Usuario",
        buyerId: currentUser?.id ?? "0",
        address: _address,
      };
      setOrders((prev) => [newOrder, ...prev]);
      setCart([]);
      return newOrder;
    } finally {
      setIsLoading(false);
    }
  }, [cart, currentUser]);

  // ─── DIRECCIONES ──────────────────────────────────────────────────────────

  const addAddress = useCallback(async (address: Omit<Address, "id">) => {
    if (!currentUser) {
      setAddresses((prev) => [...prev, { ...address, id: `a${Date.now()}` }]);
      return;
    }
    try {
      await addDireccionApi(address);
      await reloadAddresses();
    } catch (error) {
      console.error("Error al agregar dirección:", error);
      throw error;
    }
  }, [currentUser, reloadAddresses]);

  const removeAddress = useCallback(async (id: string) => {
    if (!currentUser) {
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      return;
    }
    try {
      await deleteDireccionApi(Number(id));
      await reloadAddresses();
    } catch (error) {
      console.error("Error al eliminar dirección:", error);
      throw error;
    }
  }, [currentUser, reloadAddresses]);

  // ─── Verifica si hay sesión activa al cargar la app ───────────────────────
  useEffect(() => {
    getMiCuentaApi()
      .then(async (user) => {
        setCurrentUser(user);
        // Restaurar id_negocio si es vendedor
        if (user.id_negocio) {
          setNegocioId(user.id_negocio);
        }
        await reloadCart();
        await reloadAddresses();
        await reloadPaymentMethods();
        await reloadWishlist();
      })
      .catch(() => {
        // No hay sesión activa, es normal
      });
  }, [reloadCart, reloadAddresses, reloadPaymentMethods, reloadWishlist]);

  return (
    <StoreContext.Provider
      value={{
        currentUser,
        cart,
        wishlist,
        orders,
        addresses,
        paymentMethods,
        negocioId,
        isLoggedIn: !!currentUser,
        isLoading,
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
        reloadAddresses,
        reloadPaymentMethods,
        updateNegocioId: setNegocioId,
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
