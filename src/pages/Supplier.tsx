import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { Plus, Pencil, Trash, Search } from "lucide-react";

// Supplier interface
interface Supplier {
  id: number;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  status?: "active" | "inactive" | string;
}

// Format status string
const formatStatus = (status?: string) => {
  return status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown";
};

// Get badge color class
const getStatusBadgeClass = (status?: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "inactive":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    api
      .get("suppliers/")
      .then((response) => setSuppliers(response.data))
      .catch((error) => console.error("Error fetching suppliers:", error));
  }, []);

  const handleDelete = (id: number) => {
    api
      .delete(`suppliers/${id}/`)
      .then(() => setSuppliers(suppliers.filter((supplier) => supplier.id !== id)))
      .catch((error) => console.error("Error deleting supplier:", error));
  };

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
          <p className="text-gray-500">Manage your supplier information</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <Plus size={20} className="mr-2" />
          Add Supplier
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center space-x-4">
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Supplier Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3">Contact Person</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Address</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{supplier.name}</td>
                    <td className="px-6 py-4">{supplier.contact_person}</td>
                    <td className="px-6 py-4">{supplier.email}</td>
                    <td className="px-6 py-4">{supplier.phone}</td>
                    <td className="px-6 py-4">{supplier.address}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                          supplier.status
                        )}`}
                      >
                        {formatStatus(supplier.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex space-x-2">
                      <button
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                        title="Edit Supplier"
                      >
                        <Pencil className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        className="p-2 bg-red-100 rounded-lg hover:bg-red-200"
                        title="Delete Supplier"
                        onClick={() => handleDelete(supplier.id)}
                      >
                        <Trash className="h-4 w-4 text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center text-gray-500 py-4">
                    No suppliers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
