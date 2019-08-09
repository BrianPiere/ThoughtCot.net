"use strict";
postInit(function(){

	var componentObj = new HIPI.framework.Component();

	componentObj.defineHtmlElementSelector("newMessageWindow");
	componentObj.defineComponentPropName("domain");
	componentObj.defineComponentPropName("dialogPositionChain");

	componentObj.addHtmlGenerator(function(elementIdOfComponentInstanceWrapper, componentPropertiesObj, stateSlicesObj){

		if(!componentPropertiesObj.dialogPositionChain){

			var perpendicularOrientationClassName = "trusting-dialog";

			var dialogTitleStr = "Add Base Message";
		}
		else if(HIPI.lib.Dialogs.isDialogLevelSkeptical(componentPropertiesObj.dialogPositionChain)){

			var perpendicularOrientationClassName = "trusting-dialog";

			var dialogTitleStr = "Add Supportive Message / Answer";
		}
		else{

			var perpendicularOrientationClassName = "skeptical-dialog";

			var dialogTitleStr = "Add Skeptical Message / Question";
		}

		var retHtml = "<div id="+ elementIdOfComponentInstanceWrapper +" class='new-message-dialog "+perpendicularOrientationClassName+"'>" +
						"<button class='btn-leave-perpendicular'  id='btn-cancel-new-message"+ elementIdOfComponentInstanceWrapper +"'><i class='fas fa-times'></i></button>" + 
						"<h4 class='title sm-top sm-btm'>"+dialogTitleStr+"</h4>" +
						"<newMessageTabs domain='"+componentPropertiesObj.domain+"' dialogPositionChain='"+componentPropertiesObj.dialogPositionChain+"'></newMessageTabs>" +
						"</div>";

		return retHtml;
	});

	HIPI.framework.ComponentCollection.addComponent(componentObj);
});
