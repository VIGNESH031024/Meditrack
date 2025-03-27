import { useState } from "react";
import QrScanner from "react-qr-scanner";
import { ToastContainer, toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axiosInstance";
import { Search, Trash2, Plus, Minus } from "lucide-react";
import QRCode from "react-qr-code";
import "react-toastify/dist/ReactToastify.css";

interface Product {
  id: number;
  sku: string;
  name: string;
  price: number;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
  subtotal: number;
}

export default function Transaction() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isScannerEnabled, setScannerEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [googlePayLink, setGooglePayLink] = useState<string | null>(null);

  const totalAmount = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const fetchProductBySKU = async (sku: string) => {
    try {
      setIsLoading(true);
      const response = await api.get(`/product/sku/?sku=${sku}`);
      const product: Product = response.data;
      addToCart(product);
      toast.success(`Added ${product.name} to cart`);
    } catch {
      toast.error("Invalid SKU or product not found");
    } finally {
      setIsLoading(false);
    }
  };

  const handleScan = (data: { text?: string } | null) => {
    if (data?.text) {
      setScannerEnabled(false);
      fetchProductBySKU(data.text);
      setTimeout(() => setScannerEnabled(true), 1000);
    }
  };

  const handleError = (error: Error) => {
    console.error("QR Scanner Error:", error);
    toast.error("QR Scanner encountered an error");
  };

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        if (existingItem.quantity + 1 > product.stock) {
          toast.error(`Not enough stock for ${product.name}`);
          return prevCart;
        }
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1, subtotal: item.quantity * (Number(item.price) || 0)
            }
            : item
        );
      }

      return [...prevCart, { ...product, quantity: 1, subtotal: product.price }];
    });
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, newQuantity), subtotal: Math.max(1, newQuantity) * item.price }
          : item
      )
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const handleCompleteTransaction = async () => {
    if (cart.length === 0) {
      toast.warning("Cart is empty");
      return;
    }

    const payload = {
      medicines: cart.map((item) => ({ sku: item.sku, quantity: item.quantity })),
    };

    try {
      setIsLoading(true);
      const response = await api.post("/sell-medicine/", payload);
      toast.success(response.data.message || "Transaction completed successfully");
      setCart([]);
      setGooglePayLink(null);
    } catch (error) {
      console.error("Transaction error:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.error || "Failed to complete transaction"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const generateGooglePayQRCode = () => {
    const payUrl = `https://pay.google.com/gp/v/send?pa=merchant@upi&pn=Merchant&mc=1234&tid=TRANSACTION_ID&tr=${totalAmount}&tn=Payment for medicines&cu=INR`;
    setGooglePayLink(payUrl);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Scan QR Code</h2>
            {isScannerEnabled && (
              <div className="aspect-square max-w-md mx-auto overflow-hidden rounded-lg">
                <QrScanner
                  delay={300}
                  onError={handleError}
                  onScan={handleScan}
                  style={{ width: "100%" }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Shopping Cart</h2>
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">₹{(Number(item.price) || 0)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    title="Decrease quantity"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus size={16} />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    title="Increase quantity"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  type="button"
                  title="Remove item"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 size={18} className="text-red-500" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {cart.length > 0 && (
            <>
              <div className="mt-4 text-xl font-bold">Total: ₹{totalAmount}</div>
              <button
                type="button"
                onClick={generateGooglePayQRCode}
                className="w-full mt-4 bg-blue-500 text-white py-2 rounded"
              >
                Generate Google Pay QR
              </button>
              {googlePayLink && <QRCode value={googlePayLink} size={150} className="mt-4 mx-auto" />}
              <button
                type="button"
                onClick={handleCompleteTransaction}
                className="w-full mt-4 bg-green-500 text-white py-2 rounded"
              >
                Complete Transaction
              </button>
            </>
          )}
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}
