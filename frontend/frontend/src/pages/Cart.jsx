import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const accessToken = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/cart/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        setCart(response.data.items);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setError('Failed to load cart.');
        setLoading(false);
      }
    };

    fetchCart();
  }, [accessToken]);

  const handleRemoveItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8000/api/cart/${itemId}/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setCart(cart.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing item:', error);
      setError('Failed to remove item.');
    }
  };

    const handleBuy = async () => {
      alert('Proceeding to buy items...');
      try {
        await axios.post('http://localhost:8000/api/orders/create/', {}, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        
        // Clear local cart state
        setCart([]);
        setError(null);
        alert('Order placed successfully!');
        
      } catch (error) {
        console.error('Order creation failed:', error);
        setError(error.response?.data?.error || 'Failed to place order');
      }
    };


  if (loading) return <p>Loading cart...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

 // Update the totalPrice calculation to use final price
const totalPrice = cart.reduce((total, item) => 
  total + (item.product.discount_price || item.product.price) * item.quantity, 0
);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1">
            {cart.map(item => (
              <div key={item.id} className="border p-4 mb-4 rounded-lg shadow-md flex">
                <img src={`http://localhost:8000${item.product.image}`} alt={item.product.name} className="w-24 h-24 object-cover mr-4 rounded" />
                <div>
                  <h3 className="text-lg font-semibold">{item.product.name}</h3>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ₹{item.product.price * item.quantity}</p>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="mt-2 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700 transition-colors duration-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:w-1/3 lg:ml-8 mt-8 lg:mt-0 p-4 border rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Total Price: ₹{totalPrice}</h3>
            <button
              onClick={handleBuy}
              className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors duration-300"
            >
              Buy Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;