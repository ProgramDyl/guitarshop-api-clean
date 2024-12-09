import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import '../ui/Signup.css';

export default function Signup() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [serverError, setServerError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const apiHost = import.meta.env.VITE_API_HOST;
    const apiUrl = `${apiHost}/api/users/signup`; 
    const navigate = useNavigate();

    // handle form submission
    const onSubmit = async (data) => {
        // map form data
        const formattedData = {
            email: data.email,
            password: data.password,
            first_name: data.firstName, 
            last_name: data.lastName, 
        };
        console.log('submitting formatted data:', formattedData); 

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', 
                // send formatted data
                body: JSON.stringify(formattedData), 
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to sign up.');
            }

            // set success message if signup is successful
            setSuccessMessage('Signup Successful!');
            setServerError(null);
        } catch (error) {
            
            console.error('Signup error occurred: ', error);
            setServerError(error.message);
            setSuccessMessage(null);
        }
    };

    return (
        <div className="main-content">
            <div className="signup-container">
                <h2 className="signup-title">Sign up</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label>First Name</label>
                        <input type="text" {...register('firstName', { required: true })} placeholder="Enter your first name" />
                        {errors.firstName && <span className="error-message">first name is required</span>}
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input type="text" {...register('lastName', { required: true })} placeholder="Enter your last name" />
                        {errors.lastName && <span className="error-message">last name is required</span>}
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" {...register('email', { required: true })} placeholder="Enter your email" />
                        {errors.email && <span className="error-message">email is required</span>}
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" {...register('password', { required: true })} placeholder="Enter your password" />
                        {errors.password && <span className="error-message">password is required</span>}
                    </div>
                    {serverError && <span className="error-message">{serverError}</span>}
                    {successMessage && <span className="success-message">{successMessage}</span>}
                    &nbsp;
                    <br></br>
                    <br></br>
                    <div>
                    <button onClick={() => navigate('/login')} type="submit" className="btn-submit">Sign up</button>
                    </div>

                </form>
                <Link to="/login">Already have an account? Login here</Link>
            </div>
        </div>
    );
}
