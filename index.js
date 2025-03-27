

import express from 'express';
import dbConnect from './dbconnect.js'; // Import DB connection
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import mailRoutes from './routes/sendMailRoute.js'
import authRoutes from './routes/authRoute.js';
import categoryRoutes from './routes/categoryRoute.js'; // Ensure the path is correct
import subCategoryRoutes from './routes/subCategoryRoute.js';
import customerRoutes from './routes/customerRoute.js';
import countryRoutes from './routes/countryRoutes.js';
import stateRoutes from './routes/stateRoutes.js';
import cityRoutes from './routes/cityRoute.js';
import addressRoutes from './routes/addressRoutes.js';
import productRoutes from "./routes/productRoutes.js";
import orderRoute from './routes/orderRoutes.js';
import cartRoute from './routes/cartRoutes.js';
import logoRoute from './routes/logoRoute.js'
import bannerRoute from './routes/bannerRoute.js';



dotenv.config();

const app = express();

// Connect to MongoDB
dbConnect()
// mongoose.connect('mongodb://localhost:27017/sigmait', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
//     .then(() => console.log("Connected to the local MongoDB database successfully"))
//     .catch((error) => console.error("Error connecting to MongoDB:", error));

// Middlewares
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '2mb' }));
app.use(cookieParser());
// app.use(cors());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true
}))

// Serve static files
const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/docs', express.static(path.join(__dirname, 'docs')));

// Use the route middlewares
app.use('/api/send-mail', mailRoutes);
app.use('/api', categoryRoutes);
app.use('/api/sub-category', subCategoryRoutes);

app.use('/api', authRoutes); // 
app.use('/api/customer', customerRoutes);
app.use('/api/country', countryRoutes);
app.use('/api/state', stateRoutes);
app.use('/api/city', cityRoutes);
app.use('/api/address', addressRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);
app.use("/api/logo", logoRoute);
app.use("/api/banner", bannerRoute);

// app.use('/api/auth', authRoutes); // Ensure this is correct

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});