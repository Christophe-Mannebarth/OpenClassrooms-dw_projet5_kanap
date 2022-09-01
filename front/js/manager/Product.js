// Classe exportée représentant un produit et ses méthodes pour l'afficher.
export default class Product {
  /**
   * Construit un objet "Product" en utilisant la méthode "Object.assign()"
   * qui copie les valeurs de toutes les propriétés d'un objet source vers un objet cible
   * @param {Object} objProduct Objet "produit"
   */
  constructor(objProduct) {
    this && Object.assign(this, objProduct);
  }

  /**
   * TEMPLATE POUR L'AFFICHAGE DES PRODUITS SUR LA PAGE INDEX:
   * Retourne un template avec les propriétés de l'objet "product"
   * sous forme de chaîne de caractères qui sera traitée par
   * la fonction "insertProdToIndex()" du fichier "index.js".
   * @param   {object}  product               l'objet "produit":
   * @param   {string}  product._id           ID de l'objet "produit"
   * @param   {string}  product._imageUrl     Image de l'objet "produit"
   * @param   {string}  product._name         Nom de l'objet "produit"
   * @param   {string}  product._description  Description de l'objet "produit"
   * @returns {String}                        Un template contenant les propriétés de l'objet "produit"
   */
  templProduct() {
    return `<a href="./product.html?id=${this._id}">
                    <article>
                    <img src="${this.imageUrl}" alt="Photographie d'un canapé Kanap ${this.name}">
                    <h3 class="productName">${this.name}</h3>
                    <p class="productDescription">${this.description}</p>
                    </article>
                </a>`;
  }

  /**
   * TEMPLATE POUR L'AFFICHAGE D'UN PRODUIT SUR LA PAGE CART:
   * Retourne un template avec les propriétés de l'objet "prodInfos"
   * sous forme de chaîne de caractères qui sera traitée par
   * la fonction "insertProdToCart()" du fichier "cart.js".
   * @param   {object}           prodInfos              Produit recomposé:
   * @param   {string}           prodInfos._id          ID du produit dans le locaStorage
   * @param   {string}           prodInfos.color        Couleur du produit dans le localStorage
   * @param   {number}           prodInfos.quantity     Quantité du produit dans le localStorage
   * @param   {string}           prodInfos.name         Nom du produit depuis l'API
   * @param   {string}           prodInfos.price        Prix du produit depuis l'API
   * @param   {string}           prodInfos.imageUrl     Image du produit depuis l'API
   * @param   {string}           prodInfos.description  Description du produit depuis l'API
   * @param   {string}           prodInfos.altTxt       Texte alternatif de l'image du produit depuis l'API
   * @param   {Array.<String>}   prodInfos.colors       Couleurs du produit depuis l'API
   * @returns {string}                                  Un template contenant les propriétés du produit recomposé
   */
  templCartProduct(prodInfos) {
    return `<article class="cart__item" data-id="${prodInfos._id}" data-color="${prodInfos.color}">
                    <div class="cart__item__img">
                        <img src="${prodInfos.imageUrl}" alt="Photographie d'un canapé ${prodInfos.name}">
                    </div>
                    <div class="cart__item__content">
                        <div class="cart__item__content__description">
                            <h2>${prodInfos.name}</h2>
                            <p>${prodInfos.color}</p>
                            <p>${prodInfos.price} €</p>
                        </div>
                        <div class="cart__item__content__settings">
                            <div class="cart__item__content__settings__quantity">
                                <p>Qté : </p>
                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${prodInfos.quantity}">
                            </div>
                            <div class="cart__item__content__settings__delete">
                                <p class="deleteItem">Supprimer</p>
                            </div>
                        </div>
                    </div>
                </article>`;
  }
}
