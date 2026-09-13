const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
// Vérifier si la session contient un jeton d'authentification
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken']; // Récupérer le jeton d'accès

        // Valider le jeton JWT
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user; // Stocker les informations de l'utilisateur dans la requête
                next(); // Passer au middleware ou à la route suivante
            } else {
                return res.status(403).json({ message: "Utilisateur non authentifié" });
            }
        });
    } else {
        return res.status(403).json({ message: "Utilisateur non connecté" });
    }
});

const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
