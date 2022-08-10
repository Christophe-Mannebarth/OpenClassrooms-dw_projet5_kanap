// Classe exportée représentant un produit et ses méthodes de gestion.
 export default class Product {
    
    /**
     * Construit un objet Product en utilisant la méthode "Object.assign()"
     * qui copie les valeurs de toutes les propriétés d'un objet source vers un objet cible
     * @param {Object} objProduct 
     */
    constructor(objProduct) {
        this && Object.assign(this, objProduct);
    }

    /**
     * Retourne un template avec les propriétés de l'objet "Product" 
     * sous forme de chaîne de caractères qui sera traitée par 
     * la fonction "insertProdToIndex()" du fichier "insertProducts.js".
     * @returns {String} 
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
     * Calcule le prix total d'un produit.
     * @returns {int}
     */
    totalPriceProduct() {
        return this.price * this.quantity;
    }
}

/**
 * Fonction exportée vers la fonction "displayProducts()" du fichier "index.js".
 * Insert tous les produits dans le HTML de la page "index.html", 
 * via une boucle "for" et la méthode "templProduct()" de la classe "Product".
 */
 export function insertProdToIndex(products) {
    let items = document.querySelector("#items");
    for (let product of products) {
      product = new Product(product);
      items.insertAdjacentHTML("beforeend", product.templProduct());
    }
  }
  
  /**
   * Fonction exportée vers la fonction "displayProduct()" du fichier "product.js". 
   * Insert les propriétés d'un produit dans le HTML de la page "product.html", 
   * via des requêtes par selecteur et la méthode "insertAdjacentHTML".
   */
  export function insertProdToRetail(product) {
    let item = document.querySelector(".item");
    item
      .querySelector(".item__img")
      .insertAdjacentHTML(
        "afterbegin",
        `<img src="${product.imageUrl}" alt="Photographie d'un canapé ${product.name}">`
      );
  
    item
      .querySelector("#title")
      .insertAdjacentHTML("afterbegin", product.name);
  
    item
      .querySelector("#price")
      .insertAdjacentHTML("afterbegin", product.price);
  
    item
      .querySelector("#description")
      .insertAdjacentHTML("afterbegin", product.description);
  
    item
      .querySelector("#colors")
      .setAttribute("required", "required");
  
    item
      .querySelector("#colors")
      .insertAdjacentHTML(
        "beforeend",
        product.colors
          .map((color) => `<option value="${color}">${color}</option>`)
          .join()
      );
  }