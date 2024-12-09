import { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCookies } from 'react-cookie';

export default function Login() {
    const { setIsLoggedIn } = useOutletContext(); // get the setIsLoggedIn function from context
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [serverError, setServerError] = useState(); 
    const [successMessage, setSuccessMessage] = useState(null); 
    const apiHost = import.meta.env.VITE_API_HOST; 
    const apiUrl = `${apiHost}/api/users/login`; 
    const navigate = useNavigate(); 
    const [cookies, setCookie] = useCookies(['authToken']); //init user token

    // handle form submission 
    const onSubmit = async (data) => {
        // map the form data to match the server's expected field names
        const formattedData = {
            email: data.email,
            password: data.password
        };
        console.log('Submitting data: ', formattedData); // log the submitted data

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // include credentials with the request
                // send the formatted data
                body: JSON.stringify(formattedData),
            });

            if (!response.ok) {
                // capture and throw error message from the server
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to log in.');
            }


            const responseData = await response.json();
            const token = responseData.token;

            //save token in cookies to store login across refreshes :)
            setCookie('authToken', token, { path: '/', maxAge: 3000 });

            setSuccessMessage('Log-in Successful!'); // set success message
            setServerError(null); // clear any server errors
            setIsLoggedIn(true); // update login state to true
            setTimeout(() => navigate('/'), 2000); // redirect to the home page after 2 seconds
        } catch (error) {
            console.error('Login error occurred: ', error); // log the error
            setServerError(error.message); // set server error message
            setSuccessMessage(null); // clear success message
        }
    };

    return (
        <div className="main-content">
            <div className="login-container">
                <h2 className="login-title">Login</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="text" {...register('email', { required: true })} placeholder="Enter email" />
                        {errors.email && <span className="error-message">Email is required</span>}
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" {...register('password', { required: true })} placeholder="Enter password" />
                        {errors.password && <span className="error-message">Password is required</span>}
                    </div>
                    {serverError && <span className="error-message">{serverError}</span>}
                    {successMessage && <span className="success-message">{successMessage}</span>}
                    <div>
                        <button type="submit" className="btn-submit">Log In</button>
                    </div>
                </form>
                <Link to="/signup">Don't have an account? Signup here</Link>
            </div>
        </div>
    );
}
