/**
 * GERE LA VERIFICATION DE CONFORMITE DES CHAMPS DU FORMULAIRE DE COMMANDE,
 * ET L'AFFICHAGE DES MESSAGES D'ERREURS CORRESPONDANTS:
 * Fonction exportée vers la fonction "displayOrderForm()" du fichier "cart.js"
 * Ajoute un "pattern" et un "title" au selecteur ID de chaque champs du formulaire de commande.
 * Verifie, lors de la saisie, que chaque champs soit conforme au "pattern" via "patternMismatch",
 * ou au "type" avec "typeMismatch" pour le champs "email":
 * Si une erreur survient: affiche un message d'erreur sous le champs correspondant,
 * et prépare un message d'erreur personnalisé avec "setCustomValidity()",
 * qui s'affichera lors de la soumission du formulaire si l'utilisateur ignore le message précédent.
 * Sinon: n'affiche rien ou efface les messages d'erreurs précedents.
 */
export function displayFormError() {
  let firstName = document.getElementById("firstName");
  firstName.setAttribute("pattern", "[a-zA-ZÀ-ÿ- ]{2,30}");
  firstName.setAttribute(
    "title",
    "Votre prénom, formats acceptés: 2 lettres minimum, minuscules, majuscules, accents, tirets, espaces"
  );
  firstName.setAttribute("placeHolder", "ex: Jean");
  firstName.addEventListener("keyup", function (_event) {
    if (firstName.validity.patternMismatch) {
      firstName.setCustomValidity(
        "Formats valides: minuscules, majuscules, accents, tirets, espaces"
      );
      document.getElementById("firstNameErrorMsg").innerHTML =
        "Veuillez utiliser le bon format";
    } else {
      firstName.setCustomValidity("");
      document.getElementById("firstNameErrorMsg").innerHTML = "";
    }
  });
  let lastName = document.getElementById("lastName");
  lastName.setAttribute("pattern", "[a-zA-ZÀ-ÿ- ]{2,30}");
  lastName.setAttribute(
    "title",
    "Votre nom, formats acceptés: 2 lettres minimum, minuscules, majuscules, accents, tirets, espaces"
  );
  lastName.setAttribute("placeHolder", "ex: Martin");
  lastName.addEventListener("keyup", function (_event) {
    if (lastName.validity.patternMismatch) {
      lastName.setCustomValidity(
        "Formats valides: minuscules, majuscules, accents, tirets, espaces"
      );
      document.getElementById("lastNameErrorMsg").innerHTML =
        "Veuillez renseigner votre nom";
    } else {
      lastName.setCustomValidity("");
      document.getElementById("lastNameErrorMsg").innerHTML = "";
    }
  });
  let address = document.getElementById("address");
  address.setAttribute("pattern", "[a-zA-ZÀ-ÿ0-9- ]{2,30}");
  address.setAttribute(
    "title",
    "Votre adresse, formats acceptés: minuscules, majuscules, accents, chiffres, tirets, espaces"
  );
  address.setAttribute("placeHolder", "ex: 36 rue de la soif");
  address.addEventListener("keyup", function (_event) {
    if (address.validity.patternMismatch) {
      address.setCustomValidity(
        "Formats valides: minuscules, majuscules, accents, chiffres, tirets, espaces"
      );
      document.getElementById("addressErrorMsg").innerHTML =
        "Veuillez renseigner votre adresse";
    } else {
      address.setCustomValidity("");
      document.getElementById("addressErrorMsg").innerHTML = "";
    }
  });
  let city = document.getElementById("city");
  city.setAttribute("pattern", "[a-zA-ZÀ-ÿ- ]{2,20}");
  city.setAttribute(
    "title",
    "Votre ville, formats acceptés: minuscules, majuscules, accents, tirets, espaces"
  );
  city.setAttribute("placeHolder", "ex: Vannes");
  city.addEventListener("keyup", function (_event) {
    if (city.validity.patternMismatch) {
      city.setCustomValidity(
        "Formats valides: minuscules, majuscules, accents, tirets, espaces"
      );
      document.getElementById("cityErrorMsg").innerHTML =
        "Veuillez renseigner votre ville";
    } else {
      city.setCustomValidity("");
      document.getElementById("cityErrorMsg").innerHTML = "";
    }
  });
  let email = document.getElementById("email");
  email.setAttribute("title", "Votre adresse email au format standard");
  email.setAttribute("placeHolder", "ex: jean-martin@gmail.com");
  email.addEventListener("keyup", function (_event) {
    if (email.validity.typeMismatch) {
      document.getElementById("emailErrorMsg").innerHTML =
        "Veuillez renseigner une adresse email valide";
    } else {
      document.getElementById("emailErrorMsg").innerHTML = "";
    }
  });
}

/**
 * GERE L'AFFICHAGE D'UN MESSAGE D'ERREUR
 * LORS D'UNE SAISIE INCORRECTE DE QUANTITE (AU CLAVIER) SUR LA PAGE PRODUCT:
 * Fonction exportée vers la fonction "getAddToCart()" du fichier "product.js"
 * Fait 3 requêtes sur selecteur:
 *  1 - sur le selecteur "item__content" et insert une boite de dialogue dans le HTML,
 *  2 - sur le selecteur "item__content__settings" et efface les settings,
 *  3 - sur le selecteur "item__content__addButton" et efface le bouton.
 * @param  {object} product  Un produit récupéré depuis l'API
 */
export function displayProductError(product) {
  document.querySelector(".item__content").insertAdjacentHTML(
    "afterend",
    `<dialog open style="position: inherit; text-align: center">
        <p>
          Vous ne pouvez pas ajouter ce produit au panier <br />
          Car vous n'avez pas renseigné la quantité!
        </p>
        <div style="display: flex; justify-content: center;">
            <button style="font-size: 22px; border-radius: 40px; border: 0; background-color: var(--secondary-color); color: white; padding: 18px 28px; cursor: pointer; margin: 1px 0;">
              <a href="./product.html?id=${product._id}" style="color: white; text-decoration: none;">OK</a>
            </button>
        </div>
      </dialog>`
  );
  document.querySelector(".item__content__settings").remove();
  document.querySelector(".item__content__addButton").remove();
}

/**
 * GERE L'AFFICHAGE D'UN MESSAGE D'ERREUR
 * LORS D'UNE SAISIE INCORRECTE DE QUANTITE (AU CLAVIER) SUR LA PAGE CART:
 * Fonction exportée vers la méthode "quantity()" de la classe "Cart"
 * Fait 2 requêtes sur selecteur:
 *  1 - sur le selecteur "cart__order" et insert une boite de dialogue dans le HTML,
 *  2 - sur le selecteur "cart__order__form" et efface le formulaire.
 * @param {Product} product Le produit dans le localStorage dont la quantité n'est pas conforme.
 */
export function displayQuantityError(prodFound) {
  document.querySelector(".cart__order").insertAdjacentHTML(
    "afterbegin",
    `<dialog open style="position: inherit; text-align: center;">
        <p>
          Aucun article ne sera ajouté: <br />
          Vous devez saisir uniquement un nombre entre 1 et 100 <br />
          La quantité de cet article reste à ${prodFound.quantity}
        </p>
        <div style="display: flex; justify-content: center;">
            <button style="font-size: 22px; border-radius: 40px; border: 0; background-color: var(--secondary-color); color: white; padding: 18px 28px; cursor: pointer; margin: 1px 0;">
              <a href="../html/cart.html" style="color: white; text-decoration: none;">OK</a>
            </button>
        </div>
    </dialog>`
  );
  document.querySelector(".cart__order__form").remove();
}

/**
 * GERE L'AFFICHAGE D'UN MESSAGE D'ERREUR
 * EN CAS DE PANIER VIDE LORS DE LA COMMANDE SUR LA PAGE CART:
 * Fonction exportée vers la fonction "displayOrderForm()" du fichier "cart.js"
 * Fait 2 requêtes:
 *  1 - sur le selecteur "cart__order" et insert une boite de dialogue dans le HTML,
 *  2 - sur le selecteur "cart__order__form" et efface le formulaire.
 */
export function displayCartError() {
  document.querySelector(".cart__order").insertAdjacentHTML(
    "afterbegin",
    `<dialog open style="position: inherit; text-align: center">
        <p>Vous ne pouvez pas commander car votre panier est vide!</p>
        <div style="display: flex; justify-content: center;">
            <button style="font-size: 22px; border-radius: 40px; border: 0; background-color: var(--secondary-color); color: white; padding: 18px 28px; cursor: pointer; margin: 1px 0;">
              <a href="../html/index.html" style="color: white; text-decoration: none;">Retour</a>
            </button>
        </div>
      </dialog>`
  );
  document.querySelector(".cart__order__form").remove();
}

/**
 * GERE L'AFFICHAGE DES ERREURS SYSTEMES:
 * @param {string} msg Message sous forme de chaine de caractères indiquant l'erreur rencontrée
 */
export function displaySystemError(msg) {
  const indexError = document.querySelector(".titles");
  const productError = document.querySelector("article");
  const cartError = document.querySelector(".cart");
  const confirmError = document.querySelector(".confirmation");
  const openedDialTag = `<dialog open style="position: inherit; text-align: center">`;
  const openedParagraphTag = `<p>
                              Une erreur système est survenue.<br />`;
  const closedParagraphTag = `Veuillez nous excuser pour la gêne occasionnée.
                            </p>`;
  const divBtnTag = `<div style="display: flex; justify-content: center">
                      <button style="font-size: 22px; border-radius: 40px; border: 0; background-color: var(--secondary-color); color: white; padding: 18px 28px; cursor: pointer; margin: 1px 0;">
                      <a href="../html/index.html" style="color: white; text-decoration: none;">Retour</a>
                      </button>
                    </div>`;
  const closedDialTag = `</dialog>`;

  if (indexError) {
    indexError.insertAdjacentHTML(
      "beforeend",
      `${openedDialTag}
        ${openedParagraphTag}
          Nous ne pouvons afficher les produits en stock.<br />
        ${closedParagraphTag}  
        ${divBtnTag}
      ${closedDialTag}`
    );
  } else if (productError) {
    productError.insertAdjacentHTML(
      "afterbegin",
      `${openedDialTag}
          ${openedParagraphTag}
            Nous ne pouvons afficher le produit demandé.<br />
          ${closedParagraphTag}  
          ${divBtnTag}
        ${closedDialTag}`
    );
    document.querySelector(".item__img").remove();
    document.querySelector(".item__content").remove();
  } else if (cartError) {
    cartError.insertAdjacentHTML(
      "afterbegin",
      `${openedDialTag}
          ${openedParagraphTag}
            Nous n'avons pas pu traiter votre commande.<br /> 
          ${closedParagraphTag}  
          ${divBtnTag}
        ${closedDialTag}`
    );
    document.querySelector(".cart__price").remove();
    document.querySelector(".cart__order").remove();
  } else if (confirmError) {
    confirmError.insertAdjacentHTML(
      "beforeend",
      `${openedDialTag}
          ${openedParagraphTag}
            Nous ne pouvons pas confirmer cette commande.<br />
            Contactez le service commercial pour confirmation. <br /> 
          ${closedParagraphTag}  
          ${divBtnTag}
        ${closedDialTag}`
    );
    document.querySelector(".confirmation p").remove();
  }

  console.error("Une erreur est survenue, ", msg);
}