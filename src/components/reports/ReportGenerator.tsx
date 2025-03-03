import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Product, Order } from '../../types';
import { products, orders } from '../../data/mockData';
import { format } from 'date-fns';

interface ReportGeneratorProps {
  onGenerate: (url: string) => void;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ onGenerate }) => {
  const [reportType, setReportType] = useState<string>('inventory');
  const [dateRange, setDateRange] = useState<{start: string; end: string}>({
    start: format(new Date(new Date().setDate(new Date().getDate() - 30)), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd'),
  });
  
  const generateInventoryReport = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Inventory Report', 14, 22);
    
    // Add date
    doc.setFontSize(11);
    doc.text(`Generated on: ${format(new Date(), 'MMMM d, yyyy')}`, 14, 30);
    
    // Create table
    const tableColumn = ['SKU', 'Name', 'Category', 'Quantity', 'Reorder Level', 'Price', 'Expiry Date'];
    const tableRows = products.map(product => [
      product.sku,
      product.name,
      product.category,
      product.quantity.toString(),
      product.reorderLevel.toString(),
      `$${product.price.toFixed(2)}`,
      product.expiryDate,
    ]);
    
    // @ts-ignore
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [79, 70, 229] },
    });
    
    // Save the PDF
    const pdfUrl = doc.output('datauristring');
    onGenerate(pdfUrl);
  };
  
  const generateOrdersReport = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Orders Report', 14, 22);
    
    // Add date range
    doc.setFontSize(11);
    doc.text(`Period: ${format(new Date(dateRange.start), 'MMMM d, yyyy')} - ${format(new Date(dateRange.end), 'MMMM d, yyyy')}`, 14, 30);
    
    // Filter orders by date range
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= new Date(dateRange.start) && orderDate <= new Date(dateRange.end);
    });
    
    // Create table
    const tableColumn = ['Order #', 'Supplier', 'Date', 'Status', 'Total Amount'];
    const tableRows = filteredOrders.map(order => [
      order.orderNumber,
      order.supplier.name,
      order.createdAt,
      order.status,
      `$${order.totalAmount.toFixed(2)}`,
    ]);
    
    // @ts-ignore
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [79, 70, 229] },
    });
    
    // Add summary
    const totalAmount = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const pendingOrders = filteredOrders.filter(order => order.status === 'pending').length;
    const deliveredOrders = filteredOrders.filter(order => order.status === 'delivered').length;
    
    const startY = (doc as any).lastAutoTable.finalY + 10;
    
    doc.setFontSize(12);
    doc.text('Summary', 14, startY);
    doc.setFontSize(10);
    doc.text(`Total Orders: ${filteredOrders.length}`, 14, startY + 8);
    doc.text(`Pending Orders: ${pendingOrders}`, 14, startY + 16);
    doc.text(`Delivered Orders: ${deliveredOrders}`, 14, startY + 24);
    doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, 14, startY + 32);
    
    // Save the PDF
    const pdfUrl = doc.output('datauristring');
    onGenerate(pdfUrl);
  };
  
  const handleGenerateReport = () => {
    if (reportType === 'inventory') {
      generateInventoryReport();
    } else if (reportType === 'orders') {
      generateOrdersReport();
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium text-gray-700 mb-4">Generate Report</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="reportType" className="block text-sm font-medium text-gray-700">
            Report Type
          </label>
          <select
            id="reportType"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="inventory">Inventory Report</option>
            <option value="orders">Orders Report</option>
          </select>
        </div>
        
        {reportType === 'orders' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}
        
        <button
          onClick={handleGenerateReport}
          className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Generate Report
        </button>
      </div>
    </div>
  );
};

export default ReportGenerator;