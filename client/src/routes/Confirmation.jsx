import { Link } from 'react-router-dom';

const Confirmation = () => {
    return (
        <div>
            <h1>Purchase Complete</h1>
            <p>Thank you for your purchase! Your order has been successfully processed.</p>
            <Link to="/" className="btn btn-primary mt-3 ml-2">Continue Shopping</Link>
        </div>
    );
};

export default Confirmation;
