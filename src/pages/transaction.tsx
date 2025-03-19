import React, { useState } from "react";
import QrScanner from "react-qr-scanner";
import api from "../api/axiosInstance";

interface Medicine {
  sku: string;
  name: string;
  price: number;
  quantity: number;
}

const Transaction: React.FC = () => {
  const [scannedMedicines, setScannedMedicines] = useState<Medicine[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const handleScan = async (result: { text: string } | null) => {
    if (result && result.text) {
      const sku = result.text.trim();
      try {
        const existingMedicine = scannedMedicines.find((med) => med.sku === sku);
        if (existingMedicine) {
          const updatedList = scannedMedicines.map((med) =>
            med.sku === sku ? { ...med, quantity: med.quantity + 1 } : med
          );
          setScannedMedicines(updatedList);
          calculateTotal(updatedList);
        } else {
          const response = await api.get(`product/sku/?sku=${sku}`);
          if (response.data) {
            const newMedicine = { ...response.data, quantity: 1 };
            const newList = [...scannedMedicines, newMedicine];
            setScannedMedicines(newList);
            calculateTotal(newList);
          } else {
            setError("Medicine not found.");
          }
        }
      } catch (err) {
        console.error("Error fetching medicine:", err);
        setError("Error fetching medicine details.");
      }
    }
  };

  const calculateTotal = (medicines: Medicine[]) => {
    const sum = medicines.reduce((acc, med) => acc + med.price * med.quantity, 0);
    setTotalAmount(sum);
  };

  const handleSell = async () => {
    if (scannedMedicines.length === 0) {
      setError("No items to sell.");
      return;
    }

    try {
      const response = await api.post("/api/sell-medicine/", {
        medicines: scannedMedicines.map((med) => ({
          sku: med.sku,
          quantity: med.quantity,
        })),
      });

      if (response.status === 200) {
        alert("Payment successful! Stock updated.");
        setScannedMedicines([]);
        setTotalAmount(0);
      } else {
        setError("Transaction failed. Please try again.");
      }
    } catch (err) {
      console.error("Error in transaction:", err);
      setError("Failed to complete sale.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Retail POS - Medicine Billing</h1>

      <div className="bg-white p-4 rounded shadow">
        <QrScanner
          delay={300}
          onError={(err) => console.error(err)}
          onScan={handleScan}
          style={{ width: "100%" }}
        />
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>

      {scannedMedicines.length > 0 && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-3">Billing Details</h2>
          <ul>
            {scannedMedicines.map((med) => (
              <li key={med.sku} className="flex justify-between mb-2">
                <span>
                  {med.name} x {med.quantity}
                </span>
                <span>₹{med.price * med.quantity}</span>
              </li>
            ))}
          </ul>
          <hr className="my-3" />
          <div className="text-xl font-bold flex justify-between">
            <span>Total:</span> <span>₹{totalAmount}</span>
          </div>
          <button
            onClick={handleSell}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
          >
            Confirm Payment
          </button>
        </div>
      )}
    </div>
  );
};

export default Transaction;
