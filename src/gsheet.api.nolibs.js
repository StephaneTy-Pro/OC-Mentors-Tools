/**
 *
 * version de gsheet api sans dépendances
 *
 * dépendances : axios (redaxios)
 */

var HEADER = {
	  NAME: 'gsheet_api'
	, VERSION : '202404.001'
	, VERSION_EXT: 'no_lib'
}

// register header of library NOTESTT: je tente cette approche pour eviter de polluer les constante globales
if (typeof REGISTRY === 'undefined') { const GSHEETAPI_h = HEADER; } else { REGISTRY.set( 'gsheet_api.h', HEADER ); }

const createAPIFactory_APIGSHEET = (create, API_BASE_URL = "https://docs.google.com/spreadsheets/d", header=HEADER) => {

	const C = {
		APP_DEBUG_STYLE: [
			"color: #373737",
			"background-color: #CC6",
			"padding: 2px 4px",
			"border-radius: 2px"
		].join(";"),
		APP_ERROR_STYLE: [
			"color: red",
			"background-color: #CC6",
			"padding: 2px 4px",
			"border-radius: 2px"
		].join(";"),
	}

	// PRIVATE

	// delete all chars before char: char in string: str
	const deleteBeforeChar = (str, char) => {

		let index = str.indexOf(char);
		if (index !== -1) {
			return str.slice(index);
		} else {
			return str;
		}

	}

	const cleanGSHeetResponse = (data) => {

		const sHeader = `${header.NAME}:cleanGSHeetResponse()`;

		// on recoit une chaine qu'il faut nettoyer
		// enlever : /*O_o */google.visualization.Query.setResponse(
		let final="";
		final = deleteBeforeChar(data,'{');
		// enlever ); à la fin
		final = final.substring(0, final.length - 2);
		//console.log('cleanGSHeetResponse data(%s) %o ',typeof data, final);
		let $j={};
		try {
			$j = JSON.parse(final);
		}catch(err) {
			console.error("%c%s%c cleanGSHeetResponse la donnée %o ne peut pas être convertie en json : %o", C.APP_ERROR_STYLE, sHeader,"",err);
			return{};
		}
		//console.log("cleanGSHeetResponse objet:%o",$j)
		return $j.table;

	}

	const processGSheetResponse = (data) => {

		const sHeader = `${header.NAME}:processGSheetResponse()`;

		//console.log("processGSheetResponse receive %o", data);
		data = cleanGSHeetResponse(data);
		//console.log("processGSheetResponse we have cleaned data %o", data);
		// headings are an [] of {id,label,type}
		const headings = Object.values(data.cols);
		//console.log("processGSheetResponse we have headings %o", headings);
		const values = Object.values(data.rows);
		//console.log("processGSheetResponse we have values %o", values);

		// cleaning empty final lines
		data.rows = cleanEmptyFinalRows(values, data.rows);
		//console.log("processGSheetResponse we have cleaned data %o", data);

		return data;

	}

	/*
	 * Principe :faire une boucle récursive qui parcours tout le tableau
	 *  à partir de la fin et qui supprime la ligne précédente si la ligne suivante
	 *  est aussi vierge, cette boucle doit s'arreter à la premiere ligne non vierge
	 *  trouvée
	 */

	const cleanEmptyFinalRows = (rows, rowsObj) => {
		// Fonction récursive pour nettoyer les lignes vides finales
		if (rows.length === 0) {
			return {};
		}

		const lastRow = rows[rows.length - 1];
		const values = Object.values(lastRow);
		const isEmpty = values.every(cell => cell === null || cell === '' || cell === undefined);

		if (isEmpty) {
			// Supprime la dernière ligne et appelle récursivement la fonction sur le reste des lignes
			// a priori c'est meilleur que la création de nouvel objet, mais éventuellement à tester
			delete rowsObj[rows.length - 1];
			return cleanEmptyFinalRows(rows.slice(0, -1), rowsObj);
		} else {
			// Retourne l'objet rows nettoyé
			return rowsObj;
		}
	};

	/**
	 * Création de "correspondance d'objets" ou une "assignation d'objets"
	 * à partir du contenu du tableau en utilisant les libellés des colonnes.
	 * @param {Object} table - Tableau d'objets contenant les données.
	 * @param {Array<Object>|Array<string>} labelsOrCols - Référence aux objets cols ou tableau de libellés.
	 * @returns {Array<Object>} - Tableau d'objets mappés.
	 *
	 * example :
	 *  const labels = ["ID", "Title", "Amount"];
	 * 	const mappedData = mapObjects(tableData, labels);
	 */
	function mapObjects(table, labelsOrCols) {
		/**
		 * @typedef {Object} TableObject
		 * @property {Array<Object>} cols - Les colonnes de la table.
		 * @property {Array<Object>} rows - Les lignes de la table.
		 */

		/**
		 * @typedef {Object} DataRow
		 * @property {Array<Object>} c - Les cellules de la ligne.
		 */

		/**
		 * @typedef {Object} MappedObject
		 * @property {string} key - La clé de l'objet mappé.
		 * @property {*} value - La valeur de l'objet mappé.
		 */

		const mappedObjects = table.rows.map(row => {
			const obj = {};
			row.c.forEach((cell, i) => {
				if (cell !== null) {
					let label;
					if (Array.isArray(labelsOrCols)) {
						if (typeof labelsOrCols[0] === 'string') {
							label = labelsOrCols[i];
						} else if (labelsOrCols && labelsOrCols[i]) {
							label = labelsOrCols[i].label;
						} else {
							console.error("Missing label or cols reference for cell:", cell);
						}
					}
					if (label) {
						obj[label] = cell.v;
					} else {
						console.error("Missing label for cell:", cell);
					}
				}
			});
			return obj;
		});
		return mappedObjects;
	}


	// PUBLIC
	const query = async (id, query, opt={}) => {
		// https://developers.google.com/chart/interactive/docs/querylanguage?hl=fr
		// Ajoutez /gviz/tq?tq=YOUR_QUERY_STRING à l'URL de la feuille de calcul pour obtenir votre chaîne de requête finale:
		// il est aussi possible de choisir la feuille en ajoutant un guid
		// https://developers.google.com/chart/interactive/docs/spreadsheets?hl=fr#Google_Spreadsheets_as_a_Data_Source
		// voir aussi ici pour une version courte : https://stackoverflow.com/questions/20385463/select-worksheet-google-visualization-api-query-language

		return new Promise((resolve, reject) => {

			let sOpts ='';
			let aOpts = [];

			const bVerbose = true;
			const sHeader = `${header.NAME}:query()`;

			// no sheet
			if (opt.gid) {
				aOpts[0] = `gid=${opt.gid}`;
			}
			if (opt.sheet) {
				aOpts[0] = `sheet=${opt.sheet}`;
			}
			if (opt.headers) {
				aOpts[1] = `headers=${opt.headers}`;
			}

			sOpts =  aOpts.reduce( (ac,v) => `${ac}&${v}&` , '' ).slice(1); // slice 1 pour enlever le premier &, notez aussi que le dernier caractère doit être &

			// exemple 'https://docs.google.com/spreadsheets/d/1XWJLkAwch5GXAt_7zOFDcg8Wm8Xv29_8PWuuW15qmAE/gviz/tq?sheet=Sheet1&headers=1&tq=
			const sFinalURL = `${API_BASE_URL}/${id}/gviz/tq?${sOpts}tq=${encodeURIComponent(query)}`;
			const axios = create();

			axios.get(sFinalURL, {responseType: 'stream'})
			.then(function (response) {
				// handle success
				if(bVerbose){
					console.log("%c%s%c id:%s options:%o query:%s (converted:%s) reponse:%o", C.APP_DEBUG_STYLE, sHeader,"",id, opt, query, encodeURIComponent(query), response);
				}
				// create empty string in which to store result
				let result = "";
				const stream = response.data;
				const reader = stream.getReader();
				let charsReceived = 0;
				const cb = processGSheetResponse;
				// read() returns a promise that resolves
				// when a value has been received
				reader.read().then( function processText({
					done,
					value
					}) {
					//console.log('done %o Value:%o', done,value);
					// Result objects contain two properties:
					// done  - true if the stream has already given you all its data.
					// value - some data. Always undefined when done is true.
					if (done) {
						//console.log("Stream complete %s", result);
						const _r = cb(result);
						resolve( _r ); // attention resolve ne fait pas sortir de la fonction mais signale au "sémaphore" mis en place par l'await que la variable est désormais connue
						return; //
					}

					charsReceived += value.length;
					const chunk = value;
					//console.log('Read ' + charsReceived + ' characters so far. Current chunk = ' + chunk);
					//result += chunk;
					result += new TextDecoder('utf-8').decode(chunk);

					// Read some more, and call this function again
					return reader.read().then( processText );
				});
			})
			.catch(function (error) {
				// handle error
				console.error("%c%s%c : ",C.APP_ERROR_STYLE, sHeader,"", error);
				reject(error);
			})
			.finally(function () {
			// always executed
			});
		}); // end of Promise
	}

	return {
		 query
		,mapObjects
	}
}

/*
 * sample
 * 	pour la feuille située à 'https://docs.google.com/spreadsheets/d/1hn8gBDB-7l02Gp0jAnFq15ogCjpDixKrsxLqAIk3Gt0';
 *  et le query : "select%20A%2CB%2CC%20limit%2050"
 * 		APIGSHEET.query(1hn8gBDB-7l02Gp0jAnFq15ogCjpDixKrsxLqAIk3Gt0, 'select A,B,C limit 50');
 *
 */

// GRILLE TARIF OC https://docs.google.com/spreadsheets/d/1gtBuMwQ522r8kCillhrDSGudod1qxmfN/edit#gid=1685219209
// PATHID : A, PATHTITLE: B, CODE PROJET (projectId) : F, PROJECT TITLE : G,
// EXPERTISE OLD LEVEL : H EXPERTISE OLD PRICE : I
// PROJECT NEW LEVEL: J, PROJECT NEW PRICE: K
// EXPERTISE NEW LEVEL: L, EXPERTISE NEW PRICE: M

// petit rappel dépendance à axios
if (typeof create === 'undefined') {
	console.error("This library is dependant on readaxios, method create, which was not found");
}
const APIGSHEET = createAPIFactory_APIGSHEET(create);
