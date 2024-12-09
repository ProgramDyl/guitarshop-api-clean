import express from 'express';
import { PrismaClient } from '@prisma/client';

const purchaseRouter = express.Router();
const prisma = new PrismaClient();

// Purchase -- POST
purchaseRouter.post('/', async (req, res) => {
    // Validate if user is logged in
    if (!req.session || !req.session.customer_id) {
        console.log('Unauthorized access attempt');
        return res.status(401).send('Unauthorized: user must be logged in.');
    }

    console.log('Session:', req.session);
    console.log('Request body:', req.body);  // Log the entire request body

    // Purchase inputs
    const { 
        street,
        city,
        province, 
        country, 
        postal_code, 
        credit_card, 
        credit_expire, 
        credit_cvv, 
        cart, 
        // invoice_amt, 
        // invoice_tax, 
        // invoice_total 
    } = req.body;

    // Ensure correct data types
    const creditCardNumber = BigInt(credit_card); // Convert to BigInt
    const creditCvvNumber = parseInt(credit_cvv, 10);
    // const invoiceAmount = parseFloat(invoice_amt);
    // const invoiceTax = parseFloat(invoice_tax);
    // const invoiceTotal = parseFloat(invoice_total);

    // Log the received cart value
    console.log('Cart received:', cart);

    console.log('Purchase input:', { 
        street,
        city,
        province, 
        country, 
        postal_code, 
        credit_card: creditCardNumber, 
        credit_expire, 
        credit_cvv: creditCvvNumber, 
        cart, 
        // invoice_amt: invoiceAmount, 
        // invoice_tax: invoiceTax, 
        // invoice_total: invoiceTotal 
    });

    // Validate inputs
    if (!street || !city || !province || !country || !postal_code || !credit_card || !credit_expire || !credit_cvv || !cart) {
        console.log('Validation failed:', { street, city, province, country, postal_code, credit_card, credit_expire, credit_cvv, cart});
        return res.status(400).send('Missing required fields');
    }

    // Process cart
    const productIds = cart.split(',').map(id => parseInt(id));
    const productQuantity = {};

    
    for (const id of productIds) {
        if (productQuantity[id]) {
            productQuantity[id]++;
        } else {
            productQuantity[id] = 1;
        }
    }

    console.log('Product quantities:', productQuantity);

    try {
        // Transaction begins:
        const result = await prisma.$transaction(async (prisma) => {
            // Create new purchase
            const purchase = await prisma.purchase.create({
                data: {
                    //make sure datatypes match with schema!
                    customer_id: req.session.customer_id,
                    street,
                    city,
                    province,
                    country,
                    postal_code,
                    credit_card: creditCardNumber, 
                    credit_expire: new Date(credit_expire),
                    credit_cvv: creditCvvNumber, 
                
                }
            });

            // Create purchase items
            for (const [product_id, quantity] of Object.entries(productQuantity)) {
                await prisma.purchaseItem.create({
                    data: {
                        purchase_id: purchase.purchase_id,
                        product_id: parseInt(product_id),
                        quantity: quantity
                    }
                });
            }

            return purchase;
        });

        // Send response
        res.json({ message: 'Purchase successful', purchase_id: result.purchase_id });
    } catch (error) {
        console.error('Error processing purchase:', error);
        res.status(500).send('Internal server error');
    }
});

export default purchaseRouter;
