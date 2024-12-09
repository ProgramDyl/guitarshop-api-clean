import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useCookies } from 'react-cookie';
import '../ui/Details.css';
import { formatNumber } from '../lib/utils.js' 

export default function Details() {
  // get product id from params and set up navigation
  const { product_id } = useParams();
  const navigate = useNavigate();
  // initialize state and cookies
  const [guitar, setGuitar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cookies, setCookie] = useCookies(['cart']);

  // set api host and url for fetching data
  const apiHost = import.meta.env.VITE_API_HOST;
  const apiUrl = `${apiHost}/api/guitars/${product_id}`;

  // guitar details when apiUrl changes
  useEffect(() => {
    async function fetchGuitar() {
      try {
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          setGuitar(data);
        } else {
          console.error("Failed to fetch guitar details: ", response.status);
          setGuitar(null);
        }
      } catch (error) {
        console.error('Error fetching guitar details: ', error);
        setGuitar(null);
      } finally {
        setLoading(false);
      }
    }
    fetchGuitar();
  }, [apiUrl]);

  // get cart cookie value
  const getCartCookie = () => {
    return cookies.cart || '';
  };

  // set cart cookie value
  const setCartCookie = (value) => {
    setCookie('cart', value, { path: '/', maxAge: 3600 });
  };

  // update cart cookie with new product id
  const updateCartCookie = (productId) => {
    const currentCart = getCartCookie();
    const updatedCart = currentCart ? `${currentCart},${productId}` : productId;
    setCartCookie(updatedCart);
  };

  // add product to cart
  const addToCart = () => {
    updateCartCookie(product_id);
    alert('Guitar added to cart!');
    console.log(`Product ${product_id} added to cart`);
  };

  if (loading) {
    // display loading message
    return <p>Loading...</p>;
  }

  if (!guitar) {
    // display message if guitar not found
    return <p>Guitar not found.</p>;
  }

  // render guitar details and action buttons
  return (
    <div className="details-container text-center">
      <h1>{guitar.brand} {guitar.model}</h1>
      <img src={`${apiHost}/${guitar.image_filename}`} alt={`${guitar.brand} ${guitar.model}`} className="img-fluid mx-auto d-block" style={{ maxHeight: '400px' }} />
      <h3 className="text-success">${formatNumber(guitar.cost)}</h3>
      <p>{guitar.description}</p>
      <div className="additional-details">
        <ul className="list-group list-group-flush mx-auto" style={{ maxWidth: '500px' }}>
          <li className="list-group-item"><strong>Year:</strong> {guitar.year}</li>
          <li className="list-group-item"><strong>Body:</strong> {guitar.body}</li>
          <li className="list-group-item"><strong>Color:</strong> {guitar.color}</li>
          <li className="list-group-item"><strong>Electric:</strong> {guitar.is_electric ? 'Yes' : 'No'}</li>
          <li className="list-group-item"><strong>Scale:</strong> {guitar.scale}</li>
        </ul>
      </div>
      <button onClick={() => navigate(-1)} className="btn btn-secondary mt-3">Go Back</button>
      <button onClick={addToCart} className="btn btn-primary mt-3 ml-2">Add to Cart</button>
      <button onClick={() => navigate('/')} className="btn btn-primary mt-3 ml-2">Continue Shopping</button>
      <button onClick={() => navigate('/checkout')} className="btn btn-secondary mt-3">Complete Purchase</button>
    </div>
  );
}
