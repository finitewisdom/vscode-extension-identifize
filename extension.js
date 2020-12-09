const
    vscode = require( "vscode" );

/**
 * @param {vscode.ExtensionContext} context - Context for the extension itself
 */
function activate( context ) {

    [
        "identifize.identifizeWithHyphensLowerCase",
        "identifize.identifizeWithHyphensUpperCase",
        "identifize.identifizeWithUnderscoresLowerCase",
        "identifize.identifizeWithUnderscoresUpperCase"
    ].forEach( ( command ) => {

        const disposable = vscode.commands.registerCommand( command, function() {

            const editor = vscode.window.activeTextEditor;  // get the active text editor
            if ( editor ) {

                const
                    document = editor.document,
                    selections = editor.selections,
                    edits = [];

                selections.forEach( ( selection ) => { 

                    const word = document.getText( selection );  // get the word within the selection
                    
                    let replacement = word;

                    if ( command.includes( "LowerCase" ) ) {
                        replacement = replacement.toLowerCase();
                    } else if ( command.includes( "UpperCase" ) ) {
                        replacement = replacement.toUpperCase();
                    }
                    if ( command.includes( "Hyphens" ) ) {
                        replacement = replacement.replace( /[^0-9a-z]/gi, "-" );
                        replacement = replacement.replace( /-+/g, "-" );
                        replacement = replacement.replace( /^-/, "" );
                        replacement = replacement.replace( /-$/, "" );
                    } else if ( command.includes( "Underscores" ) ) {
                        replacement = replacement.replace( /[^0-9a-z]/gi, "_" );
                        replacement = replacement.replace( /_+/g, "_" );
                        replacement = replacement.replace( /^_/, "" );
                        replacement = replacement.replace( /_$/, "" );
                    }

                    edits.push( { selection, replacement } );                
                } );

                editor.edit( ( editBuilder ) => {
                    edits.forEach( ( edit ) => {
                        editBuilder.replace( edit.selection, edit.replacement );
                    } );
                } ).then( () => {} );
            }
        } );

        context.subscriptions.push( disposable );	
    } );
}

function deactivate() {
    //  nothing to do
}

module.exports = { activate, deactivate };
