import express from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../lib/utility.js';
import session from 'express-session';
import PasswordValidator from 'password-validator';

const usersRouter = express.Router();
const prisma = new PrismaClient();

// Create a schema
const schema = new PasswordValidator();

// Add properties to it
schema
  .is().min(8)                                    // Minimum length 8
  .has().uppercase()                              // Must have uppercase letters
  .has().lowercase()                              // Must have lowercase letters
  .has().digits()                                 // Must have digits
  .has().not().spaces();                          // Should not have spaces



// Sign up -- POST
usersRouter.post('/signup', async (req, res) => {
    const { email, password, first_name, last_name } = req.body;

    if (!email || !password || !first_name || !last_name) {
        return res.status(400).json({ message: 'Missing: Required Field(s).' });
    }

    const passwordValidationErrors = schema.validate(password, { details: true });
    if (passwordValidationErrors.length > 0) {
        return res.status(400).json({
            message: 'Password does not meet the policy requirements',
            errors: passwordValidationErrors
        });
    }

    const existingCustomer = await prisma.customer.findUnique({
        where: {
            email: email,
        }
    });
    if (existingCustomer) {
        return res.status(400).json({ message: 'User already exists\n' });
    }

    const hashedPassword = await hashPassword(password);

    const customer = await prisma.customer.create({
        data: {
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: hashedPassword
        }
    });

    res.json({ 'customer': email });
});


// Log-in -- POST
usersRouter.post('/login', async (req, res) => {

    // Get user inputs
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
        return res.status(400).json({ message: 'Missing required fields.' });
    };

    // Find user in database
    const existingCustomer = await prisma.customer.findUnique({
        where: {
            email: email,
        }
    });
    if (!existingCustomer) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Compare/verify password entered to stored password
    const passwordMatch = await comparePassword(password, existingCustomer.password);
    if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid password' });
    }
    
    // Setup user session data
    req.session.email = existingCustomer.email;
    req.session.customer_id = existingCustomer.customer_id;
    req.session.first_name = existingCustomer.first_name;
    req.session.last_name = existingCustomer.last_name;
    console.log('logged in customer: ', + req.session.customer_id + '\n' + req.session.email);

    // Send response
    res.json({ message: 'Login successfull' });
});

// Logout
usersRouter.get('/logout', (req, res) => {
    req.session.destroy();
    res.send('Logout successful.');
});

// Get user session
usersRouter.get('/session', (req, res) => {

    try {
        res.json({ 'id: ': req.session.customer_id, 'email: ': req.session.email, 'Name ': req.session.first_name + ' ' + req.session.last_name });
    } catch {
        return res.status(401).send('User not logged in.');
    }
});

export default usersRouter;
