// Classe représentant la configuration de l'application.
class Config {
    
    /**
     * Fait une requête fetch vers le fichier json de configuration,
     * Retourne le résultat sous forme d'objet "Config" avec la méthode Object.assign
     * @returns {Config} 
     */
    static async loadConfig() {
        let config = await fetch("../config.json");
        return Object.assign(new Config(), await config.json());
    }
}

/**
 *  Fonction exportée vers "index.js" et "product.js". 
 *  Retourne la promesse de la méthode "loadConfig" de la classe "Config".
 */
 export async function setConfig() {
    return Config.loadConfig();
  }