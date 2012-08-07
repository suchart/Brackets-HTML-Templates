/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, brackets, $ */

define(function (require, exports, module) {
    
    'use strict';

    var CommandManager = brackets.getModule("command/CommandManager"),
        EditorManager  = brackets.getModule("editor/EditorManager"),
        Menus          = brackets.getModule("command/Menus");
    
    // Register the commands and insert in the File menu
    CommandManager.register("HTML Templates...", "templates", action);
    var menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
    menu.addMenuDivider();
    menu.addMenuItem("templates");
    
    // load up modal content, don't forget text! at beginning of file name
    var modal = require("text!html/modal.html");
    
    function action() {
        
        /*  
        *   This uses a modal window to present the different template choices.
        *   I'd rather use a "Templates" menu under File but this will do
        *   until sub-menus are implemented. I may still keep it under Edit
        *   since I'm technically editing the current file instead of
        *   creating a new one, which I would prefer but I don't see how to
        *   do that yet. Right now File -> New creates a new file in the file
        *   system instead of blank file waiting to be saved, which would
        *   be better for this extension.
        */
        
        // add our modal window to the body
        $("body").append(modal);
        
        // pressing esc key closes modal and backdrop
        $(document).keyup(function(e) {
            if (e.keyCode == 27) {
                $("#templates_modal, #templates_modalBackdrop").remove();
                console.log("esc");
            }
        });
        
        // clicking close button, x header button, or backdrop removes modal from body
        $("#templates_modalBtn, #templates_modalBackdrop, #templates_modal a.close").on("click", function(e) {
            e.preventDefault();
            $("#templates_modal, #templates_modalBackdrop").remove();
        });
        
        // file has content, show warning
        if (EditorManager.getCurrentFullEditor()._codeMirror.getValue().length > 0) {
            $("#templates_error").show();
        }
        
        // result of clicking a template choice
        // selector is very specific to avoid cross-extension contamination, just in case
        $("#templates_modal .dialog-message a").on("click", function(e) {
            e.preventDefault();
            // grab the chosen doctype
            var doctype = $(this).attr("data-template");
            
            // grab the html to be inserted into file
            var template;
            switch (doctype) {
                case "html5" :
                    template = require("text!html/html5.html");
                    break;
                case "html4loose" :
                    template = require("text!html/html4loose.html");
                    break;
                case "html4strict" :
                    template = require("text!html/html4strict.html");
                    break;
                case "xhtml1loose" :
                    template = require("text!html/xhtml1loose.html");
                    break;
                case "xhtml1strict" :
                    template = require("text!html/xhtml1strict.html");
                    break;
                case "xhtml11" :
                    template = require("text!html/xhtml11.html");
                    break;
                default :
                    template = "Something went wrong somewhere. Not horribly wrong, just wrong.";
            }
            
            // insert html into file, this will overwrite whatever content happens to be there already
            EditorManager.getCurrentFullEditor()._codeMirror.setValue(template);
            
            // automatically close the modal window
            $("#templates_modalBtn").click();
        });

    }
    
});