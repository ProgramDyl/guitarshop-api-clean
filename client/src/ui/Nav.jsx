import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useCookies } from 'react-cookie'; 

export default function Nav({ isLoggedIn }) {
    const [cookies] = useCookies(['cart']);

    //function to calculate the total number of products in cart
    const getCartCount = () => {
        const cartCookie = cookies.cart || '';
        const productIds = cartCookie.split(',');
        return productIds.length;
    };

    const cartItemCount = getCartCount();
    
    return (
        <nav style={{ display: 'flex', justifyContent: 'space-around', padding: '10px', backgroundColor: 'linear-gradient(135deg, #003135, #141619)', borderBottom: '2px solid #e94560' }}>
           
            <Link to="/" className="btn btn-primary" backgroundColor="#303C6C" style={{ margin: '0 10px' }}>Home</Link>
           
            {!isLoggedIn && <Link to="/login" className="btn btn-primary" style={{ margin: '0 10px' }}>Login</Link>}
           
            <Link to="/cart" className="btn btn-primary bi bi-cart" style={{ margin: '0 10px' }}>
                <span>({cartItemCount})</span> 
            </Link>
            
            {isLoggedIn && <Link to="/logout" className="btn btn-primary" style={{ margin: '0 10px' }}>Logout</Link>}
        </nav>
    );
    
}

