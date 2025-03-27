import React, { useState, useEffect } from 'react';
import { Order, Product, Supplier, OrderItem } from '../../types';
import { suppliers, products } from '../../data/mockData';
import { X, Plus } from 'lucide-react';

interface OrderFormProps {
  order?: Order;
  onSubmit: (order: Partial<Order>) => void;
  onCancel: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({
  order,
  onSubmit,
  onCancel,
}) => {
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    order ? order.supplier : null
  );
  
  const [orderItems, setOrderItems] = useState<OrderItem[]>(
    order ? order.products : []
  );
  
  const [notes, setNotes] = useState<string>(order?.notes || '');
  
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    if (selectedSupplier) {
      const supplierProducts = products.filter(product => 
        selectedSupplier.products.includes(product.id)
      );
      setAvailableProducts(supplierProducts);
      
      // Remove products that are no longer available from this supplier
      setOrderItems(prev => 
        prev.filter(item => 
          supplierProducts.some(p => p.id === item.product.id)
        )
      );
    } else {
      setAvailableProducts([]);
      setOrderItems([]);
    }
  }, [selectedSupplier]);
  
  const handleSupplierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const supplierId = e.target.value;
    const supplier = suppliers.find(s => s.id === supplierId) || null;
    setSelectedSupplier(supplier);
  };
  
  const handleAddItem = () => {
    if (availableProducts.length > 0) {
      const product = availableProducts[0];
      const newItem: OrderItem = {
        product,
        quantity: 1,
        unitPrice: product.cost_price,
        totalPrice: product.cost_price,
      };
      setOrderItems([...orderItems, newItem]);
    }
  };
  
  const handleRemoveItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };
  
  const handleItemChange = (index: number, field: string, value: string | number) => {
    const updatedItems = [...orderItems];
    const item = { ...updatedItems[index] };
    
    if (field === 'product') {
      const product = availableProducts.find(p => p.id === value) || item.product;
      item.product = product;
      item.unitPrice = product.cost_price;
      item.totalPrice = product.cost_price * item.quantity;
    } else if (field === 'quantity') {
      const quantity = parseInt(value.toString()) || 0;
      item.quantity = quantity;
      item.totalPrice = item.unitPrice * quantity;
    } else if (field === 'unitPrice') {
      const unitPrice = parseFloat(value.toString()) || 0;
      item.unitPrice = unitPrice;
      item.totalPrice = unitPrice * item.quantity;
    }
    
    updatedItems[index] = item;
    setOrderItems(updatedItems);
  };
  
  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSupplier || orderItems.length === 0) {
      return;
    }
    
    const orderData: Partial<Order> = {
      supplier: selectedSupplier,
      products: orderItems,
      totalAmount: calculateTotal(),
      notes,
      status: 'pending',
      paymentStatus: 'pending',
    };
    
    onSubmit(orderData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">
          Supplier *
        </label>
        <select
          id="supplier"
          value={selectedSupplier?.id || ''}
          onChange={handleSupplierChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select Supplier</option>
          {suppliers.map(supplier => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
        </select>
      </div>
      
      {selectedSupplier && (
        <div className="border rounded-md p-4 bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Supplier Details</h3>
          <p className="text-sm text-gray-600">Contact: {selectedSupplier.contactPerson}</p>
          <p className="text-sm text-gray-600">Email: {selectedSupplier.email}</p>
          <p className="text-sm text-gray-600">Phone: {selectedSupplier.phone}</p>
        </div>
      )}
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-700">Order Items *</h3>
          <button
            type="button"
            onClick={handleAddItem}
            disabled={availableProducts.length === 0}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <Plus size={16} className="mr-1" />
            Add Item
          </button>
        </div>
        
        {orderItems.length === 0 ? (
          <div className="text-center py-4 text-gray-500 border border-dashed rounded-md">
            {selectedSupplier 
              ? 'Add items to your order' 
              : 'Select a supplier first'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orderItems.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <select
                        value={item.product.id}
                        onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        aria-label={`Select product for item ${index + 1}`}
                      >
                        {availableProducts.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Enter quantity"
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                          className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="Enter unit price"
                          title="Unit Price"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${item.totalPrice.toFixed(2)}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-600 hover:text-red-800"
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <X size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td colSpan={3} className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                    Total:
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${calculateTotal().toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
      
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!selectedSupplier || orderItems.length === 0}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {order ? 'Update Order' : 'Create Order'}
        </button>
      </div>
    </form>
  );
};

export default OrderForm;