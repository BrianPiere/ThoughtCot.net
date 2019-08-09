"use strict";

postInit(function(){

	var componentObj = new HIPI.framework.Component();

	componentObj.defineHtmlElementSelector("main");

	componentObj.addHtmlGenerator(function(elementIdOfComponentInstanceWrapper, componentPropertiesObj, stateSlicesObj){

		var retStr = "<header >" +
					"<div class='nav-wrapper'>" +
					"<nav class='nav-logo-container'>" +
					"<div class='logo'><img src='images/svg/logo.svg' /></div>" +
					"</nav>" +
					"<nav class='nav-menu-container'>" +
					"<a class='nav-item link2 inverted'>ABOUT US</a>" +
					"</nav>" +
					"<select id='domainSelectMenu"+elementIdOfComponentInstanceWrapper+"' class='hidden'>";

						for(var i=0; i<stateSlicesObj.domainNames.length; i++)
							retStr += "<option "+ (stateSlicesObj.selectedDomain === stateSlicesObj.domainNames[i] ? "selected='selected'" : "" ) +" value='"+stateSlicesObj.domainNames[i]+"'>Domain: "+stateSlicesObj.domainNames[i]+"</option>";

					retStr += 
					"</select>" +
					"<div class='header-links'>" +
						"<userSettings></userSettings>"  +
					"</div>" +
					"</div>" +
					"</header>" + 
					"<section class='top-section'>" +
					"<div class='container'>" +
					"<div class='alert-message poc-message'><p class='message-content'>This is only a proof of concept. Changes will be lost on refresh.</p></div>" +
					"</div>" +
					"<mainTabs domain='"+stateSlicesObj.selectedDomain+"'></mainTabs>" +
					"</section>";

		return retStr;
	});

	componentObj.addStateExtractor(function(componentPropertiesObj, globalStateObj){

		var stateSlices = {};

		if(globalStateObj.domains){

			stateSlices.domainNames = globalStateObj.domains.map(function(domainObj){
				return domainObj.domainName;
			});
		}
		else{
			stateSlices.domainNames = [];
		}

		stateSlices.selectedDomain = globalStateObj.selectedDomain;

		if(!stateSlices.selectedDomain && stateSlices.domainNames.length)
			stateSlices.selectedDomain = stateSlices.domainNames[0];

		return stateSlices;
	});

	componentObj.addReducer(function(stateObj, actionObj){

		HIPI.framework.Utilities.ensureTypeObject(stateObj);
		HIPI.framework.Utilities.ensureValidActionObject(actionObj);

		switch(actionObj.type){

			case HIPI.state.ActionNames.CHANGE_DOMAIN :

				stateObj.selectedDomain = actionObj.domainName;

				// This isn't necessary and it could cause a wait on a large database, but will increase runtime performance after the domain is selected.
				stateObj = HIPI.lib.Dialogs.cacheDialogDepths(stateObj, stateObj.selectedDomain, "", false);
				stateObj = HIPI.lib.Dialogs.cacheAnsweredStatus(stateObj, stateObj.selectedDomain, "", false);

				break;
		}

		return stateObj;
	});

	componentObj.addStateCleaner(function(stateObj){

		HIPI.framework.Utilities.ensureTypeObject(stateObj);

		// The selected domain isn't something that should be shared with others.
		// Always reset to the first domain in the collection.
		if(stateObj.domains.length)
			stateObj.selectedDomain = stateObj.domains[0].domainName
		else
			delete stateObj.selectedDomain;

		return stateObj;
	});

	componentObj.addDomBindRoutine(function(elementIdOfComponentInstanceWrapper, componentPropertiesObj, stateSlicesObj){

		var domainSelectObj = document.getElementById('domainSelectMenu'+elementIdOfComponentInstanceWrapper);

		domainSelectObj.addEventListener("change", function(){

			HIPI.state.ActionMethods.changeDomainName(domainSelectObj.value);
		});
	});

	HIPI.framework.ComponentCollection.addComponent(componentObj);
});
