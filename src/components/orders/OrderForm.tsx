import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

interface Product {
  id: number;
  name: string;
  unit_price: number;
}

interface Supplier {
  id: number;
  name: string;
}

interface OrderItem {
  product: Product;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Props {
  onSubmit: (order: { 
    items: { 
      product: { id: number }; 
      quantity: number; 
      unit_price: number; 
      total_price: number 
    }[]; 
    supplier: number;
    status: string; 
    payment_status: string;
    expected_delivery: string;
  }) => void;
  onCancel: () => void;
}

const OrderForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const [expectedDelivery, setExpectedDelivery] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsResponse, suppliersResponse] = await Promise.all([
          api.get("/products/"),
          api.get("/suppliers/")
        ]);
        setProducts(productsResponse.data);
        setSuppliers(suppliersResponse.data);
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddItem = (product: Product) => {
    const exists = items.find((item) => item.product.id === product.id);
    if (!exists) {
      const newItem = {
        product,
        quantity: 1,
        unit_price: product.unit_price || 0,
        total_price: product.unit_price || 0,
      };
      setItems([...items, newItem]);
    }
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    if (isNaN(quantity) || quantity < 1) return;
    
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      quantity,
      total_price: quantity * (updatedItems[index].unit_price || 0)
    };
    setItems(updatedItems);
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const handleSubmit = () => {
    if (!selectedSupplier) {
      setError("Please select a supplier");
      return;
    }
    
    if (items.length === 0) {
      setError("Please add at least one product");
      return;
    }

    const orderData = {
      items: items.map((item) => ({
        product: { id: item.product.id },
        quantity: item.quantity,
        unit_price: item.unit_price || 0,
        total_price: item.total_price || 0,
      })),
      supplier: selectedSupplier,
      status: "pending",
      payment_status: "unpaid",
      expected_delivery: expectedDelivery,
    };
    
    onSubmit(orderData);
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Create New Order</h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Supplier Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Supplier *
        </label>
        <select
          value={selectedSupplier || ""}
          onChange={(e) => {
            setSelectedSupplier(Number(e.target.value));
            setError(null);
          }}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select a supplier</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Expected Delivery Date */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Expected Delivery Date *
        </label>
        <input
          type="date"
          value={expectedDelivery}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => setExpectedDelivery(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      {/* Product Selection */}
      <div className="mb-6">
        <h3 className="text-md font-medium mb-2">Select Products</h3>
        <div className="space-y-2">
          {products.map((product) => (
            <div key={product.id} className="flex justify-between items-center border p-2 rounded">
              <span>{product.name}</span>
              <button
                className="px-3 py-1 bg-indigo-600 text-white text-sm rounded"
                onClick={() => handleAddItem(product)}
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-6">
        <h3 className="text-md font-medium mb-2">Order Items</h3>
        {items.length === 0 ? (
          <p className="text-gray-500">No items added yet</p>
        ) : (
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={`${item.product.id}-${index}`} className="flex justify-between items-center p-3 border rounded">
                <div className="flex-1">
                  <span>{item.product.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                    className="w-16 border rounded px-2 py-1 text-center"
                  />
                  <span className="w-20 text-right">
                    ₹{(item.total_price || 0).toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end space-x-3">
        <button 
          onClick={onCancel} 
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button 
          onClick={handleSubmit} 
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
          disabled={items.length === 0 || !selectedSupplier}
        >
          Create Order
        </button>
      </div>
    </div>
  );
};

export default OrderForm;