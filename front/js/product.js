import { setConfig } from "./configManager.js";
import { insertProdToRetail } from "./productManager.js";

/**
 * Récupère l'ID d'un produit dans l'URL,
 * Récupère la fonction "setConfig()" du fichier "configManager.js",
 * Envoie une requête fetch à l'api afin de récupérer un produit avec son ID,
 * Appelle la fonction "insertProdToRetail()" du fichier "productManager.js", 
 * Affiche le produit sur la page "product.html",
 */
async function displayProduct() {
    let id = (new URL(window.location).searchParams.get("id"));
    let config = await setConfig();
    let res = await fetch(config.host + "/api/products/" + id);
    let product = await res.json();
    insertProdToRetail(product);
}

displayProduct();