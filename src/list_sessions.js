

// ------------------------------------------------------------------- FUNCTIONS

const oFn = {
	session_lists: function(args){
		console.log(" << ----- %c%s%c ----- >> ", "blue","fn session_lists","");

		// demander à l'api la liste des sessions
		//getHistorySessionDate('2024-03-01');

		console.log(" >> ----- %c%s%c ----- << ", "blue","fn session_lists","");
	}
	,session2: function(args){
		console.log(" << ----- %c%s%c ----- >> ", "blue","fn session_lists","");

		// demander à l'api la liste des sessions
		//getHistorySessionDate('2024-03-01');
		sessionsOfPeriodToCsv( args);

		console.log(" >> ----- %c%s%c ----- << ", "blue","fn session_lists","");
	}
}

/**
 *
 * bRetreated: the data was the retreated ones and thus provide who insteat of
 *    object recipient which provides property displayableName
 *
 */

const _setFundings = async function(oJson, bRetreated=false){

	// add funding info
	// https://docs.google.com/spreadsheets/d/1Ko7nbOUrRHDoM2v_bxC85YuGBoao_IV2F3RLnqzMVgc/edit?usp=sharing
	const oGsheet = await APIGSHEET.query('1Ko7nbOUrRHDoM2v_bxC85YuGBoao_IV2F3RLnqzMVgc', 'select B,C,D,E limit 5000');
	console.log( 'list gsheet', oGsheet );
	const oFundings = mapObjects( oGsheet, oGsheet.cols );
	console.log('mapping %o', oFundings );
	let tFundings = [];
	for( let i=0,$i=oFundings.length; i < $i; i++){
		//console.log( "object funding %d : %o", i, oFundings[i] );
		//console.log(" Setting tFundings[%s] to %o", oFundings[i].name, oFundings[i]);
		tFundings[oFundings[i].name] = oFundings[i];
	}

	console.log("tFundings ",tFundings);

	for( let i=0,$i=oJson.length; i <$i; i++){
		let sName;
		if (bRetreated === true){
			sName = oJson[i].who;
		}else{
			sName = oJson[i].recipient.displayableName;
		}

		if( oJson[i].type == "presentation"){
			console.log("cet étudiant %s fait une session de présentation nous n'avons pas besoin de son type de financement", sName);
			continue;
		}
		if( oJson[i].type == "mentoring"){
			if( tFundings[sName] ){
				oJson[i].financed 		= tFundings[sName].financed;
				oJson[i].self_paid 		= tFundings[sName].self_paid ;
				oJson[i].apprenticeship = tFundings[sName].apprenticeship;
			} else {
				console.warn("user %s not in fundings information provided", sName);
				oJson[i].financed 		= false;
				oJson[i].self_paid  	= false;
				oJson[i].apprenticeship = false;
			}
		}
	}

	return oJson;

}
//** Jouons avec JsonATA
const testJSONATA = async function(oJson){

	const iBasePrice = [
	-1 // session niv0
	,20 // session niv1
	,25 // session niv2 ???? non confirmé
	,30 // session niv3
	,35 // session niv4
	,40 // session niv5 ???? non confirmé
	,45 // session niv6
	];

	// une session de soutenance peut etre de niveau 4 mais d'expertise 3 c'est le niveau de soutenance qui compte
	// session de niveau 5, ou de soutenances d'expertise 4 => 40€

	// oc renvoie 3 tarifs en base
	// projectLevel  				--> pLvl
	// projectMentoringLevel		--> pMLvl
	// projectPresentationLevel		--> pPLvl

	if(oJson == null){
		oJson = await sessionsOfPeriod('2024-03-01','2024-03-31')
	}
	console.log("Ajoutons le mode de financement");
	oJson = await setFundings( oJson, true );

	// const _o = oJson.map(obj => ({...obj})); mais peut etre couteux du fait que map crée le tableau et associe les objets
	const _o = [];
	for(var i=0,$i = oJson.length;i<$i;i++){
		// attention a bien copier l'objet et pas copier la reference à l'objet
		const obj = {...oJson[i]};
		_o.push(obj);
		obj.pLvl = oJson[i].pLvl * 1;
		obj.pMLvl = oJson[i].pMLvl * 1;
		obj.pPLvl = oJson[i].pPLvl * 1;
}

	console.log("Cloned data is %", _o);

	console.log("Quelques résultats amusants");
	var _r =  await jsonata('*[pLvl<pPLvl]').evaluate(_o);
	console.groupCollapsed("Liste des étudiants dont le niveau projet en présentation est supérieur au niveau du projet");
	console.table(_r);
	console.groupEnd();

	var _r =  await jsonata('*[pLvl<pMLvl]').evaluate(_o);
	console.groupCollapsed("Liste des étudiants dont le niveau projet en mentorat est supérieur au niveau du projet");
	console.table(_r);
	console.groupEnd();

	var _r =  await jsonata('*[pLvl<pMLvl]').evaluate(_o);
	console.groupCollapsed("Liste des étudiants dont le niveau projet en mentorat est différent du niveau de projet en présentation");
	console.table(_r);
	console.groupEnd();

	console.log("on va jouer avec les données %o" , oJson);
	var _r =  await jsonata('$distinct(who)').evaluate(oJson);
	console.groupCollapsed("Liste des étudiants de la période");
	console.table(_r);
	console.groupEnd();

	// les presentations
	var _r = await jsonata("*[type='presentation']").evaluate(oJson);
	console.groupCollapsed("Liste des étudiants de la période qui font une présentation");
	console.table(_r);
	console.groupEnd();

	const show = async function(
		sQuery
		,oJson
		,sText
		,iPrice
		,iCoef
	){

		var _r = await jsonata(sQuery).evaluate(oJson);
		console.groupCollapsed(sText);
		console.table(_r);
		console.groupEnd();

		if( typeof _r === 'undefined') {
			console.log("No Result");
			return;
		}

		if( _r && typeof _r.length === 'undefined') {
			//convert to array
			_r = [ _r ];
		}

		if( _r.length) { console.log("A facturer: ..... %d * %d(%d*%d%) = ", _r.length , iPrice*iCoef, iPrice, (iCoef*100),  _r.length * iPrice*iCoef); }

	}


	// les presentations de niveau X et de statut complete
	var _r = await jsonata("*[type='presentation' and pPLvl='1' and status='completed']").evaluate(oJson);
	console.groupCollapsed("Liste des étudiants de la période qui font une présentation de niveau 1 et de statut completé");
	console.table(_r);
	console.groupEnd();
	if( _r) { console.log("PV ..... %d * %d = ", _r.length , iBasePrice[1], _r.length * iBasePrice[1]); }

	var _r = await jsonata("*[type='presentation' and pPLvl='2' and status='completed']").evaluate(oJson);
	console.groupCollapsed("Liste des étudiants de la période qui font une présentation de niveau 2 et de statut completé");
	console.table(_r);
	console.groupEnd();
	if( _r) { console.log("PV ..... %d * %d = ", _r.length , iBasePrice[2], _r.length * iBasePrice[2]); }

	var _r = await jsonata("*[type='presentation' and pPLvl='3' and status='completed']").evaluate(oJson);
	console.groupCollapsed("Liste des étudiants de la période qui font une présentation de niveau 3 et de statut completé");
	console.table(_r);
	console.groupEnd();
	if( _r) { console.log("PV ..... %d * %d = ", _r.length , iBasePrice[3], _r.length * iBasePrice[3]); }

	var _r = await jsonata("*[type='presentation' and pPLvl='4' and status='completed']").evaluate(oJson);
	console.groupCollapsed("Liste des étudiants de la période qui font une présentation de niveau 4 et de statut completé");
	console.table(_r);
	console.groupEnd();
	if( _r) { console.log("PV ..... %d * %d = ", _r.length , iBasePrice[4], _r.length * iBasePrice[4]); }

	var _r = await jsonata("*[type='presentation' and pPLvl='5' and status='completed']").evaluate(oJson);
	console.groupCollapsed("Liste des étudiants de la période qui font une présentation de niveau 4 et de statut completé");
	console.table(_r);
	console.groupEnd();
	if( _r) { console.log("PV ..... %d * %d = ", _r.length , iBasePrice[5], _r.length * iBasePrice[5]); }

	var _r = await jsonata("*[type='presentation' and pPLvl='6' and status='completed']").evaluate(oJson);
	console.groupCollapsed("Liste des étudiants de la période qui font une présentation de niveau 4 et de statut completé");
	console.table(_r);
	console.groupEnd();
	if( _r) { console.log("PV ..... %d * %d = ", _r.length , iBasePrice[6], _r.length * iBasePrice[6]); }

	var _r = await jsonata("*[type='mentoring' and pMLvl='1' and status='completed']").evaluate(oJson);
	console.groupCollapsed("Liste des étudiants de la période qui font un mentorat de niveau 1 et de statut completé");
	console.table(_r);
	console.groupEnd();
	if( _r) { console.log("PV ..... %d * %d = ", _r.length , iBasePrice[1], _r.length * iBasePrice[1]); }

	var _r = await jsonata("*[type='mentoring' and pMLvl='2' and status='completed']").evaluate(oJson);
	console.groupCollapsed("Liste des étudiants de la période qui font un mentorat de niveau 2 et de statut completé");
	console.table(_r);
	console.groupEnd();
	if( _r) { console.log("PV ..... %d * %d = ", _r.length , iBasePrice[2], _r.length * iBasePrice[2]); }

	var _r = await jsonata("*[type='mentoring' and pMLvl='3' and status='completed']").evaluate(oJson);
	console.groupCollapsed("Liste des étudiants de la période qui font un mentorat de niveau 3 et de statut completé");
	console.table(_r);
	console.groupEnd();
	if( _r) { console.log("PV ..... %d * %d = ", _r.length , iBasePrice[3], _r.length * iBasePrice[3]); }

	var _r = await jsonata("*[type='mentoring' and pMLvl='4' and status='completed']").evaluate(oJson);
	console.groupCollapsed("Liste des étudiants de la période qui font un mentorat de niveau 4 et de statut completé");
	console.table(_r);
	console.groupEnd();
	if( _r) { console.log("PV ..... %d * %d = ", _r.length , iBasePrice[4], _r.length * iBasePrice[4]); }

	var _r = await jsonata("*[type='mentoring' and pMLvl='5' and status='completed']").evaluate(oJson);
	console.groupCollapsed("Liste des étudiants de la période qui font un mentorat de niveau 5 et de statut completé");
	console.table(_r);
	console.groupEnd();
	if( _r) { console.log("PV ..... %d * %d = ", _r.length , iBasePrice[5], _r.length * iBasePrice[5]); }

	var _r = await jsonata("*[type='mentoring' and pMLvl='6' and status='completed']").evaluate(oJson);
	console.groupCollapsed("Liste des étudiants de la période qui font un mentorat de niveau 6 et de statut completé");
	console.table(_r);
	console.groupEnd();
	if( _r) { console.log("PV ..... %d * %d = ", _r.length , iBasePrice[6], _r.length * iBasePrice[6]); }

	var _r = await jsonata("*[$distinct(who) and type='mentoring' and self_paid]").evaluate(oJson);
	console.groupCollapsed("Liste des étudiants 'self_paid' de la période");
	console.table(_r);
	console.groupEnd();

	var _r = await jsonata("*[type='mentoring' and pMLvl='1' and status='completed' and self_paid]").evaluate(oJson);
	console.groupCollapsed("Liste des étudiants 'self_paid' de la période qui font un mentorat de niveau 1 et de statut completé");
	console.table(_r);
	console.groupEnd();
	if( _r) { console.log("PV ..... %d * %d(%d-50%) = ", _r.length, iBasePrice[1]*.5, iBasePrice[1], _r.length * iBasePrice[1]*.5); }

	var _r = await jsonata("*[type='mentoring' and pMLvl='2' and status='completed'and self_paid]").evaluate(oJson);
	console.groupCollapsed("Liste des étudiants 'self_paid de la période qui font un mentorat de niveau 2 et de statut completé");
	console.table(_r);
	console.groupEnd();
	if( _r) { console.log("PV ..... %d * %d(%d-50%)= ", _r.length , iBasePrice[2]*.5, iBasePrice[2], _r.length * iBasePrice[2]*.5); }

	await show("*[type='mentoring' and pMLvl='3' and status='completed' and self_paid]"
	 ,oJson
	 , "Liste des étudiants 'self_paid' de la période qui font un mentorat de niveau 3 et de statut completé"
	 , iBasePrice[3]
	 , 1
	 )


	var _r = await jsonata("*[type='mentoring' and pMLvl='4' and status='completed' and self_paid]").evaluate(oJson);
	console.groupCollapsed("Liste des étudiants 'self_paid' de la période qui font un mentorat de niveau 4 et de statut completé");
	console.table(_r);
	console.groupEnd();
	if( _r) { console.log("PV ..... %d * %d(%d-50%) = ", _r.length, iBasePrice[4]*.5, iBasePrice[4], _r.length * iBasePrice[4]*.5); }

	var _r = await jsonata("*[type='mentoring' and pMLvl='5' and status='completed' and self_paid]").evaluate(oJson);
	console.groupCollapsed("Liste des étudiants 'self_paid' de la période qui font un mentorat de niveau 5 et de statut completé");
	console.table(_r);
	console.groupEnd();
	if( _r) { console.log("PV ..... %d * %d(%d-50%) = ", _r.length,  iBasePrice[5]*.5, iBasePrice[5], _r.length * iBasePrice[5]*.5); }

	var _r = await jsonata("*[type='mentoring' and pMLvl='6' and status='completed' and self_paid]").evaluate(oJson);
	console.groupCollapsed("Liste des étudiants 'self_paid' de la période qui font un mentorat de niveau 6 et de statut completé");
	console.table(_r);
	console.groupEnd();
	if( _r) { console.log("PV ..... %d * %d(%d-50%) = ", _r.length , iBasePrice[6]*.5,iBasePrice[6],  _r.length * iBasePrice[6]*.5); }

	// -- FINANCED & COMPLETED

	await show("*[type='mentoring' and pMLvl='1' and status='completed' and financed]"
	 ,oJson
	 , "Liste des étudiants 'financed' de la période qui font un mentorat de niveau 1 et de statut completé"
	 , iBasePrice[1]
	 , 1
	 )

	await show("*[type='mentoring' and pMLvl='2' and status='completed' and financed]"
	 ,oJson
	 , "Liste des étudiants 'financed' de la période qui font un mentorat de niveau 2 et de statut completé"
	 , iBasePrice[2]
	 , 1
	 )

	await show("*[type='mentoring' and pMLvl='3' and status='completed' and financed]"
	 ,oJson
	 , "Liste des étudiants 'financed' de la période qui font un mentorat de niveau 3 et de statut completé"
	 , iBasePrice[3]
	 , 1
	 )

	await show("*[type='mentoring' and pMLvl='4' and status='completed' and financed]"
	 ,oJson
	 , "Liste des étudiants 'financed' de la période qui font un mentorat de niveau 4 et de statut completé"
	 , iBasePrice[4]
	 , 1
	 )

	await show("*[type='mentoring' and pMLvl='5' and status='completed' and financed]"
	 ,oJson
	 , "Liste des étudiants 'financed' de la période qui font un mentorat de niveau 5 et de statut completé"
	 , iBasePrice[5]
	 , 1
	 )

	await show("*[type='mentoring' and pMLvl='6' and status='completed' and financed]"
	 ,oJson
	 , "Liste des étudiants 'financed' de la période qui font un mentorat de niveau 6 et de statut completé"
	 , iBasePrice[6]
	 , 1
	 )

	// -- FINANCED & COMPLETED

	var _r =  await jsonata("*[$distinct(who) and type='mentoring' and apprenticeship]").evaluate(oJson);

	await show("*[type='mentoring' and pMLvl='1' and status='completed' and financed]"
	 ,oJson
	 , "Liste des étudiants 'financed' de la période qui font un mentorat de niveau 1 et de statut completé"
	 , iBasePrice[1]
	 , 1
	 )

	await show("*[type='mentoring' and pMLvl='2' and status='completed' and financed]"
	 ,oJson
	 , "Liste des étudiants 'financed' de la période qui font un mentorat de niveau 2 et de statut completé"
	 , iBasePrice[2]
	 , 1
	 )

	await show("*[type='mentoring' and pMLvl='3' and status='completed' and financed]"
	 ,oJson
	 , "Liste des étudiants 'financed' de la période qui font un mentorat de niveau 3 et de statut completé"
	 , iBasePrice[3]
	 , 1
	 )

	await show("*[type='mentoring' and pMLvl='4' and status='completed' and financed]"
	 ,oJson
	 , "Liste des étudiants 'financed' de la période qui font un mentorat de niveau 4 et de statut completé"
	 , iBasePrice[4]
	 , 1
	 )

	await show("*[type='mentoring' and pMLvl='5' and status='completed' and financed]"
	 ,oJson
	 , "Liste des étudiants 'financed' de la période qui font un mentorat de niveau 5 et de statut completé"
	 , iBasePrice[5]
	 , 1
	 )

	await show("*[type='mentoring' and pMLvl='6' and status='completed' and financed]"
	 ,oJson
	 , "Liste des étudiants 'financed' de la période qui font un mentorat de niveau 6 et de statut completé"
	 , iBasePrice[6]
	 , 1
	 )

	// -- APPRENTICESHIP & COMPLETED

	// comment chainer ( * [type='mentoring'] ) ~> $distinct ~> $count il passe les elements en premiers parametre de la fonction appellée

	var _r = await jsonata("*[type='mentoring and apprenticeship']").evaluate(oJson);
	console.groupCollapsed("Liste des étudiants de la période qui font une présentation");
	console.table(_r);
	console.groupEnd();

	await show("*[type='mentoring' and pMLvl='1' and status='completed' and apprenticeship]"
	 ,oJson
	 ,"Liste des étudiants 'apprenticeship' de la période qui font un mentorat de niveau 1 et de statut completé"
	 ,iBasePrice[1]
	 ,0.5
	 )

}

const sessionsOfPeriod = async function (sFrom, sTo) {
  const _r = await APIOC.getHistorySessionsBetween(sFrom, sTo);
  const oExport = [];

	const convertSecondsToMinutesAndSeconds = function(seconds) {
	  const minutes = Math.floor(seconds / 60);
	  const remainingSeconds = Math.round((seconds % 60) * 10) / 10;

	  return {
		minutes,
		seconds: remainingSeconds,
	  };
	}

	const me = await APIOC.getMe();
	const sId = String(me.id);

  _r.forEach((e) => {
    let duree = (e.durationDetails) ? e.durationDetails.effectiveDuration : 0;
    let dureeF = (e.durationDetails) ? e.durationDetails.billedDuration : 0;
    let dureeAM = 0;

    if (e.durationDetails) {
      const result = e.durationDetails.waitingDurations.reduce((acc, { userId, duration }) => {
        const durationInSeconds = APIOC.convertDurationToSeconds(duration);
        acc[userId] = acc[userId] ? acc[userId] + durationInSeconds : durationInSeconds;
        return acc;
      }, {});



      dureeAM = result[sId];
    }

    iDEMin = convertSecondsToMinutesAndSeconds(APIOC.convertDurationToSeconds(duree)).minutes
    iDESec = convertSecondsToMinutesAndSeconds(APIOC.convertDurationToSeconds(duree)).seconds
    iDBMin = convertSecondsToMinutesAndSeconds(APIOC.convertDurationToSeconds(dureeF)).minutes
    iDBSec = convertSecondsToMinutesAndSeconds(APIOC.convertDurationToSeconds(dureeF)).seconds

    const line = {
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
      durationEffective: `${iDEMin}mn${iDESec}s`,
      durationBilled: `${iDBMin}mn${iDBSec}s`,
      durationWaitingMentor: `${dureeAM}s`,
    };

    oExport.push(line);
  });

  console.log("to export ", oExport);

  return oExport;


};

const sessionsOfPeriodToCsv = async function(data) {
	const objectToCSV = function (aTbl, separator = ',') {
		const _array = [Object.keys(aTbl[0])].concat(aTbl);
		const csvRows = _array.map((e) => Object.values(e).join(separator));
		return csvRows.join('\n');
	};
	console.log("CSV", objectToCSV(oExport, ';'));
}

const dumpFundings = async function(){
	const _oFundings = await APIGSHEET.query('1gtBuMwQ522r8kCillhrDSGudod1qxmfN', 'select A,B,F,G,H,I,J,K,L,M limit 5000');
	const oFundings = mapObjects( _oFundings, _oFundings.cols );
	return oFundings;
}

const trouverLesTarifs = async function( data ) {
	//const oTarifs = await APIGSHEET.query('1gtBuMwQ522r8kCillhrDSGudod1qxmfN', 'select B,F,G,H,I,J,K,L,M limit 5000');
	const oTarifs = await APIGSHEET.query('1gtBuMwQ522r8kCillhrDSGudod1qxmfN', 'select A,B,F,G,H,I,J,K,L,M limit 5000');
	// supprimer les enregistrements vide

	const headings = Object.values(oTarifs.cols);
	console.log("Pour info les colonnes sont\n %o", headings);

	// isFinancialAidStudent
	const cacheStudent = new Map();
	/*
	 * Probleme : à cause de la protection de donnée d'un étudiant on a plus accès aux données de l'étudiant quand il a ete transferé
	 * donc on ne sais plus s'il est self paid ou pas
	 */
	const getStudentFinancialAid = async function(id){

		const key = JSON.stringify(id);
		if (cacheUserPath.has(key)) {
			console.log("Hit cacheUserPath on key %d", id);
			const oStudent = cache.get(key);
			const isFinancialAidStudent = oStudent.user.isFinancialAidStudent;
			return isFinancialAidStudent
		}
		let oStudent;
		try {
			oStudent = await APIOC.getStudent(id);
		}
		catch { (err) => console.log("Error in APIOC.getStudent(%o)", id); }
		let sFinancialAidStudent;
		if( oStudent && oStudent.user ){
			isFinancialAidStudent = oStudent.user.isFinancialAidStudent;
		} else {
			oStudent = {}; // definit un étudiant meme a vide pour ne pas tout le temps aller requeter mais ne pas crasher non plus
			isFinancialAidStudent = null;
		}
		cache.set(key, oStudent);
		return isFinancialAidStudent;

	}

	// je vais avoir besoin d'un tableau sur les path
	const cacheUserPath = new Map();
	const getUserPath = async function(id){

		const key = JSON.stringify(id);
		if (cacheUserPath.has(key)) {
			console.log("Hit cacheUserPath on key %d", id);
			return cache.get(key);
		}
		let result;
		try {
			result = await APIOC.getUserPaths(id);
		}
		catch { (err) => console.log("Error in APIOC.getUserPaths(%o)", id); }

		let iPathId;
		if (result.length > 1) {
			console.log("Searching in all the path the one which have property : userIsFollowingLearningPath=true");
			//throw Error("Student %d have more than one path(%o) how to choose ?", e.whoId,oPath);
			const _index = result.findIndex(obj => obj.userIsFollowingLearningPath === true);
			if (_index == null){
				throw Error("Student %d have more than one path(%o) and none has propety userIsFollowingLearningPath === true", e.whoId,oPath);
			}
			iPathId = result[_index].id;

			// cas particulier du coaching
			// si l'étudiant à terminé il va falloir classer les parcours par date à prendre le plus récent
			if( iPathId == 158 || result[_index].format == 'coaching'){ // pour gérer le cas ou ça va changer

				// on va trier le tableau du plus récent au plus ancien, sachant que si la session est pas completée elle vaut null
				// dependance à dayjs

				const sortByCompletedAt = function(arr) {
					return arr.sort((a, b) => {
						const dateA = dayjs(a.userLearningInformation.completedAt);
						const dateB = dayjs(b.userLearningInformation.completedAt);
						// attention aux valeurs null
						if (!dateA.isValid()) { // prise en compte de la valueur null
							return 1;
						}
						if (!dateB.isValid()) { // prise en compte de la valueur null
							return -1;
						}
						if (dateA.isAfter(dateB)) {
							return -1;
						} else if (dateA.isBefore(dateB)) {
							return 1;
						} else {
							return 0;
						}
					});
					}

				console.log("tableau non trie %o", result);
				sortByCompletedAt(result); // copie tu tableau avant tri
				console.log("Il semblerait que l'étudiant ait terminé et soit en coaching prenons donc la derniere formation completée donc la premiere de ce tableau %o", result);
				iPathId = result[0].id;

			}
		} else {
			iPathId =result[0].id;
			if(result[0].userIsFollowingLearningPath !== true){
				console.warn("getUserPath(): We will have a problem : propery of path userIsFollowingLearningPath is not set to true");
			}
		}
		console.log("Found that current path of student:%d is : %d",id,iPathId)
		cache.set(key, iPathId);
		return iPathId;

	}


	// faire une recherche dans les data du champs projectId
	console.groupCollapsed("Test");
	var [v,error] = searchData( oTarifs, 'projectid', 35)
	console.log("Searching key:%s value:%d return %o error %o", 'projectid', 35, v, error);
	var [v,error] = searchData( oTarifs, 'projectid', 42)
	console.log("Searching key:%s value:%d return %o error %o", 'projectid', 42, v, error);
	var [v,error] = searchMappedDataMany( oTarifs, 'projectid', 66)
	console.log("Searching key:%s value:%d return %o error %o", 'projectid', 66, v, error);
	var [v,error] =  searchMappedDataMany( oTarifs, 'projectid', 66)
	console.log("Searching key:%s value:%d return %o error:%o", 'projectid', 66, v, error);
	console.groupEnd();
/*
	data.forEach( (e) => {
		console.log("Searching information for projectId:%o (type:%s)" , e.projectId, typeof e.projectId);
		[oPrices, error] = searchMappedDataMany( oTarifs, 'projectid', e.projectId);
		if (error){
			throw("Error : key: with value:%o not found: %o", "projectid", e.projectId, error);
		} else {

		console.log("Found those data %o", oPrices);
		}

		if (oPrices.length > 1 ){
			console.error("We have a problem have found more than one result for : projectId:%o (type:%s)",  e.projectId, typeof e.projectId);
		}

		let oPrice = oPrices[0];
		// by precaution
		if (oPrices) {
			data.expertise_old_price = oPrices.expertise_old_price;
			data.expertise_new_price = oPrices.expertise_new_price;
			// attention project new price ne semble pas toujours etre présent
			data.project_new_price   = oPrices.project_new_price ? project_new_price : -1;
		}

	});
*/
	// calculer le montant perdu
	let iTot=0;
	for (let i = 0; i < data.length; i++) {
		let e = data[i];
		console.log("Working on data %o", e);
		let oPrices, error;

		if (e.type == 'presentation') {
			console.log("Présentation pas besoin d'aller chercher le path");
			[oPrices, error] = searchManyOnMappedDataMany(oTarifs, [ {key:'projectid', value:e.projectId} ]);
			console.log("Searching key:%s with value:%o return %o error %o", 'projectid', e.iProjectId, oPrices, error);
		} else {
			console.log("Mentorat j'ai besoin du path : de l'étudiant:%s(%d)", e.who, e.whoId);
			const iPathId = await getUserPath(e.whoId);
			console.log("The path of current student %d is %d", e.whoId, iPathId);
			[oPrices, error] = searchManyOnMappedDataMany(oTarifs, [ {key:'pathid', value:iPathId}, {key:'projectid', value:e.projectId} ]);
			console.log("Searching key:%s value:%d and key:%s with value:%o return %o error %o", 'pathid', iPathId, 'projectid', e.iProjectId, oPrices, error);
		}

		if (error) {
			throw new Error(`Error : key: with value:%o not found: %o`, "projectid", e.projectId, error);
		} else {
			console.log("Found those data %o", oPrices);
		}

		if (oPrices.length > 1) {
			console.warn("We could have a problem have found more than one result for : projectId:%o (type:%s)", e.projectId, typeof e.projectId);
			// check if all prices are same between each project

			const checkFieldsConsistency = function(arr, fields) {
				const fieldValues = {};
				let consistent = true;

				// Vérifier que tous les champs spécifiés existent dans chaque objet
				for (let i = 0; i < arr.length; i++) {
				const obj = arr[i];
				for (let j = 0; j < fields.length; j++) {
				  const field = fields[j];
				  if (!(field in obj)) {
					console.log(`Field ${field} missing in object at index ${i}`);
					return;
				  }
				}
			  }

				// Vérifier que tous les champs spécifiés ont la même valeur pour tous les objets
				for (let i = 0; i < arr.length; i++) {
					const obj = arr[i];
					for (let j = 0; j < fields.length; j++) {
					const field = fields[j];
					if (!(field in fieldValues)) {
						fieldValues[field] = obj[field];
					} else if (fieldValues[field] !== obj[field]) {
						console.log(`Inconsistent value for field ${field} in object at index ${i}`);
						consistent = false;
					}
					}
				}

				if (consistent) {
					console.log("All fields are consistent");
				}
			}

			const fields = ["expertise_old_level", "expertise_old_price", "project_new_level", "project_new_price", "expertise_new_level", "expertise_new_price"];

			checkFieldsConsistency(oPrices, fields);

		}
		// on renvoit toujours un tableau d'objet
		let oPrice = oPrices[0];

		// by precaution

		if (oPrice) {
				data[i].expertise_old_price = oPrice.expertise_old_price;
				data[i].expertise_new_price = oPrice.expertise_new_price;
				// attention project new price ne semble pas toujours etre présent
				data[i].project_new_price = oPrice.project_new_price ? oPrice.project_new_price : -1;

				console.log("Petite verification ProjetId:%d : expertise ancien prix: %d, nouveau prix: %d , difference: %d, rappel de l'objet %o", e.projectId,
					data[i].expertise_old_price, data[i].expertise_new_price,
					data[i].expertise_new_price -data[i].expertise_new_price, oPrice)

				iTot = iTot + oPrices.expertise_old_price -oPrices.expertise_new_price;
			}

		// need to know selfpaid or not for mentoring sessions
		let isFinancialAidStudent = null;
		if(e.type == 'mentoring'){
			console.log("J'ai besoin du booleen isFinancialAidStudent : de l'étudiant:%s(%d)", e.who, e.whoId);
			isFinancialAidStudent = await getStudentFinancialAid(e.whoId);
		}
		data[i].isFinancialAidStudent = isFinancialAidStudent;
		}

	console.log("Perte ou gain total: %d", iTot);

	const objectToCSV = function (aTbl, separator = ',') {
		const _array = [Object.keys(aTbl[0])].concat(aTbl);
		const csvRows = _array.map((e) => Object.values(e).join(separator));
		return csvRows.join('\n');
	};

	console.log("TO CSV", objectToCSV(data, ';'));

}


function searchData(table, colLabel, searchValue) {
	const cols = table.cols;
	const colIndex = cols.findIndex(col => col.label === colLabel);
	const colType = cols[colIndex].type;
	const rowIndex = table.rows.findIndex(row => {
		const cell = row.c[colIndex];
		if (cell !== null) {
			if (colType === 'string') {
				return cell.v.toLowerCase() === searchValue.toLowerCase();
			} else if (colType === 'number') {
				return cell.v === searchValue;
			}
		}
		return false;
	});
	if (rowIndex === -1) {
		return [null, `Aucune correspondance trouvée pour ${searchValue}`];
	}
	const data = mapObjects(table, cols)[rowIndex];
	return [data, null];
}

const cache = new Map();

function searchMappedDataWithCache(table, colLabel, searchValue, stopAtFirst = false) {
	const key = JSON.stringify([colLabel, searchValue, stopAtFirst]);
	if (cache.has(key)) {
		// console.log("Hit Cache on data %s", key);
		return cache.get(key);
	}
	const result = searchMappedData(table, colLabel, searchValue, stopAtFirst);
	cache.set(key, result);
	return result;
}

function searchMappedData(table, colLabel, searchValue, stopAtFirst = false) {
	const mappedData = mapObjects(table, table.cols);
	const result = [];
	mappedData.forEach(row => {
		if (row[colLabel] !== null) {
			if (typeof row[colLabel] === 'string') {
			if (row[colLabel].toLowerCase() === searchValue.toLowerCase()) {
				result.push(row);
				if (stopAtFirst) {
					return [result, null];
				}
				}
			} else if (typeof row[colLabel] === 'number') {
				if (row[colLabel] === searchValue) {
					result.push(row);
					if (stopAtFirst) {
						return [result, null];
					}
				}
			}
		}
	});
	if (result.length === 0) {
		return [null, `Aucune correspondance trouvée pour ${searchValue}`];
	}
	return [result, null];
}

function searchMappedDataOnce(table, colLabel, searchValue) {
	return searchMappedDataWithCache(table, colLabel, searchValue, true);
}

function searchMappedDataMany(table, colLabel, searchValue) {
	return searchMappedDataWithCache(table, colLabel, searchValue, false);
}

// La meme mais sur plusieurs criteres
function searchManyOnMappedDataWithCache(table, colLabel, searchCriteria, stopAtFirst = false) {
	const key = JSON.stringify([colLabel, searchCriteria, stopAtFirst]);
	if (cache.has(key)) {
		console.log("Hit Cache on data %s", key);
		return cache.get(key);
	}
	const result = searchManyOnMappedData(table, colLabel, searchCriteria, stopAtFirst);
	cache.set(key, result);
	return result;
}

function searchManyOnMappedData(table, searchCriteria, stopAtFirst = false) {
  const mappedData = mapObjects(table, table.cols);
  const result = [];
  mappedData.forEach(row => {
    let match = true;
    searchCriteria.forEach(criterion => {
      if (row[criterion.key] !== null) {
        if (typeof row[criterion.key] === 'string') {
          if (row[criterion.key].toLowerCase().indexOf(criterion.value.toLowerCase()) === -1) {
            match = false;
          }
        } else if (typeof row[criterion.key] === 'number') {
          if (row[criterion.key] !== criterion.value) {
            match = false;
          }
        }
      } else if (criterion.value !== null) {
        match = false;
      }
    });
    if (match) {
      result.push(row);
      if (stopAtFirst) {
        return [result, null];
      }
    }
  });
  if (result.length === 0) {
    return [null, `No match found for ${JSON.stringify(searchCriteria)}`];
  }
  return [result, null];
}

function searchManyOnMappedDataOnce(table, colLabel, searchValue) {
	return searchManyOnMappedDataWithCache(table, colLabel, searchValue, true);
}

function searchManyOnMappedDataMany(table, colLabel, searchValue) {
	return searchManyOnMappedDataWithCache(table, colLabel, searchValue, false);
}

// --sbox


//console.log(" ***** oFn %o",oFn);

// -----------------------------------------------------------------------  MAIN
// IIFE
;(function (oCtx) {
	var module = {
		name: "list_sessions.js",
		description: "",
		ver: "", // Supports minimum Core version of v1.6.2
		type: "process",
		init: function () {
			/* ... */
		},
		// je choisi de retourner la fonction a executer plutot que d'executer directement
		exec: function(sFn){
			// associe le nom de fonction au tableau des fonctions disponibles
			const oFn = {
				"liste": oCtx.session_lists
				, "liste2" : oCtx.session2
			}

			try {
				return oFn[sFn];
			} catch (error) {
				console.error("Erreur %o pendant l'execution de la fonction %s :", error, sFn);
				throw error;
			}
		}
	}
	//console.log("%cWill render window.onModuleReady()", "color:green");
	onModuleReady(module);  // hook into "parent script"

	module.exec("liste")( {o:1} );
	//module.exec("liste2")( {o:1} );
}(oFn));


