const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Vérifier si le nom d'utilisateur et le mot de passe sont fournis
  if (username && password) {
    // Vérifier si l'utilisateur existe déjà dans le tableau 'users'
    const userExists = users.some((user) => user.username === username);

    if (!userExists) {
      // Ajouter le nouvel utilisateur
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "Utilisateur enregistré avec succès. Vous pouvez vous connecter." });
    } else {
      return res.status(400).json({ message: "Cet utilisateur existe déjà !" });
    }
  }

  return res.status(400).json({ message: "Nom d'utilisateur ou mot de passe manquant." });
});

// Get the book list available in the shop
// Tâche 10 : Obtenir la liste des livres disponibles en utilisant des callbacks de Promesse ou async-await
public_users.get('/', async function (req, res) {
    // Création d'une promesse pour simuler une opération asynchrone
    const getBooksPromise = new Promise((resolve, reject) => {
      if (books) {
        resolve(books);
      } else {
        reject("Impossible de charger les livres.");
      }
    });
  
    try {
      // Attente de la résolution de la promesse (Asynchrone via async/await)
      const availableBooks = await getBooksPromise;
      return res.status(200).send(JSON.stringify(availableBooks, null, 4));
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  });
  

//   // Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   // Récupère l'ISBN depuis les paramètres de l'URL
//   const isbn = req.params.isbn;
  
//   // Extrait le livre correspondant de l'objet 'books'
//   const book = books[isbn];

//   if (book) {
//     // Renvoie le livre trouvé avec un statut 200 OK
//     return res.status(200).send(JSON.stringify(book, null, 4));
//   } else {
//     // Renvoie une erreur si l'ISBN n'existe pas
//     return res.status(404).json({ message: "Livre non trouvé" });
//   }
//  });

// Tâche 11 : Obtenir les détails du livre en fonction de l'ISBN en utilisant des Promesses ou async-await
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
  
    // Création d'une promesse pour simuler une opération d'extraction asynchrone
    const getBookByIsbnPromise = new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject("Aucun livre trouvé avec cet ISBN.");
      }
    });
  
    try {
      // Attente de la résolution de la promesse
      const bookDetails = await getBookByIsbnPromise;
      return res.status(200).send(JSON.stringify(bookDetails, null, 4));
    } catch (error) {
      return res.status(404).json({ message: error });
    }
  });
  
  
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//   const authorParam = req.params.author.toLowerCase();
//   const keys = Object.keys(books); // Indice 1 : Obtenir toutes les clés
//   const matchingBooks = [];

//   // Indice 2 : Itérer à travers le tableau 'books'
//   keys.forEach(key => {
//     if (books[key].author.toLowerCase() === authorParam) {
//       matchingBooks.push({ isbn: key, ...books[key] });
//     }
//   });

//   if (matchingBooks.length > 0) {
//     return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
//   } else {
//     return res.status(404).json({ message: "Aucun livre trouvé pour cet auteur" });
//   }
// });

// Tâche 12 : Obtenir les détails du livre en fonction de l'Auteur en utilisant des Promesses ou async-await
public_users.get('/author/:author', async function (req, res) {
    const authorParam = req.params.author.toLowerCase();
  
    // Création d'une promesse pour simuler une opération asynchrone de filtrage
    const getBooksByAuthorPromise = new Promise((resolve, reject) => {
      const keys = Object.keys(books);
      const matchingBooks = [];
  
      keys.forEach(key => {
        if (books[key].author.toLowerCase() === authorParam) {
          matchingBooks.push({ isbn: key, ...books[key] });
        }
      });
  
      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject("Aucun livre trouvé pour cet auteur.");
      }
    });
  
    try {
      // Attente de la résolution de la promesse
      const booksFound = await getBooksByAuthorPromise;
      return res.status(200).send(JSON.stringify(booksFound, null, 4));
    } catch (error) {
      return res.status(404).json({ message: error });
    }
  });


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const titleParam = req.params.title.toLowerCase();
  const keys = Object.keys(books);
  const matchingBooks = [];

  // Parcourir tous les livres pour trouver les titres correspondants
  keys.forEach(key => {
    if (books[key].title.toLowerCase() === titleParam) {
      matchingBooks.push({ isbn: key, ...books[key] });
    }
  });

  if (matchingBooks.length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } else {
    return res.status(404).json({ message: "Aucun livre trouvé avec ce titre" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    // Renvoie uniquement l'objet contenant les avis du livre
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Livre non trouvé" });
  }
});

module.exports.general = public_users;
