import { setConfig } from "./configManager.js";
import { insertProdToIndex } from "./productManager.js";

/**
 * Récupère la promesse de la fonction "setConfig",
 * Envoie une requête fetch à l'api afin de récuperer tout les produits,
 * Appelle la fonction "insertProdToIndex" du fichier "productManager.js",
 * Insert les produits dans le HTML de la page "index.html"
 */
async function displayProducts() {
  let config = await setConfig();
  let res = await fetch(config.host + "/api/products")
  let products = await res.json();
  insertProdToIndex(products);
}

displayProducts();
