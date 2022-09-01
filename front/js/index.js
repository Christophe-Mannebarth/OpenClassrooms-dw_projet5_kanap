import { setConfig } from "./manager/Config.js";
import { displaySystemError } from "./errors.js";
import Product from "./manager/Product.js";

/**
 * AFFICHE TOUT LES PRODUITS SUR LA PAGE INDEX:
 * Récupère la réponse de la fonction "setConfig()",
 * Envoie une requête fetch à l'API afin de récuperer tout les produits,
 * Appelle la fonction "insertProdToIndex()":
 *   - avec la réponse de la requête, les produits, convertis en objets JSON, passés en paramètre.
 * Si une erreur systeme survient:
 *  - "capture" la et envoie la à la fonction displaySystemError() du fichier "errors.js".
 */
async function displayProdToIndex() {
  let config = await setConfig();

  try {
    let response = await fetch(config.host + "/api/products");
    let products = await response.json();
    insertProdToIndex(products);
  } catch (error) {
    displaySystemError(error);
  }
}

/**
 * PARAMETRE L'AFFICHAGE DES PRODUITS SUR LA PAGE INDEX
 * Fait une requête sur le sélecteur ayant comme id "items".
 * Pour chaque produit ("product") trouvé dans la réponse ("products"):
 *  1 - construit un nouvel objet avec les infos recupérées de l'API,
 *  2 - insert le dans le HTML de la page "index.html",
 *      via la méthode "templProduct()" de la classe "Product".
 * @param  {object} products Les produits récupérés depuis l'API
 */
function insertProdToIndex(products) {
  let items = document.querySelector("#items");
  for (let product of products) {
    product = new Product(product);
    items.insertAdjacentHTML("beforeend", product.templProduct());
  }
}

// ACTIVE LA FONCTION:
displayProdToIndex();
