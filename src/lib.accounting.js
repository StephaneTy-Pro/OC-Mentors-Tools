/**
 *
 *
 *  * DEPENDENCIES: ocapi, jsonata
 */

/*
Pour vérifier si un script JavaScript s'exécute dans un contexte de Web Worker,
*  vous pouvez utiliser l'objet global self. Dans un contexte de Web Worker,
*  self fait référence à l'objet DedicatedWorkerGlobalScope, tandis que dans le
*  thread principal (par exemple, dans une page web), self fait référence à
*  l'objet Window.
* Au début de votre script worker.js, vous pouvez ajouter une vérification pour
*  déterminer si le script s'exécute dans un contexte de Web Worker :

// worker.js

if (self instanceof DedicatedWorkerGlobalScope) {
  console.log('Ce script s\'exécute dans un contexte de Web Worker.');
  // Ajoutez ici le code spécifique au Web Worker
} else {
  console.log('Ce script ne s\'exécute pas dans un contexte de Web Worker.');
  // Ajoutez ici le code à exécuter si ce n'est pas un Web Worker
}
*/

/* petit rappel
 * lorsque le script est chargé dans un Web Worker, les constantes et les
*  variables déclarées avec let ou const n'affectent pas le contexte global du
*  thread principal. Chaque Web Worker dispose de son propre contexte
*  d'exécution séparé, ce qui signifie que l'on peut avoir des constantes et
*  des variables identiques dans différents Web Workers sans conflit.
*/

var HEADER = {
	  NAME: 'lib.accounting.js'
	, VERSION : '202404.001'
	, VERSION_EXT: 'no_lib'
}

// register header of library NOTESTT: je tente cette approche pour eviter de polluer les constante globales
if (typeof REGISTRY === 'undefined') { const ACCOUNTING_LIB_H = HEADER; } else { REGISTRY.set( 'accounting.lib.h', HEADER ); }


/**
 * TODO
 * 	- Corriger la fonction checkDependencies pour etre plus générique en
 *  utilisant le nom global d'export de l'api que je vais stocker dans le header
 *
 */
var createFactory = (header=HEADER) => {

	const _checkDependencies = () => {
		if (typeof APIOC === 'undefined'){
			console.warn("Miss dependencies APIOC");
		}
	}

	// -- Utility --------------------------------------------------------------

	/**
	 * convert time in seconds into minutes and seconds
	 * @param {integer} seconds : nombre de secondes à convertir en minutes et
	 *  secondes
	 * @return {[integer, integer]} le nombre de minutes et secondes
	 */
	const _convertSecondsToMinutesAndSeconds = function(seconds) {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = Math.round((seconds % 60) * 10) / 10;

		return {
			minutes,
			seconds: remainingSeconds,
		};
	}

	// -- Imported function

	/**
	 * Namespace pour les opérations de cache.
	 * NOTESTT: utilise la page courante pour stocker des données en cache
	 * dans un noeud script de type application/json
	 * @namespace Cache
	 */
	const Cache = {
		/**
		 * Récupère les données du cache.
		 * @memberof Cache
		 * @param {string} [cacheName] - Le nom du cache.
		 * @returns {{ data: any, cacheTimestamp: number }} Les données du cache.
		 */
		getCacheData: function(cacheName) {
			const actualCacheName = cacheName || "defaultCache";
			const cacheScript = document.getElementById(actualCacheName);
			if (cacheScript && cacheScript.textContent) {
				return JSON.parse(cacheScript.textContent);
			}
			return { data: null, cacheTimestamp: null };
		},

		/**
		 * Définit les données du cache.
		 * @memberof Cache
		 * @param {*} oPrices - Les données à stocker dans le cache.
		 * @param {number} cacheTimestamp - Le timestamp de la mise à jour du cache.
		 * @param {string} [cacheName] - Le nom du cache.
		 * @returns {string} Le nom du cache utilisé.
		 */
		setCacheData: function(data, cacheTimestamp, cacheName) {
			const actualCacheName = cacheName || "cache_" ; // note stt a implementer avec mon cache simple+ uuidv4(); // Générer un UUID simple si aucun nom de cache n'est fourni
			let cacheScript = document.getElementById(actualCacheName);

			if (!cacheScript) {
				// Créer l'élément de script s'il n'existe pas
				cacheScript = document.createElement("script");
				cacheScript.setAttribute("id", actualCacheName);
				cacheScript.setAttribute("type", "application/json");
				document.body.appendChild(cacheScript);
			}

			const cacheData = { data, cacheTimestamp };
			cacheScript.textContent = JSON.stringify(cacheData);

			return actualCacheName;
		}
	};

	// ******************************************************* Fundings functions
	/* objectif: définir le financement des étudiants */
	/**
	 * Récupère les données de financement à partir d'une feuille de calcul Google Sheets et les renvoie sous forme d'objet.
	 * @param {object} [params={}] - Objet contenant les paramètres de la requête.
	 * @param {string} [params.id] - L'id de la feuille de calcul Google Sheets.
	 * @param {string} [params.query] - La requête à effectuer sur la feuille de calcul. Par défaut, 'select B,C,D,E limit 5000' est utilisé.
	 * @param {object} [params.data] - Les données à renvoyer directement, sans effectuer de requête sur la feuille de calcul.
	 * @returns {object} Les données de financement sous forme d'objet, où les clés sont les noms des financements et les valeurs sont les objets correspondants.
	 */
	const getFundings = async function(params={}){ // j'aurais pu immédiatement destructurer mais moins lisible : {url,query,data} = {} et aucun gain

		//let sUrl = params.url ?? '1Ko7nbOUrRHDoM2v_bxC85YuGBoao_IV2F3RLnqzMVgc';
		let sId = params.id ?? '';

		if(sId.length === 0){
			console.error('Il faut donner à minima un parametre: id {id:} ');
		}

		let sQuery = params.query ?? 'select B,C,D,E limit 5000';
		let oData = params.data ?? null;
		if (oData){ return oData; } // utilisateur à directement fourni les données de financement à utiliser
		// add funding info
		// https://docs.google.com/spreadsheets/d/1Ko7nbOUrRHDoM2v_bxC85YuGBoao_IV2F3RLnqzMVgc/edit?usp=sharing
		const oGsheet = await APIGSHEET.query(sId, sQuery);
		//console.log( 'list gsheet', oGsheet );
		//const oFundings = mapObjects( oGsheet, oGsheet.cols );
		const oFundings = APIGSHEET.mapObjects( oGsheet, oGsheet.cols );
		//console.log('mapping %o', oFundings );
		let tFundings = [];
		for( let i=0,$i=oFundings.length; i < $i; i++){
			//console.log( "object funding %d : %o", i, oFundings[i] );
			//console.log(" Setting tFundings[%s] to %o", oFundings[i].name, oFundings[i]);
			tFundings[oFundings[i].name] = oFundings[i];
		}

		//console.log("tFundings ",tFundings);
		return tFundings;

	}
	/**
	 * Définit les informations de financement pour un étudiant donné.
	 * @param {object} oStudent - L'objet étudiant pour lequel définir les informations de financement.
	 * @param {object} [tFundings=null] - Les informations de financement sous forme d'objet, où les clés sont les noms des étudiants et les valeurs sont les objets correspondants.
	 * @returns {object} L'objet étudiant mis à jour avec les informations de financement.
	 * @throws {Error} Si l'objet étudiant ne contient pas les propriétés `recipient` et `displayableName`.
	 */
	const setFunding = function(oStudent, tFundings=null){

		const bRetreated = oStudent.who ? true : false;

		let sName;
		if (bRetreated === true){
			sName = oStudent.who;
		}else{

			if (
				typeof oStudent.recipient ==  'undefined'
			 || typeof oStudent.displayableName ==  'undefined') {
				   console.error( "We have a problem student %o have no property '%s'", oStudent, "recipient.displayableName" );
				   throw Error("setFunding find that this is an UNKNOW_STUDENT");
			 }

			sName = oStudent.recipient.displayableName;
		}

		// NOTESTT(fr): avant c'était defense, et sauf erreur dans d'autres
		//   parties des champs remontés par l'API c'est encore defense
		if( oStudent.type == "presentation"){
			//console.log("cet étudiant %s fait une session de présentation nous n'avons pas besoin de son type de financement de toute façon on a pas forcément l'information", sName);
			return;
		}
		if( oStudent.type == "mentoring"){
			if( tFundings[sName] ){
				oStudent.financed 		= tFundings[sName].financed;
				oStudent.self_paid 		= tFundings[sName].self_paid ;
				oStudent.apprenticeship = tFundings[sName].apprenticeship;
			} else {
				console.warn("user %s not in fundings information provided", sName);
				oStudent.financed 		= false;
				oStudent.self_paid  	= false;
				oStudent.apprenticeship = false;
			}
		}

		return oStudent; // not really need
	}

	/**
	 * Définit les informations de financement pour une liste d'étudiants donnée.
	 * @param {Array.<object>} oStudents - La liste d'objets étudiants pour lesquels définir les informations de financement.
	 * @param {object} [tFundings=null] - Les informations de financement sous forme d'objet, où les clés sont les noms des étudiants et les valeurs sont les objets correspondants.
	 * @returns {Array.<object>} La liste d'objets étudiants mise à jour avec les informations de financement.
	 */
	const setFundings = async function(oStudents, tFundings=null){

		if( tFundings == null){
			//juste pour les tests tFundings = await getFundings();
			console.error("Il manque le tableau de financement des étudiants");
			throw("Error table of funding not set, use getFundings() to know them ");
		}

		for( let i=0,$i=oStudents.length; i <$i; i++){
			setFunding( oStudents[i], tFundings );
		}

		return oStudents; // not really need

	}

	// ******************************************************** SBOX FUNCTION

	// helper
	// helper pour revnoyer le prix d'une session de mentorat de base
	const iGetPriceByLevelM = (iLevel) => iLevel > 1 ? 20 + (iLevel - 1) * 5 : 20
	// helper pour renvoyer le prix d'une session de soutenance de base
	const iGetPriceByLevelP = (iLevel) => iLevel > 1 ? 25 + (iLevel - 1) * 5 : 25
	// helper pour revnoyer le coefficient en fonction du statut de l'étudiant
	const fGetCoefByStatus = (sStatus) => {
	  const oStatus = {
		'completed': 1.0,
		'marked student as absent': 0.5,
		'late canceled': 0.5,
		'canceled': 0
	  }
		/* @__PURE_R__ version avec opérateur d'affectation conditionnelle (nullish coalescing) */
		// WARN: cette notation ne permet pas de lever l'erreur
		const fValue = oStatus[sStatus] ?? 0; // si n'existe pas 0
		/* --[[
	  /*
		let fValue;
		if (oStatus[sStatus]) {
			fValue = oStatus[sStatus];
		} else {
			console.warn("status %s coul'nt be found in coef table return 0",sStatus );
			fValue = 0;
		}
	  --]] */

	  return fValue
	}

	// helper pour revnoyer les bons coefficient financiers
	const fGetCoefByFinancial = ( {apprenticeship,financed,self_paid} ) => {
		const oFinancial = {
			'apprenticeship': 0.72
			,'financed': 1
			,'self_paid': 0.72
			}

		//console.log( 'apprenticeship:%o,financed:%o,self_paid:%o', apprenticeship,financed,self_paid)

		if(apprenticeship === true){ return oFinancial.apprenticeship; }
		if(financed === true){ return oFinancial.financed; }
		if(self_paid === true){ return oFinancial.self_paid; }

	}

	// helper d'arrondit au plus proche centime
	const roundToNearestCent = function(number) {
		return Math.round(number * 100) / 100;
	}
	/**
	 * Génère une clé unique en utilisant le décalage de bits et en prenant en compte les critères suivants :
	 * - iLvl : entier de 0 à 10
	 * - type : chaîne de caractères avec les valeurs 'mentoring', 'defense' ou 'coaching'
	 * - financial : chaîne de caractères avec les valeurs 'self_paid', 'apprenticeship' ou 'financed'
	 * - status : chaîne de caractères avec les valeurs 'completed', 'marked as absent', 'late canceled' ou 'canceled'
	 *
	 * @param {number} iLvl - Le niveau, compris entre 0 et 10.
	 * @param {string} type - Le type de la valeur, soit 'mentoring', 'defense' ou 'coaching'.
	 * @param {string} financial - La valeur financière, soit 'self_paid', 'apprenticeship' ou 'financed'.
	 * @param {string} status - Le statut, soit 'completed', 'marked as absent', 'late canceled' ou 'canceled'.
	 * @returns {number} La clé unique générée.
	 * @throws {Error} Si l'un des paramètres a une valeur invalide.
	 *
	 * @example
	 * let uniqueKey = generateUniqueKey(5, 'mentoring', 'self_paid', 'completed');
	 * console.log(uniqueKey); // Affiche : 192
	 */
	const _generateUniqueKey = function (iLvl, type, financial, status) {

		//console.log("Receive iLvl:%d, type:%s, financial:%s, status:%s", iLvl, type, financial, status);

		let typeMap = {
			'mentoring': 0,
			'presentation': 1,  // avant c'était defense
			'coaching': 2
		};

		let financialMap = {
			'self_paid': 0,
			'apprenticeship': 1,
			'financed': 2,
			'n/a': 3				// besoin d'une clé non applicable pour les soutenances
		};

		let statusMap = {
			'completed': 0,
			'marked student as absent': 1,
			'late canceled': 2,
			'canceled': 3
		};

		// Vérifiez si les valeurs des paramètres sont valides
		if (!typeMap.hasOwnProperty(type)) {
			throw new Error('Invalid type value');
		}

		if (!financialMap.hasOwnProperty(financial)) {
			throw new Error('Invalid financial value');
		}

		if (!statusMap.hasOwnProperty(status)) {
			throw new Error('Invalid status value');
		}

		if (iLvl < 0 || iLvl > 10) {
			throw new Error('Invalid iLvl value');
		}

		// Utiliser le décalage de bits pour créer la clé unique on a deux positions de décalage à chaque fois car tres peu de clés 4 max
		let key = (iLvl << 6) | (typeMap[type] << 4) | (financialMap[financial] << 2) | statusMap[status];

		return key;
	}

	//var sbox = async function() {

	// deux options ici soit je demande à passer en parametre le tableau de financement
	// soit je vais le chercher moi meme
	// pour mes tests : 1Ko7nbOUrRHDoM2v_bxC85YuGBoao_IV2F3RLnqzMVgc
	//  var tFundings = await ACCOUNTING.getFundings({id:'1Ko7nbOUrRHDoM2v_bxC85YuGBoao_IV2F3RLnqzMVgc'})

	// il y a un buh ici
	// var u =await ACCOUNTING.getBillableSessions('2024-04-01',2024-04-31, tFundings) ne fonctionne pas
	// var u = await APIOC.getHistorySessionsBetween('2024-04-01','2024-04-31') fonctionne

	const getBillableSessionsOfAPeriod = async function(sFrom, sTo, tFundings){
		var oSessions = await ACCOUNTING.sessionsOfPeriod(sFrom, sTo);
		await setFundings( oSessions,tFundings );
		//console.log(s);
		const cacheUserPath = new Map();
		const aBillLines = [];
		for (var i = 0, $i = oSessions.length; i < $i; i++) {
			//console.log("session", s[i]);
			const oSession = oSessions[i];
			if (oSession.type === 'mentoring') {
				var iWho = oSession.whoId;
				//console.log("Searching %d", iWho);
				const key = JSON.stringify(iWho);
				let oPath;
				if (cacheUserPath.has(key)) {
					//console.log("Hit cacheUserPath on key %d", iWho);
					oPath = cacheUserPath.get(key);
				} else {
					try {
						oPath = await APIOC.getUserFollowedPath(iWho);
						cacheUserPath.set(key, oPath);
					} catch {
						(err) => console.log("Error in APIOC.getUserPaths(%o)", iWho);
					}
				}
				//console.log("ai trouvé objet path", oPath)
				// récuperer le nom de la clé qui est positionnée à true
				//const sFinancialKey = Object.entries(oSession).find(([k, v]) => v === true)[0];
				// version filtrée sur clé
				const keysToTest = ['apprenticeship', 'financed', 'self_paid'];
				// attention il est possible que l'étudiant ne soit pas dans le tableau
				var _ = Object.entries(oSession).find(([k, v]) => keysToTest.includes(k) && v === true);
				//const sFinancialKey = Object.entries(oSession).find(([k, v]) => keysToTest.includes(k) && v === true)[0]; // recuperer l'element 0 du tableau retourné
				if ( _ && typeof _[0] !== 'undefined' ){
					sFinancialKey = _[0];
				} else {
					// aucune des clés n'est à true
					console.warn("Impossible de déterminer le financement de %s il(elle) est probablement absent(e) de votre fichier de financement (NOFUNDINGKEYFUNF)", oSession.who);
					console.warn("Les résultats cumulés à partir de cet étudiant seront faux, c'est voulu");
				}
				const iPathId = oPath.id;
				const iProjectId = oSession.projectId;
				//console.log("iPathId %d, iProjectId iProjectId", iPathId, iProjectId);
				const oPrices = await ACCOUNTING.getSessionLevels(iPathId, iProjectId);
				//console.log(oPrices);
				if (typeof oPrices !== 'undefined') {
					//console.log("FALSE En base session level=%d => tableau ref level %d", oSession.pLvl, oPrices.expertise_new_level)
					//console.log("FALSE En base session level=%d => tableau ref level %d", oSession.pMLvl, oPrices.expertise_new_level)

					// suis pas bien sur en fait console.log("GOOD En base session (pPLvl) level=%d => tableau level=%d(EXPERTISE)", oSession.pPLvl, oPrices.expertise_new_level)
					// comme je ne m'occupe que des sessions pour le moment
					//console.log("Cette valeur peut etre a 0 je suppose que c'est dans le cas ou il n'y a pas de presentation")
					//console.log("??? En base session (pLvl) level=%d => tableau ref level %d", oSession.pLvl, oPrices.project_new_level)
					//console.log("???? En base session (pMLvl) level=%d => tableau ref level %d(PROJECT)", oSession.pMLvl, oPrices.project_new_level)

					// en théorie
					// let iPrice = oPrices.expertise_new_price; => a priori ça c'est la soutenance
					let iPrice = oPrices.project_new_price;
					let iLvl = oPrices.project_new_level || oSession.pMLvl;
					if(iPrice === 0 || typeof iPrice === 'undefined'){
						console.warn(" project_new_price is not set on official sheet fallback to data(pMLvl) in session");
						iPrice = iGetPriceByLevelM(oSession.pMLvl);
					}
					let fCoefStatus = fGetCoefByStatus(oSession.status);
					let fCoefFinancial = fGetCoefByFinancial( oSession );
					//console.log("Searching fCoefFinancial for :%s and get %f", oSession.who,  fCoefFinancial);
					//console.log("(checked) Prix de base :%dx(%d%)x(%d%) = %.2f €", iPrice, fCoefStatus * 100, fCoefFinancial * 100, iPrice * fCoefStatus * fCoefFinancial)
					const fTotal = roundToNearestCent( iPrice * fCoefStatus * fCoefFinancial );
					const line = {
						 basePrice: iPrice
						,fCoefStatus
						,fCoefFinancial
						,total : fTotal
						,tag: _generateUniqueKey(iLvl, oSession.type, sFinancialKey, oSession.status ) // iLvl, type, financial, status)
						,text: `le ${oSession.when} ${oSession.who}(${oSession.whoId}) session de mentorat de niveau:${iLvl} : ${iPrice}x(${fCoefStatus*100}%)x(${fCoefFinancial*100}%) = ${fTotal} €`
					}
					aBillLines.push(line);

				} else {
					// utiliser les informations de la ligne
					let iPrice = iGetPriceByLevelM(oSession.pMLvl);
					let fCoefStatus = fGetCoefByStatus(oSession.status);
					let fCoefFinancial = fGetCoefByFinancial( oSession );
					//let fCoefFinancial = 1;
					//console.log("(unchecked) Prix de base :%dx(%d%)x(%d%) = %.2f €", iPrice, fCoefStatus * 100, fCoefFinancial * 100, iPrice * fCoefStatus*fCoefFinancial);
					const fTotal = roundToNearestCent( iPrice * fCoefStatus * fCoefFinancial );
					const line = {
						 basePrice: iPrice
						,fCoefStatus
						,fCoefFinancial
						,total : fTotal
						,tag: _generateUniqueKey(oSession.pMLvl, oSession.type, sFinancialKey, oSession.status ) // iLvl, type, financial, status)
						,text: `le ${oSession.when} ${oSession.who}(${oSession.whoId}) session de mentorat de niveau:${oSession.pMLvl} : ${iPrice}x(${fCoefStatus*100}%)x(${fCoefFinancial*100}%) = ${fTotal} €`
					}
					aBillLines.push(line);
				}
			} else {
				// soutenance ou  coaching
				// pour le moment on oublie le coaching
				// utiliser les informations de la ligne
				let iPrice = iGetPriceByLevelP(oSession.pPLvl);
				let fCoefStatus = fGetCoefByStatus(oSession.status);
				//let fCoefFinancial = fGetCoefByFinancial( oSession );
				let fCoefFinancial = 1;
				//console.log("(unchecked) Prix de base :%dx(%d%)x(%d%) = %.2f €", iPrice, fCoefStatus * 100, fCoefFinancial * 100, iPrice * fCoefStatus * fCoefFinancial);
				const fTotal = roundToNearestCent( iPrice * fCoefStatus * fCoefFinancial );
				//const fTotal = iPrice * fCoefStatus * fCoefFinancial;
				const line = {
					 basePrice: iPrice
					,fCoefStatus
					,fCoefFinancial
					,total : fTotal
					,tag: _generateUniqueKey(oSession.pPLvl, oSession.type, 'n/a', oSession.status ) // iLvl, type, financial, status)
					,text: `le ${oSession.when} ${oSession.who}(${oSession.whoId}) session de soutenance de niveau:${oSession.pPLvl} : ${iPrice}x(${fCoefStatus*100}%)x(${fCoefFinancial*100}%) = ${fTotal} €`
				}
				aBillLines.push(line);
			}
		}

		console.log("----------A FACTURER-----------");
		let fTotal=0;
		for(var i=0,i$=aBillLines.length;i<$i;i++){
			fTotal += aBillLines[i].total;
			console.log("%s .... soit un montant cumulé de : %.2f", aBillLines[i].text,fTotal);
		}
		console.log("-------------------------------\nSoit un Total HT de %.2f€ .... TVA:%.2f€ ..... TTC:%.2f€", fTotal, fTotal*0.2, fTotal*1.2);

		return aBillLines;

	}

	// helpers preBill
	const _toConsole = (oData) => {

		if( oData.global ){
			const iCnt = oData.global.count;
			const sText = oData.global.text;

			if( iCnt == 0 ){
				console.log("%s: %d results", sText, iCnt);
			} else {
				const iTotal = oData.global.total;
				const oDetail = oData.detail;
				const iBasePrice = oData.global.price;
				console.log("%s: %d result(s) x %.2f = %.2f€ (HT)", sText, iCnt, iBasePrice, iTotal);
				console.groupCollapsed("Details:");
				console.table(oDetail);
				console.groupEnd();
			}
		}

	}

	const _toBillLine = async(oJson, iTag, sText= "no text", bAddNoResult = false) => {
		//console.log("_toBillLine() sSql='%s'", `$count(*[tag=${iTag}].total)`);
		const _rCnt = await jsonata(`$count(*[tag=${iTag}].total)`).evaluate(oJson);
		let oData = {};
		if( _rCnt > 0){
			//console.log("sSql='%s'", `*[tag=${iTag}].text`);
			const _rDetail = await jsonata(`*[tag=${iTag}].text`).evaluate(oJson);
			//console.log("sSql='%s'", `$sum(*[tag=${iTag}].total)`);
			const _rTotal = await jsonata(`$sum(*[tag=${iTag}].total)`).evaluate(oJson);
			/*
			 * Explication détaillée
			 * Dans cette requête, nous utilisons l'opérateur * pour sélectionner
			 *  tous les objets, puis nous appliquons le filtre [tag=200] pour
			 *  sélectionner uniquement les objets dont la valeur de la propriété
			 *  tag est égale à 200. Ensuite, nous utilisons le point . pour accéder
			 *  au champ total de chaque objet sélectionné, et enfin, nous utilisons
			 *  la fonction $sum() pour additionner toutes les valeurs du champ total
			 *  des objets sélectionnés.
			 *
			 * tester via https://try.jsonata.org/
			 */
			const firstLine = await jsonata(`*[tag=${iTag}][0]`).evaluate(oJson);
			const fPrice = roundToNearestCent(firstLine.basePrice * firstLine.fCoefStatus * firstLine.fCoefFinancial);
			oData.global = {count: _rCnt, price: fPrice, total:_rTotal , text:sText}
			oData.detail = Array.isArray( _rDetail ) ? _rDetail : [_rDetail]; // always return array
		} else {
			//console.warn("_toBillLine() sSql='%s' return no results", `$count(*[tag=${iTag}].total)`);
			if (bAddNoResult === true){
				oData.global = {count: _rCnt, total:0 , text:sText}
				oData.detail = []; // alway return array
			}
		}
		return oData;
	}

	const preBill = async function( oJson, bDumpToConsole=false ){
		const oData = [];

		let tag;
		// MENTORING completed
		if( bDumpToConsole === true){ console.log(" ********** MENTORING **********"); }
		if( bDumpToConsole === true){ console.log("-- completed"); }
		for(i = 1,$i=11; i<$i; i++){
			tag = _generateUniqueKey(i, 'mentoring', 'financed', 'completed' );
			var _r = await _toBillLine( oJson, tag, "Session mentoring Lvl "+i+" - financed - completed" );
			if( bDumpToConsole === true){ _toConsole( _r ); }
			if( _r.global){ oData.push( _r ); }
		}
		for(i = 1,$i=11; i<$i; i++){
			tag = _generateUniqueKey(i, 'mentoring', 'apprenticeship', 'completed' );
			var _r = await _toBillLine( oJson, tag, "Session mentoring Lvl "+i+" - apprenticeship -completed" );
			if( bDumpToConsole === true){ _toConsole( _r ); }
			if( _r.global){ oData.push( _r ); }
		}
		for(i = 1,$i=11; i<$i; i++){
			tag = _generateUniqueKey(i, 'mentoring', 'self_paid', 'completed' );
			var _r = await _toBillLine( oJson, tag, "Session mentoring Lvl "+i+" - self_paid - completed" );
			if( bDumpToConsole === true){ _toConsole( _r ); }
			if( _r.global){ oData.push( _r ); }
		}

		// MENTORING  marked student as absent
		if( bDumpToConsole === true){ console.log("-- marked student as absent"); }
		for(i = 1,$i=11; i<$i; i++){
			tag = _generateUniqueKey(i, 'mentoring', 'financed', 'marked student as absent' );
			var _r = await _toBillLine( oJson, tag, "Session mentoring Lvl "+i+" - financed - marked student as absent" );
			if( bDumpToConsole === true){ _toConsole( _r ); }
			if( _r.global){ oData.push( _r ); }
		}
		for(i = 1,$i=11; i<$i; i++){
			tag = _generateUniqueKey(i, 'mentoring', 'apprenticeship', 'marked student as absent' );
			var _r = await _toBillLine( oJson, tag, "Session mentoring Lvl "+i+" - apprenticeship - marked student as absent" );
			if( bDumpToConsole === true){ _toConsole( _r ); }
			if( _r.global){ oData.push( _r ); }
		}
		for(i = 1,$i=11; i<$i; i++){
			tag = _generateUniqueKey(i, 'mentoring', 'self_paid', 'marked student as absent' );
			var _r = await _toBillLine( oJson, tag, "Session mentoring Lvl "+i+" - self_paid - marked student as absent" );
			if( bDumpToConsole === true){ _toConsole( _r ); }
			if( _r.global){ oData.push( _r ); }
		}

		// MENTORING late canceled
		if( bDumpToConsole === true){console.log("-- late canceled");}
		for(i = 1,$i=11; i<$i; i++){
			tag = _generateUniqueKey(i, 'mentoring', 'financed', 'late canceled' );
			var _r = await _toBillLine( oJson, tag, "Session mentoring Lvl "+i+" - financed - late canceled" );
			if( bDumpToConsole === true){ _toConsole( _r ); }
			if( _r.global){ oData.push( _r ); }
		}
		for(i = 1,$i=11; i<$i; i++){
			tag = _generateUniqueKey(i, 'mentoring', 'apprenticeship', 'late canceled' );
			var _r = await _toBillLine( oJson, tag, "Session mentoring Lvl "+i+" - apprenticeship - late canceled" );
			if( bDumpToConsole === true){ _toConsole( _r ); }
			if( _r.global){ oData.push( _r ); }
		}
		for(i = 1,$i=11; i<$i; i++){
			tag = _generateUniqueKey(i, 'mentoring', 'self_paid', 'late canceled' );
			var _r = await _toBillLine( oJson, tag, "Session mentoring Lvl "+i+" - self_paid - late canceled" );
			if( bDumpToConsole === true){ _toConsole( _r ); }
			if( _r.global){ oData.push( _r ); }
		}

		// MENTORING CANCEL
		if( bDumpToConsole === true){console.log("--canceled");}
		for(i = 1,$i=11; i<$i; i++){
			tag = _generateUniqueKey(i, 'mentoring', 'financed', 'canceled' );
			var _r = await _toBillLine( oJson, tag, "Session mentoring Lvl "+i+" - financed - canceled" );
			if( bDumpToConsole === true){ _toConsole( _r ); }
			if( _r.global){ oData.push( _r ); }
		}
		for(i = 1,$i=11; i<$i; i++){
			tag = _generateUniqueKey(i, 'mentoring', 'apprenticeship', 'canceled' );
			var _r = await _toBillLine( oJson, tag, "Session mentoring Lvl "+i+" - apprenticeship - canceled" );
			if( bDumpToConsole === true){ _toConsole( _r ); }
			if( _r.global){ oData.push( _r ); }
		}
		for(i = 1,$i=11; i<$i; i++){
			tag = _generateUniqueKey(i, 'mentoring', 'self_paid', 'canceled' );
			var _r = await _toBillLine( oJson, tag, "Session mentoring Lvl "+i+" - self_paid - canceled" );
			if( bDumpToConsole === true){ _toConsole( _r ); }
			if( _r.global){ oData.push( _r ); }
		}

		// PRESENTATION
		if( bDumpToConsole === true){ console.log(" ********** PRESENTATION **********"); }
		for(i = 1,$i=11; i<$i; i++){
			tag = _generateUniqueKey(i, 'presentation', 'n/a', 'completed' );
			var _r = await _toBillLine( oJson, tag, "Session presentation Lvl "+i+" - completed" );
			if( bDumpToConsole === true){ _toConsole( _r ); }
			if( _r.global){ oData.push( _r ); }
		}
		for(i = 1,$i=11; i<$i; i++){
			tag = _generateUniqueKey(i, 'presentation', 'n/a', 'marked student as absent' );
			var _r = await _toBillLine( oJson, tag, "Session presentation Lvl "+i+" - marked student as absent" );
			if( bDumpToConsole === true){ _toConsole( _r ); }
			if( _r.global){ oData.push( _r ); }
		}
		for(i = 1,$i=11; i<$i; i++){
			tag = _generateUniqueKey(i, 'presentation', 'n/a', 'late canceled' );
			var _r = await _toBillLine( oJson, tag, "Session presentation Lvl "+i+" - late canceled" );
			if( bDumpToConsole === true){ _toConsole( _r ); }
			if( _r.global){ oData.push( _r ); }
		}

		for(i = 1,$i=11; i<$i; i++){
			tag = _generateUniqueKey(i, 'presentation', 'n/a', 'canceled' );
			var _r = await _toBillLine( oJson, tag, "Session presentation Lvl "+i+" - canceled" );
			if( bDumpToConsole === true){ _toConsole( _r ); }
			if( _r.global){ oData.push( _r ); }
		}

		return oData;

	}


	// ******************************************************** findLevel

	/**
	 * NOTESTT(fr): cette fonction a pour objectif de remonter du tableau d'OC les valeurs de tarif
	 * 	Les parametres sont non modifiables
	 */

	const findLevel = async function(forceRefresh=false){
		const sCacheId = "findLevel_Cache";
		const { data, cacheTimestamp } = Cache.getCacheData(sCacheId);

		// Vérifier si les données sont en cache et si elles ne sont pas expirées
		if (!forceRefresh && data && cacheTimestamp && (Date.now() - cacheTimestamp) < 86400000) {
			//console.log("Récupération des données depuis le cache.");
			return data;
		}

		const sGSheetId = "1gtBuMwQ522r8kCillhrDSGudod1qxmfN"; 		// gsheet id of openclassrooms document
		const _oPrices = await APIGSHEET.query(sGSheetId, "select A,B,F,G,H,I,J,K,L,M limit 5000");
		const headings = Object.values(_oPrices.cols);
		//console.log("Pour info les colonnes sont\n %o", headings);
		oPrices = APIGSHEET.mapObjects( _oPrices,  _oPrices.cols); // crée les objets a partir des titres de colonnes
		// Mise à jour du cache
		Cache.setCacheData(oPrices, Date.now(), sCacheId);

		//console.log("Tableau final : %o",oPrices);
	}

	// exemple getSessionLevels(69,51)
	const getSessionLevels = async function(iPathId=null, iProjectId=null){

		// be sure that we have the cache
		const oLevels = await findLevel();

		if( iPathId == null && iProjectId == null){
			console.warn("getSessionLevels() both param are null will return all sessions levels");
			return oLevels;
		}

		if (iPathId == null && iProjectId !== null){
			//console.log("getSessionLevels() sql is %s", `*[projectid=${iProjectId}]`);
			var _r = await jsonata(`*[projectid=${iProjectId}]`).evaluate(oLevels);
			return _r;
		}

		if (iPathId !== null && iProjectId == null ){
			//console.log("getSessionLevels() sql is %s", `*[pathid=${iPathId}]`);
			var _r = await jsonata(`*[pathid=${iPathId}]`).evaluate(oLevels);
			return _r;
		}
		//console.log("getSessionLevels() sql is %s", `*[projectid=${iProjectId} and pathid=${iPathId}]`);
		var _r = await jsonata(`*[projectid=${iProjectId} and pathid=${iPathId}]`).evaluate(oLevels);
		return _r;
	}

	// ******************************************************** sessionsOfPeriod
	// helper
	const _formatDuration = (duration) => {
		const durationInSeconds = APIOC.convertDurationToSeconds(duration);
		const { minutes, seconds } = _convertSecondsToMinutesAndSeconds(durationInSeconds);
		return `${minutes}mn${seconds}s`;
	};

	/**
	 *	sessionsOfPeriod
	 * 	@param(string)
	 *  @apram(string)
	 * (fr) : objectif est de retourner les sessions d'une période
	 */
	const sessionsOfPeriod = async function(sFrom, sTo, forceRefresh=false) {
		_checkDependencies();
		//

		const sCacheId = `sessionsOfPeriod_${dayjs(sFrom).valueOf()}-${dayjs(sTo).valueOf()}`; // convert sFrom and sTo to timestamp
		const { data, cacheTimestamp } = Cache.getCacheData(sCacheId);

		if (!forceRefresh && data && cacheTimestamp && (Date.now() - cacheTimestamp) < 86400000) {
			console.log("Récupération des données sessionsOfPeriod depuis le cache.");
			return data;
		}

		aData = [];
		//const _r = await APIOC.getHistorySessionsBetween(sFrom, sTo);
		//const me = await APIOC.getMe();
		//const sId = String(me.id);

		try {
			const data = await APIOC.getHistorySessionsBetween(sFrom, sTo);
			const me = await APIOC.getMe();
			const sId = String(me.id); // on a besoin de ce champ pour les temps d'attente qui sont affecté à un tableau ayant en clé l'id de l'utilisateur

			const processedData = data.map((e) => {
				let duree = 0;
				let dureeF = 0;
				let dureeAM = 0;

				if (e.durationDetails) {
					duree = e.durationDetails.effectiveDuration || 0;
					dureeF = e.durationDetails.billedDuration || 0;

					const result = e.durationDetails.waitingDurations.reduce((acc, { userId, duration }) => {
						const durationInSeconds = APIOC.convertDurationToSeconds(duration);
						acc[userId] = (acc[userId] || 0) + durationInSeconds;
						return acc;
					}, {});

					dureeAM = result[sId] || 0;
				}

				return {
					when: dayjs(e.sessionDate).format('DD/MM/YYYY'),
					who: e.recipient.displayableName,
					whoId: e.recipient.id,
					type: e.type,
					projectId: e.projectId,
					pLvl: e.projectLevel,
					pMLvl: e.projectMentoringLevel,
					pPLvl: e.projectPresentationLevel,
					status: e.status,
					pTitle: e.projectTitle,
					durationEffective: _formatDuration(duree),
					durationBilled: _formatDuration(dureeF),
					durationWaitingMentor: `${dureeAM}s`,
				};

			});

			// Mise à jour du cache
			Cache.setCacheData(processedData, Date.now(), sCacheId);

			return processedData;
		} catch (error) {
			console.error("Une erreur s'est produite lors du traitement des sessions :", error);
			throw error; // Propagation de l'erreur pour une gestion ultérieure si nécessaire
		}

	}

	_checkDependencies();

	return {
		  sessionsOfPeriod
		, findLevel
		, getSessionLevels
		, getFundings
		, setFundings
		, getBillableSessions:getBillableSessionsOfAPeriod
		, preBill
	}
}

// if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) ne doit pas fonctionner avec ffox
// if (typeof importScripts === 'function') { devrait fonctionner avec ffox

if (typeof importScripts === 'function') {
  console.info('Ce script:%s s\'exécute dans un contexte de Web Worker.', HEADER.name);
  // Ajoutez ici le code spécifique au Web Worker
} else {
  console.error('Ce script ne s\'exécute pas dans un contexte de Web Worker.');
  // Ajoutez ici le code à exécuter si ce n'est pas un Web Worker

	if ( typeof window !== 'undefined' ){
		window['ACCOUNTING'] = createFactory();
	}

}
