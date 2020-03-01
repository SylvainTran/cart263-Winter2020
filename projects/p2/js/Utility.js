//handleMessageDialog
//
//handle message dialogues - From P1
function handleMessageDialog() {
    let text2 = "You have a new quest.";
    createDialog("New Quest", text2, "Accept", "Accept", null, closeDialog);
}

//closeDialog
//
//Closes this dialog - From P1
function closeDialog() {
    $(this).dialog("close");
}
  
//createDialog(title, text, button1, button2, button1Event, button2Event)
//
//creates a generic dialog with the provided args - From P1
function createDialog(title, text, button1, button2, button1Event, button2Event) {
    let newDialog = document.createElement("div");

    $(newDialog).addClass(".dialog");
    $(newDialog).attr("title", title);
    $(newDialog).text(text);
    $(newDialog).dialog({
        position: { my: "center top", at: "right top"},
        buttons: [
        {
            text: button1,
            click: button1Event
        },
        {
            text: button2,
            click: button2Event
        }
        ]
    });
}