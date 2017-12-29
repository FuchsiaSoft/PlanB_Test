$(document).ready(function () {
    noJavaScriptEnabledAlert();
    setInitialStateOfInputElements();

});

//IF NO JAVASCRIPT ENEBLED USER SHOULD HAVE AN ALERT DISPLAYED
//IF JAVASCRIPT IS ENABLED THIS FUNCTION WILL HIDE THE ALERT
function noJavaScriptEnabledAlert() {
    var allertContainer = document.getElementById("noJavaScriptEnabledAlert");
    allertContainer.style.display = 'none';

}

//CHECKBOXES & RADIO BUTTONS NEED A CHECH ON THEIR VALUE TO DECIDE 
//WHAT CSS CLASS TO APPLY
function setInitialStateOfInputElements() {
    var inputElementArray = document.getElementsByTagName('input');

    for (i = 0; i < inputElementArray.length; i++) {
        var element = inputElementArray[i];
        if (element.type == 'radio' || element.type == 'checkbox') {

            handleClickedEvent(element)
        }
    }

}
