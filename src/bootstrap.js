/**
 *
 * ce n'est pas encore très clair dans ma tête mais ce fichier génère l'amorçage de tout le systeme
 * c'est lui et lui seul qui peut lancer les autres script
 *
 */

// DEBUT CHARGEMENT-------------------------------------------------------------
console.log(" << ----- %s ----- >> ", "SOF boostrap.js");


/**
* Dynamically loads an external JavaScript file.
* @param {string} url The URL of the external script to load.
* @param {Object} [options] Optional configuration for the script.
* @param {boolean} [options.isModule] Whether the script is a module.
* @param {boolean} [options.defer] Whether the script should be deferred.
* @param {Object} [options.dataAttributes] An object containing data attributes to add to the script element.
* @returns {Promise} A promise that resolves once the script has loaded, or rejects on error.
*
* @credits: HeyPuter (https://github.com/HeyPuter/puter/blob/main/src/index.js)
*/

window.loadScript = async function(url, options = {}) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;

        // Set default script loading behavior
        script.async = true;

        // Handle if it is a module
        if (options.isModule) {
            script.type = 'module';
        }

        // Handle defer attribute
        if (options.defer) {
            script.defer = true;
            script.async = false; // When "defer" is true, "async" should be false as they are mutually exclusive
        }

        // Add arbitrary data attributes
        if (options.dataAttributes && typeof options.dataAttributes === 'object') {
            for (const [key, value] of Object.entries(options.dataAttributes)) {
                script.setAttribute(`data-${key}`, value);
            }
        }

        // Resolve the promise when the script is loaded
        script.onload = () => resolve();

        // Reject the promise if there's an error during load
        script.onerror = (error) => reject(new Error(`Failed to load script at url: ${url}`));

        // Append the script to the body
        document.body.appendChild(script);
    });
};




// MAIN ------------------------------------------------------------------------
;(async function() {
	// definition de maniere globale d'une fonction onModuleReady
	// chaque script chargé va appeller ce module avec un paremetre de type object
	// dans cet objet on aura eventuellement une fonction init
	// si cette fonction init est presente elle sera appelé
	// ce code se trouve dans un iiffe en fin de fichier ou dans un processus
	// qui intervient en fin de chargement

	// exemple : onModuleReady(module);

	window.onModuleReady = function (o) {
		// call init in loaded whenever you are ready for it...
		console.log('%cwindow.onModuleReady was called from include%c with param %o will delay a o.init()', "color:cyan","", o);
		// call init method of module
		if(o && o.init){
			setTimeout(function () { o.init(); }, 500);
		}
	}
})();
// FIN CHARGEMENT --------------------------------------------------------------



// Créer l'objet global REGISTRY s'il n'existe pas déjà
if (typeof REGISTRY === 'undefined') {
  REGISTRY = {
    _store: new Map(),

    set(name, value) {
      if (typeof name !== 'string' || typeof value === 'undefined') {
        throw new Error('Invalid arguments');
      }
      this._store.set(name, value);
    },

    get(name) {
      if (typeof name !== 'string') {
        throw new Error('Invalid argument');
      }
      return this._store.get(name);
    },

    has(name) {
      if (typeof name !== 'string') {
        throw new Error('Invalid argument');
      }
      return this._store.has(name);
    },

    delete(name) {
      if (typeof name !== 'string') {
        throw new Error('Invalid argument');
      }
      return this._store.delete(name);
    },

    clear() {
      this._store.clear();
    },

    keys() {
      return Array.from(this._store.keys());
    },

    values() {
      return Array.from(this._store.values());
    },

    entries() {
      return Array.from(this._store.entries());
    },

    size() {
      return this._store.size;
    }
  };
}

// utilisation de la registry pour définir les header des fonctions

REGISTRY.set( 'boostrap.h', {name:'bootstrap', version:'1.0'} )

// on peut imaginer que le mutation observer surveille tous les ajouts d'un type particulier
// et qu'en outre on ai un script avec un id particulier quand le mutation observer va voir ce type particulier il va arreter l'observation et supprimer le tag
// Créez un callback pour le MutationObserver
// dans la précédente version on tentait de regarder les modifications d'attribut mais ça semble ne pas bien fonctionner
// probablement un souci au niveau des attributs qui se modifient trop vite
// on ajoute la possibilité d'arreter l'écoute des qu'un script d'id particulier est inseré, et on le supprimer
// Créez un callback pour le MutationObserver
const callback = (mutationsList, observer) => {
	const bVerbose = false;
	for (const mutation of mutationsList) {
		if (mutation.type === 'childList') {
			const addedScripts = Array.from(mutation.addedNodes).filter(node => node instanceof HTMLScriptElement);

			if (addedScripts.length > 0) {
				const stopObserverScript = addedScripts.find(script => script.id === '_STOP_OBSERVER_');

				if (stopObserverScript) {
					if(bVerbose){console.log('Script avec l\'ID _STOP_OBSERVER_ ajouté, arrêt de l\'observer...');}
					observer.disconnect();
					stopObserverScript.remove();
				} else {
					if(bVerbose){console.log(`Balises <script> ajoutées :`, addedScripts);}
					// Actions en fonction des balises <script> ajoutées
				}
			}

			const removedScripts = Array.from(mutation.removedNodes).filter(node => node instanceof HTMLScriptElement);

			if (removedScripts.length > 0) {
				if(bVerbose){console.log(`Balises <script> supprimées :`, removedScripts);}
				// Actions en fonction des balises <script> supprimées
			}
		}

		// on s'occupe des attributs
		if(mutation.type === 'attributes') {
			const changedAttrName  = mutation.attributeName;
			const newValue = mutation.target.getAttribute(changedAttrName);
			if(bVerbose){console.log(`Attribut modififé et nouvelle valeur => '${changedAttrName}' : ${newValue}`);}
		}

	}
};

// Crée une instance de MutationObserver
const observer = new MutationObserver(callback);

// Configuration des options du MutationObserver pour observer les modifications des enfants
const config = {
	childList: true,
	subtree: true, // stt change to true sinon je ne vois pas les attribut
	attributes: true // je veux aussi observer les attributs
	,attributeFilter: ['data-loaded'] // je me concentre sur les data-loaded uniquement
};

// Démarre l'observation sur l'élément <head>
observer.observe(document.head, config);


console.log(" >> ----- %s ----- << ", "EOF boostrap.js");
