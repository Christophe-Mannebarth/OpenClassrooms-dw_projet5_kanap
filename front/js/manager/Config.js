// Classe représentant la configuration de l'application.
class Config {
    
    /**
     * GERE LA RECUPERATION DU FICHIER CONFIG
     * Fait une requête fetch vers le fichier json de configuration,
     * Retourne le résultat sous forme d'objet "Config" avec la méthode Object.assign
     * @returns {Config} L'objet "Config" avec le contenu du fichier "config.json"
     */
    static async loadConfig() {
        let config = await fetch("../config.json");
        return Object.assign(new Config(), await config.json());
    }
}

/**
 * GERE L'ENVOI DE LA CONFIG AUX FICHIERS DEMANDEURS
 * Fonction exportée vers "index.js", "product.js", et "cart.js". 
 * Retourne la réponse de la méthode "loadConfig()".
 * @returns {Config} L'objet "Config" avec le contenu du fichier "config.json"
 */
 export async function setConfig() {
    return Config.loadConfig();
  }