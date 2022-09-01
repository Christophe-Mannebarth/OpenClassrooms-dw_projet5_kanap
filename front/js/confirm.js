import { displaySystemError } from "./errors.js";

function confirmOrder() {
    try {
        // Récupère l'ID de la commande dans l'URL de la page
        const id = new URL(window.location.href).searchParams.get("id");

        // Si l'ID est récupéré:
        if (id) {

            // Insert l'ID de la commande dans l'élément HTML "orderId" de la page)
            const orderId = document.getElementById("orderId");
            orderId.innerHTML = id;

        // Sinon:    
        } else {

            // Affiche un message d'erreur à l'utilisateur et dans la console
            let error = "Soit l'ID du produit est absent, soit il y a un probleme avec sa récupération";
            displaySystemError(error);
        }

    // En cas de dysfonctionnement affiche un message d'erreur à l'utilisateur et dans la console    
    } catch (error) {
        displaySystemError(error);
    }
}

//ACTIVE LA FONCTION:
confirmOrder();
