const express = require('express');
const cors = require('cors')
require('dotenv').config();
const db = require('./config/connection');
const rabbitMQ = require('./messaging/rabbitMQ');
const port = process.env.PORT || 2020;

// importing the routes
const userRoutes = require('./routes/authRoutes');
const biddingRoutes = require('./routes/biddingRoutes');
const {authVerification} = require('./middlewares/authMiddleware');
const paymentRoutes = require('./routes/paymentRoutes')
const notificationRoutes = require('./routes/notificationRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const roomRoutes = require('./routes/roomRoutes');

// const swaggerUi = require('swagger-ui-express');
// const swaggerFile = require('./swagger_output.json');

const app = express();
app.use(cors());
// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use('/api/v1', userRoutes);
app.use('/api/v1', [
    biddingRoutes,
    invoiceRoutes,
    notificationRoutes,
    paymentRoutes,
    roomRoutes
]);




// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

rabbitMQ.connect();

// app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))
// starting server
app.listen(port, ()=>{
    console.log(`listening to port:${port}`)
})


