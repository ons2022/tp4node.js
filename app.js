const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const authRoutes = require('./routes/auth')
// const postRoutes = require('./routes/posts')
const swaggerDoc = require('./swagger')
dotenv.config()
const MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.PORT || 5000

//console.log(MONGODB_URI)
const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
// app.use('/auth', authRoutes)
// app.use('/posts', postRoutes)
// app.use('/api-docs', swaggerDoc.serve, swaggerDoc.setup)

let data = {
    name: "ons",
    tasks: ['sport', 'meeting', 'workshops']
}
//test app first route
// app.get('/', (req, res) => {
//     //return res.status(200).send('hello chabeb !')
//     res.render('home', { data: data })
// })

// app.get('/login', (req, res) => {
//     //return res.status(200).send('hello chabeb !')
//     res.render('login')
// })
// connection to mongodb and start server 
mongoose.connect(MONGODB_URI).then(() => {
    console.log('connected to MongoDb');
    app.listen(PORT, () => {
        console.log(`server listening on ${PORT}`)
    })
}).catch((err) => {
    console.error('Error connecting to mongodb:', err.message)
})
//Définir les modèles de données pour les catégories et les produits:
const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
});

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
});

const Category = mongoose.model('Category', CategorySchema);
const Product = mongoose.model('Product', ProductSchema);
// les api delete post and edit 
// Créer une catégorie
app.post('/categories', async (req, res) => {
    const { name, description } = req.body;
    const category = new Category({ name, description });
    await category.save();
    res.status(201).send(category);
});

// Modifier une catégorie
app.put('/categories/:id', async (req, res) => {
    const { name, description } = req.body;
    const category = await Category.findByIdAndUpdate(req.params.id, { name, description });
    if (!category) return res.status(404).send('Catégorie introuvable');
    res.send(category);
});

// Supprimer une catégorie
app.delete('/categories/:id', async (req, res) => {
    const category = await Category.findByIdAndRemove(req.params.id);
    if (!category) return res.status(404).send('Catégorie introuvable');
    res.send(category);
});

// Lister toutes les catégories
app.get('/categories', async (req, res) => {
    const categories = await Category.find().populate('products');
    res.send(categories);
});

// app.get('/categories', async (req, res) => {
//     const categories = await Category.find().populate('products');
//     res.send(categories);
// });

// Ajouter un produit à une catégorie
app.post('/categories/:categoryId/products', async (req, res) => {
    const { name, price, description } = req.body;
    const product = new Product({ name, price, description, category: req.params.categoryId });
    await product.save();
    res.status(201).send(product);
});

// Modifier un produit
app.put('/products/:id', async (req, res) => {
    const { name, price, description } = req.body;
    const product = await Product.findByIdAndUpdate(req.params.id, { name, price, description });
    if (!product) return res.status(404).send('Produit introuvable');
    res.send(product);
});

// Supprimer un produit
app.delete('/products/:id', async (req, res) => {
    const product = await Product.findByIdAndRemove(req.params.id);
    if (!product) return res.status(404).send('Produit introuvable');
    res.send
});
app.get('', (req, res) => {
    res.render('login'); // Render the home.ejs template
  });
  app.get('/main', (req, res) => {
    res.render('layout/main'); // Render the home.ejs template
  });
  app.get('/liste', (req, res) => {
    res.render('categorie/liste'); // Render the home.ejs template
  });
  

module.exports = app;