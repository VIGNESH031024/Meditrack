import React, { useState } from "react";
import QrScanner from "react-qr-scanner"; // ✅ Updated Import
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

interface Medicine {
  id: number;
  name: string;
  sku: string;
  price: number;
  quantity: number;
}

const Transaction: React.FC = () => {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  // Handle QR Code Scan
  const handleScan = async (data: string | null) => {
    if (data) {
      setScannedData(data);
      fetchMedicineDetails(data);
    }
  };

  // Fetch Medicine Details from API
  const fetchMedicineDetails = async (sku: string) => {
    try {
      const response = await api.get(`/products/?sku=${sku}`);
      if (response.data.length > 0) {
        setMedicine(response.data[0]);
        setError("");
      } else {
        setError("Medicine not found!");
      }
    } catch (err) {
      console.error("Error fetching medicine:", err);
      setError("Failed to fetch medicine details.");
    }
  };

  // Sell Medicine & Update Stock
  const handleSell = async () => {
    if (!medicine || quantity <= 0) return;

    try {
      await api.post("/sell-medicine/", {
        sku: medicine.sku,
        quantity: quantity,
      });

      alert("Sale successful! Stock updated.");
      
      // Update stock in UI
      setMedicine((prev) => (prev ? { ...prev, quantity: prev.quantity - quantity } : null));
      
      setScannedData(null);
      setQuantity(1);
    } catch (err) {
      console.error("Error selling medicine:", err);
      setError("Failed to update stock.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Sell Medicine (POS)</h1>
      
      {/* QR Scanner */}
      <div className="bg-white p-4 rounded-md shadow-md">
        <QrScanner
          delay={300}
          onScan={(data) => data && handleScan(data)}
          onError={(err) => console.error("QR Scanner Error:", err)}
          style={{ width: "100%" }}
        />
      </div>

      {/* Medicine Details */}
      {medicine ? (
        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-xl font-semibold">{medicine.name}</h2>
          <p>SKU: {medicine.sku}</p>
          <p>Price: ₹{medicine.price}</p>
          <p>Stock: {medicine.quantity}</p>

          <label className="block mt-4">
            Quantity to Sell:
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border p-2 rounded w-full"
              min="1"
              max={medicine.quantity}
            />
          </label>

          <button
            onClick={handleSell}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
          >
            Confirm Sale
          </button>
        </div>
      ) : (
        error && <p className="text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Transaction;
