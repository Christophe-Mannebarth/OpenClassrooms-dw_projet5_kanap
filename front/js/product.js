import { setConfig } from "./manager/Config.js";
import Cart from "./manager/Cart.js";
import { displaySystemError, displayProductError } from "./errors.js";

/**
 * AFFICHE UN PRODUIT:
 * Récupère l'ID d'un produit dans l'URL,
 * Récupère la réponse de la fonction "setConfig()",
 * Envoie une requête fetch à l'api afin de récupérer un produit avec son ID récupéré avec "searchParams".
 * Appelle la fonction "insertProdToRetail()" en passant le "produit" (la "réponse" en JSON) en paramètre.
 * Appelle la fonction "getAddToCart()" en passant le produit en paramètre.
 * Si une erreur système survient:
 *  - "capture" la et envoie la à la fonction displaySystemError() du fichier "errors.js"
 * @param  {object} product  Un produit récupéré depuis l'API
 */
async function displayProdToRetail() {
  let id = new URL(window.location).searchParams.get("id");
  let config = await setConfig();

  try {
    let response = await fetch(config.host + "/api/products/" + id);
    let product = await response.json();

    insertProdToRetail(product);
    getAddToCart(product);
  } catch (error) {
    displaySystemError(error);
  }
}

/**
 * GERE L'AFFICHAGE D'UN PRODUIT SUR LA PAGE PRODUCT
 * Insert les propriétés d'un objet "produit" dans le HTML de la page "product.html",
 * via des requêtes par selecteur et la méthode "insertAdjacentHTM()".
 * @param  {object} product  Un produit récupéré depuis l'API
 */
function insertProdToRetail(product) {
  let item = document.querySelector(".item");

  item
    .querySelector(".item__img")
    .insertAdjacentHTML(
      "afterbegin",
      `<img src="${product.imageUrl}" alt="Photographie d'un canapé ${product.name}">`
    );

  item.querySelector("#title").insertAdjacentHTML("afterbegin", product.name);

  item.querySelector("#price").insertAdjacentHTML("afterbegin", product.price);

  item
    .querySelector("#description")
    .insertAdjacentHTML("afterbegin", product.description);

  item.querySelector("#colors").setAttribute("required", "required");

  item
    .querySelector("#colors")
    .insertAdjacentHTML(
      "beforeend",
      product.colors
        .map((color) => `<option value="${color}">${color}</option>`)
        .join()
    );
}

/**
 * PREPARE L'AJOUT D'UN PRODUIT DANS LE PANIER:
 * Ajoute un écouteur au selecteur ayant pour id "addToCart".
 * Lors du click sur le bouton "Ajouter au panier":
 * vérifie avec la méthode "reportValidity()":
 * si la quantité ET la couleur ont bien été renseignés,
 * ET si la valeur de quantité est bien présente.
 *  1 - si oui: récupère les valeurs de quantité et de couleur dans le HTML,
 *      et appelle la méthode "add()" de la classe "Cart" en passant le produit en paramètre.
 *      et envoie vers la page "cart.html".
 *  2 - sinon si: la valeur de quantité n'est pas conforme (champs vide)
 *        appelle la fonction "displayProductError()" du fichier "errors.js".
 *  3 - sinon (implicite): "reportValidity()" déclenche un message d'erreur indiquant le ou les champs mal renseignés.
 * @param  {object} product  Un produit récupéré depuis l'API
 */
function getAddToCart(product) {
  document.querySelector("#addToCart").addEventListener("click", function () {
    if (
      document.querySelector("#quantity").reportValidity() &&
      document.querySelector("#colors").reportValidity() &&
      parseInt(document.querySelector("#quantity").value) > 0
    ) {
      product.quantity = parseInt(document.querySelector("#quantity").value);
      product.color = document.querySelector("#colors").value;
      Cart.add(product);
      window.location.assign("cart.html");
    } else if (!parseInt(document.querySelector("#quantity").value)) {
      displayProductError(product);
    }
  });
}

// ACTIVE LA FONCTION:
displayProdToRetail();
