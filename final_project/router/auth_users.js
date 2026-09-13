const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({ message: "Erreur lors de la connexion : identifiants manquants" });
  }

  // Vérifier si l'utilisateur existe et si le mot de passe correspond
  const authenticatedUser = users.find(user => user.username === username && user.password === password);

  if (authenticatedUser) {
    // Générer le jeton d'accès JWT (valide 1 heure)
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    // Stocker le jeton dans l'autorisation de session
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("L'utilisateur s'est connecté avec succès");
  } else {
    return res.status(208).json({ message: "Connexion invalide. Vérifiez votre nom d'utilisateur et votre mot de passe" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review; // L'avis est envoyé en tant que paramètre de requête (Query string)
  const username = req.session.authorization['username']; // Récupère le nom de l'utilisateur connecté

  if (!review) {
    return res.status(400).json({ message: "Le contenu de l'avis ne peut pas être vide" });
  }

  const book = books[isbn];

  if (book) {
    // Ajoute ou met à jour l'avis de cet utilisateur spécifique sur ce livre
    book.reviews[username] = review;
    return res.status(200).send(`L'avis du livre avec l'ISBN ${isbn} a été ajouté / mis à jour avec succès.`);
  } else {
    return res.status(444).json({ message: "Livre non trouvé" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization['username']; // Récupère l'utilisateur connecté depuis la session

  const book = books[isbn];

  if (book) {
    // Vérifie si l'utilisateur a effectivement laissé un avis sur ce livre
    if (book.reviews[username]) {
      delete book.reviews[username]; // Supprime uniquement l'avis de cet utilisateur
      return res.status(200).send(`L'avis laissé par l'utilisateur ${username} pour le livre avec l'ISBN ${isbn} a été supprimé avec succès.`);
    } else {
      return res.status(404).json({ message: "Aucun avis trouvé pour cet utilisateur sur ce livre" });
    }
  } else {
    return res.status(404).json({ message: "Livre non trouvé" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
