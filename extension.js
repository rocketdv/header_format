// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "header-format" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let pasteFormatCmd = vscode.commands.registerTextEditorCommand('extension.format_from_clipboard', editor => {
		// vscode.window.showInformationMessage('Hello World!');
		let clipboard = await vscode.env.clipboard.readText();
		// const text = result.lines.join("\n");
		let result = clipboard
		const selection = editor.selection;
		editor.edit(builder => {
			if (selection.isEmpty) {
				builder.insert(selection.start, result);
			}
			else {
				builder.replace(new vscode.Range(selection.start, selection.end), result);
			}
		});
	});

	context.subscriptions.push(pasteFormatCmd);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
