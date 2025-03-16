import React, { useState, useEffect } from "react";
import { Plus, Filter, Search } from "lucide-react";
import ProductCard from "../components/inventory/ProductCard";
import ProductForm from "../components/inventory/ProductForm";
import api from "../api/axiosInstance"; // Import Axios instance
import { Product } from "../types";

const Inventory: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch inventory data from Django API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("products/"); // Use baseURL from axiosInstance
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching inventory:", error);
        setError("Failed to fetch inventory data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = Array.from(new Set(products.map((product) => product.category)));

  // Apply search and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === "" || product.category === categoryFilter;

    const matchesStock =
      stockFilter === "" ||
      (stockFilter === "low" && product.quantity <= product.reorderLevel) ||
      (stockFilter === "normal" && product.quantity > product.reorderLevel);

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Function to add a new product
  const handleAddProduct = async (product: Partial<Product>) => {
    try {
      const response = await api.post("products/", product);
      setProducts([...products, response.data]); // Update state with new product
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding product:", error);
      setError("Failed to add product.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-500">Manage your products and stock levels</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus size={20} className="mr-2" />
          Add Product
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>

          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <div className="flex items-center space-x-2">
              <Filter size={18} className="text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <select value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              <option value="">All Stock Levels</option>
              <option value="low">Low Stock</option>
              <option value="normal">Normal Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Show error if API fails */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Show loading state */}
      {loading ? (
        <p className="text-center text-gray-500">Loading inventory...</p>
      ) : (
        <>
          {showAddForm ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-medium text-gray-900 mb-4">Add New Product</h2>
              <ProductForm onSubmit={handleAddProduct} onCancel={() => setShowAddForm(false)} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No products found matching your criteria
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Inventory;
