import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  Calendar, 
  Package, 
  Truck,
  BarChart3
} from 'lucide-react';
import ProductForm from '../components/inventory/ProductForm';
import { parseISO, differenceInDays } from 'date-fns';
import { useEffect } from 'react';
import api from "../api/axiosInstance"; 



  const InventoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  // Define the Product type
  type Product = {
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    costPrice: number;
    cost_price: number; // Added property
    quantity: number;
    reorderLevel: number;
    expiryDate: string;
    sku: string;
    barcode: string;
    qrcode: string; // Added property
    batchNumber: string;
    manufacturer: string;
    location: string;
    image?: string;
    createdAt: string;
    updatedAt: string;
  };
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  if (!id) return;

  api.get(`products/${id}/`)
    .then((response) => {
      setProduct(response.data);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching product:", error);
      setError("Failed to load product details.");
      setLoading(false);
    });
}, [id]);

if (loading) return <p>Loading...</p>;
if (error || !product) return <p className="text-red-500">Product not found.</p>;

  
  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
        <button
          onClick={() => navigate('/inventory')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Inventory
        </button>
      </div>
    );
  }
  
  const isLowStock = product.quantity <= product.reorderLevel;
  const expiryDate = parseISO(product.expiryDate);
  const daysToExpiry = differenceInDays(expiryDate, new Date());
  const isExpiringSoon = daysToExpiry <= 90;
  
  const handleUpdateProduct = (updatedProduct: Partial<Product>) => {
    // In a real app, this would call an API to update the product
    console.log('Updating product:', updatedProduct);
    setIsEditing(false);
    // After successful update, we would refresh the product data
  };
  
  const handleDeleteProduct = () => {
    // In a real app, this would call an API to delete the product
    if (window.confirm('Are you sure you want to delete this product?')) {
      console.log('Deleting product:', product.id);
      navigate('/inventory');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between ">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/inventory')}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
            title="Back to Inventory"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Edit size={16} className="mr-2" />
            Edit
          </button>
          <button
            onClick={handleDeleteProduct}
            className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Trash2 size={16} className="mr-2" />
            Delete
          </button>
        </div>
      </div>
      
      {isEditing ? (
        <div className="bg-white rounded-lg shadow-md p-6 ">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Edit Product</h2>
          <ProductForm
            product={product}
            onSubmit={handleUpdateProduct}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-64 overflow-hidden">
                  <img
                    src={product.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500">{product.category}</span>
                    <span className="text-lg font-bold text-indigo-600">₹{product.price}</span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  
                  <div className="space-y-2">
                    {isLowStock && (
                      <div className="flex items-center text-red-600">
                        <AlertTriangle size={16} className="mr-2" />
                        <span className="text-sm font-medium">
                          Low Stock: {product.quantity} units (Reorder at {product.reorderLevel})
                        </span>
                      </div>
                    )}
                    
                    {isExpiringSoon && (
                      <div className="flex items-center text-orange-600">
                        <Calendar size={16} className="mr-2" />
                        <span className="text-sm font-medium">
                          Expires in {daysToExpiry} days ({product.expiryDate})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-medium text-gray-900 mb-4">Product Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Basic Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">SKU</span>
                        <span className="text-sm font-medium">{product.sku}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Barcode</span>
                        <span className="text-sm font-medium">{product.barcode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Batch Number</span>
                        <span className="text-sm font-medium">{product.batchNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Manufacturer</span>
                        <span className="text-sm font-medium">{product.manufacturer}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Inventory Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Quantity in Stock</span>
                        <span className={`text-sm font-medium ${isLowStock ? 'text-red-600' : ''}`}>
                          {product.quantity} units
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Reorder Level</span>
                        <span className="text-sm font-medium">{product.reorderLevel} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Storage Location</span>
                        <span className="text-sm font-medium">{product.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Expiry Date</span>
                        <span className={`text-sm font-medium ${isExpiringSoon ? 'text-orange-600' : ''}`}>
                          {product.expiryDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Pricing Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Selling Price</span>
                        <span className="text-sm font-medium">₹{product.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Cost Price</span>
                        <span className="text-sm font-medium">₹{product.costPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Profit Margin</span>
                        <span className="text-sm font-medium">
                          {(((product.price - product.costPrice) / product.price) * 100).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Tracking Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Created At</span>
                        <span className="text-sm font-medium">{product.createdAt}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Last Updated</span>
                        <span className="text-sm font-medium">{product.updatedAt}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center mb-4">
                    <Package size={20} className="text-indigo-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">Stock Management</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Adjust Stock Level
                    </button>
                    <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Print Barcode Label
                    </button>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center mb-4">
                    <Truck size={20} className="text-indigo-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">Order Management</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Create Purchase Order
                    </button>
                    <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      View Order History
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <BarChart3 size={20} className="text-indigo-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Sales Analytics</h3>
            </div>
            
            <p className="text-gray-500 text-center py-8">
              Sales analytics and AI-powered demand forecasting will be displayed here
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default InventoryDetail;