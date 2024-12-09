import express from 'express';
import { PrismaClient } from '@prisma/client';
import session from 'express-session';

const guitarsRouter = express.Router();

 // Prisma setup
 const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
 });


//Routes
//get all guitars 
guitarsRouter.get('/all', async (req, res) => {
    try {
        const guitars = await prisma.guitars.findMany();
        console.log("Fetched Guitars: ", guitars);
        res.json(guitars);
        console.log("Guitars retrieved");
    } catch (error) {
        console.error("Error fetching all guitars: ", error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});



guitarsRouter.get('/:id', async (req, res) => {

    const id = req.params.id;
    console.log(id);
    
    if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid number.'});
        return;
    }
    try {
        const guitar = await prisma.guitars.findUnique({
            where: {product_id: parseInt(id) },
        });
        if (guitar) {
            res.json(guitar);
        } else {
            res.status(404).json({ message: 'Guitar not found.' });
        }
    } catch (error) {
        console.error(`Error fetching guitar with id ${id}:`, error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default guitarsRouter;

