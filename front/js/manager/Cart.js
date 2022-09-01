import Product from "./Product.js";
import { displayQuantityError } from "../errors.js";

/**
 * Classe exportée représentant le panier et ses méthodes de gestion.
 */
export default class Cart {
  /**
   * GERE LA RECUPERATION ET LA SERIALISATION DU PANIER DU LOCALSTORAGE:
   * via l'opérateur ternaire conditionnel:
   * si le panier est déja rempli: retourne sa valeur sous forme d'objet.
   * sinon: retourne un tableau vide.
   * @returns {[Object]}  L'objet "cart" contenant les produits présents dans le "localStorage"
   *                      ou un tableau vide
   */
  static cartFromStorage() {
    let cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  }

  /**
   * GERE L'AJOUT D'UN PRODUIT DANS LE PANIER:
   * Récupère le panier via la méthode "cartFromStorage()".
   * Defini un nouveau produit ayant comme paramètres son ID, sa couleur et sa quantité.
   * Cherche, via la méthode "find()":
   * si un produit avec le même ID et la même couleur est déjà présent dans le panier
   * si oui: augmente sa quantité (en s'assurant qu'elle ne dépasse pas 100)
   * si non: ajoute le nouveau produit dans le panier avec la méthode "push()".
   * Appelle la methode "save()" qui sauvegarde le panier dans le "localStorage".
   * @param {Product} product Le produit à ajouter au panier.
   */
  static add(product) {
    let cart = this.cartFromStorage();
    let newProduct = {
      _id: product._id,
      color: product.color,
      quantity: product.quantity,
    };

    let prodFound = cart.find(
      (prod) => prod._id == product._id && prod.color == product.color
    );
    if (prodFound != null) {
      prodFound.quantity += product.quantity;
      if (prodFound.quantity > 100) {
        prodFound.quantity = 100;
      }
    } else {
      cart.push(newProduct);
    }
    this.save(cart);
  }

  /**
   * GERE LA SUPPRESSION D'UN PRODUIT DU PANIER:
   * Récupère le panier via la méthode "cartFromStorage()".
   * Supprime du "localStorage" le produit avec l'ID correspondant,
   * via la méthode "filter()" qui ne garde dans le panier que les produits ayant un ID différent.
   * Appelle la methode "save()" qui sauvegarde le panier dans le "localStorage".
   * @param {Product} product Le produit à supprimer du panier.

   */
  static delete(product) {
    let cart = this.cartFromStorage();
    cart = cart.filter((prod) => prod._id != product._id);
    this.save(cart);
  }

  /**
   * GERE LES CHANGEMENTS DE QUANTITE D'UN PRODUIT DU PANIER:
   * Récupère le panier via la méthode "cartFromStorage()".
   * Cherche dans le panier, via la méthode find(), le produit ayant le même ID ET la même couleur.
   * Si la quantité saisie est en dessous de "1" OU dépasse "100" OU est "absente":
   *  - appelle la fonction displayQuantityError() du fichier errors.js,
   * Sinon:
   *  - remplace la quantité du produit trouvé avec find() par la nouvelle quantité saisie.
   *  - appelle la methode "save()" qui sauvegarde le panier dans le "localStorage".
   * @param {Product} product Le produit dont la quantité doit être modifiée.
   */
  static quantity(product) {
    let cart = this.cartFromStorage();
    let prodFound = cart.find(
      (prod) => prod._id == product._id && prod.color == product.color
    );

    if (product.quantity < 1 || product.quantity > 100 || !product.quantity) {
      displayQuantityError(prodFound);
    } else {
      prodFound.quantity = product.quantity;
      this.save(cart);
    }
  }

  /**
   * GERE LA SAUVEGARDE DU PANIER:
   * Enregistre les produits du panier dans le localStorage sous forme de chaîne de caractères "JSON".
   * @param {[Product]} cart Le panier à enregistrer.
   */
  static save(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  /**
   * GERE LA RECUPERATION DE L'ID D'UN PRODUIT DU PANIER:
   * Récupère le panier via la méthode "cartFromStorage()".
   * Si il est rempli (la longueur du tableau est >= 1):
   * retourne un nouveau tableau, via la méthode "map()", contenant l'ID du produit demandé.
   * Sinon: retourne un tableau vide.
   * @returns {[string]}  ID d'un des produits présent dans le panier
   *                      ou un tableau vide
   */
  static getProductId() {
    if (this.cartFromStorage().length >= 1) {
      return this.cartFromStorage().map((product) => product._id);
    } else {
      return [];
    }
  }

  /**
   * GERE LA SUPPRESSION DU PANIER ET DE L'ID DE COMMANDE:
   * Supprime les clés "cart" et "orderId" du "localStorage"
   */
  static clear() {
    localStorage.removeItem("cart");
    localStorage.removeItem("orderId");
  }
}
