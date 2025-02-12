import React, { useEffect, useState } from "react";
import axios from "axios";

const ShowProfile = () => {
  const [activeSection, setActiveSection] = useState("details");
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
  });
  const [addressForm, setAddressForm] = useState({
    address: "",
    city: "",
    state: "",
    pin_code: "",
    country: ""
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, addressesRes, ordersRes] = await Promise.all([
          axios.get("http://localhost:8000/api/profile/", {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
          }),
          axios.get("http://localhost:8000/api/addresses/", {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
          }),
          axios.get("http://localhost:8000/api/orders/", {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
          })
        ]);
        
        setUser(profileRes.data);
        setFormData(profileRes.data);
        setAddresses(addressesRes.data);
        setOrders(ordersRes.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/addresses/", addressForm, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
      });
      setAddresses([...addresses, response.data]);
      setAddressForm({ address: "", city: "", state: "", pin_code: "", country: "" });
    } catch (error) {
      setError("Failed to save address");
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.put("http://localhost:8000/api/profile/", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
      });
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      window.dispatchEvent(new Event('userUpdates'));
      setIsEditing(false);
    } catch (error) {
      setError("Failed to update profile");
    }
  };

  const handlePayment = async () => {
    if (!selectedAddress) {
      setError('Please select a delivery address');
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:8000/api/orders/${selectedOrder.id}/`,
        {
          status: 'Processing',  // Update status
          payment_method: paymentMethod,
          shipping_address: selectedAddress
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        }
      );

      // Update local orders state
      setOrders(orders.map(order => 
        order.id === selectedOrder.id ? response.data : order
      ));
      
      setSelectedOrder(null);
      alert('Payment processed successfully! Order is now being processed.');

    } catch (error) {
      console.error('Payment failed:', error);
      setError(error.response?.data?.error || 'Payment processing failed');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Profile Dashboard</h1>
      
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveSection("details")}
            className={`px-4 py-2 rounded ${activeSection === "details" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Personal Details
          </button>
          <button
            onClick={() => setActiveSection("addresses")}
            className={`px-4 py-2 rounded ${activeSection === "addresses" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Addresses
          </button>
          <button
            onClick={() => setActiveSection("orders")}
            className={`px-4 py-2 rounded ${activeSection === "orders" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Order History
          </button>
        </div>

        {activeSection === "details" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Personal Information</h2>
            <div className="container mx-auto p-4">
              <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Profile</h1>
              <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-bold">Name</h2>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        className="w-full p-2 border rounded mb-2"
                      />
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </>
                  ) : (
                    <p>{user.first_name} {user.last_name}</p>
                  )}
                </div>
                <div className="mb-4">
                  <h2 className="text-xl font-bold">Email</h2>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                  ) : (
                    <p>{user.email}</p>
                  )}
                </div>
                <div className="mb-4">
                  <h2 className="text-xl font-bold">Phone Number</h2>
                  {isEditing ? (
                    <input
                      type="text"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                  ) : (
                    <p>{user.phone_number}</p>
                  )}
                </div>
                <div className="flex justify-end">
                  {isEditing ? (
                    <button
                      onClick={handleSave}
                      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-300"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-300"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "addresses" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Manage Addresses</h2>
            <form onSubmit={handleAddressSubmit} className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Address"
                  value={addressForm.address}
                  onChange={(e) => setAddressForm({...addressForm, address: e.target.value})}
                  className="p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="City"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                  className="p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="State"
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                  className="p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="PIN Code"
                  value={addressForm.pin_code}
                  onChange={(e) => setAddressForm({...addressForm, pin_code: e.target.value})}
                  className="p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={addressForm.country}
                  onChange={(e) => setAddressForm({...addressForm, country: e.target.value})}
                  className="p-2 border rounded"
                  required
                />
              </div>
              <button type="submit" className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
                Add Address
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <div key={address.id} className="bg-gray-50 p-4 rounded-lg">
                  <p>{address.address}</p>
                  <p>{address.city}, {address.state} - {address.pin_code}</p>
                  <p>{address.country}</p>
                  <div className="mt-2 flex gap-2">
                    <button className="text-blue-500">Edit</button>
                    <button className="text-red-500">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "orders" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Order History</h2>
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setSelectedOrder(order)}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">Order #{order.id}</span>
                    <span className={`px-2 py-1 rounded ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : order.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {order.status}
                    </span>
                  </div>
                  <p>Total: ₹{order.total_price}</p>
                  <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
                  <p>Payment Method: {order.payment_method}</p>
                  {order.shipping_address && (
                    <p>Address: {order.shipping_address.address}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Order #{selectedOrder.id}</h3>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="mb-4">
                <p className="font-semibold">Total: ₹{selectedOrder.total_price}</p>
                <p className="text-sm text-gray-600">
                  Date: {new Date(selectedOrder.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-medium">Delivery Address</label>
                <select
                  value={selectedAddress}
                  onChange={(e) => setSelectedAddress(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Address</option>
                  {addresses.map(address => (
                    <option key={address.id} value={address.id}>
                      {address.address}, {address.city} - {address.pin_code}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block mb-2 font-medium">Payment Method</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="credit_card"
                      checked={paymentMethod === 'credit_card'}
                      onChange={() => setPaymentMethod('credit_card')}
                    />
                    Credit Card
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="debit_card"
                      checked={paymentMethod === 'debit_card'}
                      onChange={() => setPaymentMethod('debit_card')}
                    />
                    Debit Card
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                    />
                    Cash on Delivery
                  </label>
                </div>
              </div>

              <button
                onClick={handlePayment}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowProfile;