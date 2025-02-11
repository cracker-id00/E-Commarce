import { useState, useEffect } from "react";
import axios from "axios";

function Home() {
  const [products, setProducts] = useState([]); // State to store products
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [cart, setCart] = useState([]);
  const token = localStorage.getItem("access_token");

  const handleAddToCart = async (productId) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/cart/',
        { product_id: productId },
        {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setCart(response.data.items);
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('You need to login first!');
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/products/")
      .then((response) => {
        setProducts(response.data); // Store data in state
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError("Failed to load products.");
        setLoading(false);
      });
  }, []); // Empty dependency array means this runs only on mount

  // Show loading state
  if (loading) return <p>Loading...</p>;

  // Show error message if request fails
  if (error) return <p className="text-red-500">{error}</p>;
  
  return (
    <div className="container mx-auto p-4">
  <h1 className="text-2xl font-bold mb-4">Home</h1>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {products.map((product) => (
      <div key={product.id} className="border rounded-lg p-4 shadow-lg relative group">
        <div className="overflow-hidden">
          <img
            src={`http://127.0.0.1:8000${product.image}`}
            alt={product.name}
            className="w-full h-48 object-cover mb-4 rounded transition-transform duration-300 ease-in-out group-hover:scale-110"
          />
        </div>
        <h2 className="text-lg font-bold">{product.name}</h2>
        <p className="text-gray-700">₹{product.price}</p>
        <button className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-300" onClick={() => handleAddToCart(product.id)}>
          Add to Cart
        </button>
      </div>
    ))}
  </div>
</div>
  );
}
export default Home;
