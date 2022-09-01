import { setConfig } from "./manager/Config.js";
import Cart from "./manager/Cart.js";
import Product from "./manager/Product.js";
import {
  displayFormError,
  displaySystemError,
  displayCartError,
} from "./errors.js";

/**
 * AFFICHE LES PRODUITS DU PANIER ET LE FORMULAIRE DE COMMANDE:
 * Appelle la fonction "getProductInfos()".
 * Appelle la fonction "displayOrderForm()".
 */
function displayProdToCart() {
  getProductInfos();
  displayOrderForm();
}

/**
 * GERE LA RECUPERATION D'INFOS DANS L'API DE CHAQUE PRODUIT DANS LE LOCALSTORAGE:
 * Récupère le panier du "localStorage" via la méthode "cartFromStorage()" de la classe "Cart".
 * Si le panier est "truethy" (non vide, non null, non undefined etc...)
 *  1 - pour chaque produit dans le "localStorage" récupère les infos du produit dans l'API avec son ID
 *   1-1 - si la réponse (objet JSON) à la requête est OK:
 *    1-1-1 - appelle la fonction "spreadInfos()" avec en paramètres:
 *            les infos provenant de l'APi et celles provenant du "localStorage".
 *  1-2 - sinon (il y a un probleme avec la réponse):
 *    1-2-1 - appelle la fonction "displaySystemError()" du fichier "errors.js".
 * Sinon (le localStorage est vide): retourne un tableau vide.
 * @returns {[Object]}  Un tableau vide (si le panier est vide)
 * Si une erreur système survient:
 *  - "capture" la et envoi la à la fonction "displaySystemError()".
 */
async function getProductInfos() {
  let cart = Cart.cartFromStorage();

  try {
    if (cart) {
      for (let prodFromStorage of cart) {
        let config = await setConfig();
        let id = prodFromStorage._id;
        let response = await fetch(config.host + "/api/products/" + id);
        let prodFromApi = await response.json();

        if (prodFromApi) {
          spreadInfos(prodFromApi, prodFromStorage);
        } else {
          displaySystemError(prodFromApi);
        }
      }
    } else {
      return [];
    }
  } catch (error) {
    displaySystemError(error);
  }
}

/**
 * GERE LA RECOMPOSITION DU PRODUIT ET LA PROPAGATION DE SES INFOS
 * VERS SES OUTILS DE GESTION (AFFICHAGE, QUANTITE, SUPPRESSION, QUANTITE ET PRIX TOTAL, ERREURS):
 * Appelle les fonctions:
 * "insertProdToCart(), getItemQuantity(), getDeleteItem() et totalCart() avec en paramètres:
 *  - les infos provenant de l'APi
 *  - les infos provenant du "localStorage"
 *  - le tout étant regroupé avec le "Spread Operator" dans "prodInfos".
 * @param {Object} prodFromApi       Produit récupéré depuis l'API
 * @param {Object} prodFromStorage   Produit récupéré depuis le localStorage
 */
function spreadInfos(prodFromApi, prodFromStorage) {
  let prodInfos = {
    ...prodFromStorage,
    name: prodFromApi.name,
    price: prodFromApi.price,
    imageUrl: prodFromApi.imageUrl,
    description: prodFromApi.description,
    altTxt: prodFromApi.altTxt,
    colors: prodFromApi.colors,
  };

  insertProdToCart(prodInfos);
  getItemQuantity(prodInfos);
  getDeleteItem(prodInfos);
  totalCart(prodInfos);
}

/**
 * GERE L'AFFICHAGE DES PRODUITS SUR LA PAGE CART
 * Fait une requête sur le selecteur ayant comme id "cart__items",
 * construit un nouvel objet "product" avec les infos recupérées dans "prodInfos",
 * et insere le dans le HTML via la méthode "templCartProduct()" de la classe "Product",
 * en passant en paramètre les infos de "prodInfos"
 * @param {object} prodInfos       Produit recomposé
 */
function insertProdToCart(prodInfos) {
  let cartItems = document.querySelector("#cart__items");
  let product = new Product(prodInfos);

  cartItems.insertAdjacentHTML(
    "beforeend",
    product.templCartProduct(prodInfos)
  );
}

/**
 * PREPARE LES CHANGEMENTS DE QUANTITE D'UN PRODUIT:
 * Ajoute un écouteur à chaque selecteur "itemQuantity".
 * A chaque changement du bouton "quantité":
 *  1 - Appelle la méthode "quantity() de la classe "Cart" ,
 *      en lui passant comme paramètres les valeurs de:
 *      - quantité: récupérée depuis la valeur de l'élément cible et convertie en nombre
 *      - couleur et ID: récupérée depuis data-id et data-color du HTML
 *  2 - Appelle la fonction "totalCart()"
 * @param {object} prodInfos       Produit recomposé
 */
function getItemQuantity(prodInfos) {
  document.querySelectorAll(".itemQuantity").forEach((quantityButton) => {
    quantityButton.addEventListener("change", (e) => {
      Cart.quantity({
        quantity: parseInt(e.target.value),
        color: e.target.closest(".cart__item").dataset.color,
        _id: e.target.closest(".cart__item").dataset.id,
      });

      totalCart(prodInfos);
    });
  });
}

/**
 * PREPARE LA SUPPRESSION D'UN PRODUIT:
 * Ajoute un écouteur à chaque selecteur "deleteItem".
 * A chaque click sur l'élément bouton "supprimer":
 *  1 - appelle la méthode "delete()" de la classe "Cart",
 *    qui va supprimer le produit du localStorage,
 *    en rentrant comme paramètre l'ID du produit récupéré dans le HTML de l'élément cible "cart__item".
 *  2 - supprime du HTML l'élément cible "cart__item" le plus proche.
 *  3 - appelle la fonction "totalCart()".
 * @param {object} prodInfos       Produit recomposé
 */
function getDeleteItem(prodInfos) {
  document.querySelectorAll(".deleteItem").forEach((deleteButton) => {
    deleteButton.addEventListener("click", (e) => {
      e.preventDefault();
      Cart.delete({
        _id: e.target.closest(".cart__item").dataset.id,
      });

      e.target.closest(".cart__item").remove();

      totalCart(prodInfos);
    });
  });
}

/**
 * GERE LA QUANTITE ET LE PRIX TOTAL DU PANIER:
 * Récupère le panier via la méthode "cartFromStorage() de la classe "Cart".
 * 1 - Si le panier est "falsy" (null, undefined, etc...) OU vide (longueur de tableau à 0)
 *  1-1 - defini les elements HTML "quantité" et "prix" = 0
 * 2 - Sinon (le panier contient au moins 1 produit):
 *  2-1 - pour chaque produit dans le panier:
 *        ajoute aux éléments HTML:
 *        - "qnt": ajouter la quantité du produit provenant du "localStorage"
 *        - "price": ajouter la quantité du produit dans le "localStorage",
 *                   multiplié par le prix du produit provenant de l'API.
 * @param {object} prodInfos       Produit recomposé
 */
function totalCart(prodInfos) {
  let cart = Cart.cartFromStorage();
  let qnt = 0;
  let price = 0;

  if (!cart || cart.length == 0) {
    document.getElementById("totalQuantity").textContent = qnt;
    document.getElementById("totalPrice").textContent = price;
  } else {
    for (let prodFromStorage of cart) {
      qnt += prodFromStorage.quantity;
      price += prodFromStorage.quantity * prodInfos.price;
      document.getElementById("totalQuantity").textContent = qnt;
      document.getElementById("totalPrice").textContent = price;
    }
  }
}

/**
 * GERE LE FORMULAIRE DE COMMANDE:
 * Appelle la fonction "displayFormError()" du fichier "errors.js"
 * Ajoute un écouteur sur le bouton de soumission de formulaire.
 * Lors du click sur le bouton:
 * vérifie que les champs sont bien renseignés ET que le panier est prêt (ni vide, ni null, ni undefined)
 * 1 - si tout est OK:
 *  1-1 - envoie une requête à l'API avec la méthode "POST",
 *  1-2 - crée une clé "orderID" dans le localStorage contenant l'ID de la commande,
 *        qui est récupéré via la réponse de la requête à l'API.
 *  1-3 - ajoute l'ID de la commande dans l'URL de la page "confirmation.html",
 *  1-4 - efface du "localStorage" le panier et  l'ID de commande via la méthode "clear()" de la classe "Cart".
 * 2 - Sinon si le panier est vide: appelle la fonction "displayCartError" du fichier "errors.js"
 * 3 - Sinon (les champs sont mal remplis): "reportValidity()" renvoie un message d'erreur personnalisé.
 * Si une erreur système survient:
 *  - "capture" la et envoi la à la fonction "displaySystemError()".
 */
function displayOrderForm() {
  displayFormError();
  document
    .querySelector(".cart__order__form")
    .addEventListener("submit", async function (e) {
      e.preventDefault();
      let cart = Cart.cartFromStorage();

      try {
        if (this.reportValidity() && cart && cart.length !== 0) {
          let config = await setConfig();

          let response = await fetch(config.host + "/api/products/order", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contact: {
                firstName: this.querySelector('[name="firstName"]').value,
                lastName: this.querySelector('[name="lastName"]').value,
                address: this.querySelector('[name="address"]').value,
                city: this.querySelector('[name="city"]').value,
                email: this.querySelector('[name="email"]').value,
              },
              products: Cart.getProductId(),
            }),
          });

          let data = await response.json();
          localStorage.setItem("orderId", data.orderId);
          document.location.href = "confirmation.html?id=" + data.orderId;
          Cart.clear();
        } else if (cart.length === 0) {
          displayCartError();
        }
      } catch (error) {
        displaySystemError(error);
      }
    });
}

// ACTIVE LA FONCTION:
displayProdToCart();
