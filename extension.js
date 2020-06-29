// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

function getFormatted(clip) {
	return clip
		.split('\n')
		.map(x => x.trim())
		.map(x => /^(.[^\s|\t|:]+)[\s|: |:|\t](.*)$/g.exec(x))
		.filter(x => x)
		.map(x => {
			try {
				let [_, k, v] = x
				v = v.trim()
				k = /^\d|-/.test(k) ? `'${k}'` : k
				v = /^[0-9]+$/.test(v) ? v : `'${v}'`

				return [k, v].join(': ')
			} catch (e) { }
		})
		.filter(x => x)
		.join(',\n')
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "header-format" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let pasteFormatCmd = vscode.commands.registerCommand('extension.format_from_clipboard', async () => {
		// vscode.window.showInformationMessage('Hello World!');
		const editor = vscode.window.activeTextEditor
		if (!editor) { return vscode.window.showErrorMessage('No active editor selected!') }
		let clipboard = await vscode.env.clipboard.readText() || '';
		// const text = result.lines.join("\n");
		let result
		try {
			result = getFormatted(clipboard)
		} catch (e) {
			console.log(e)
			return vscode.window.showErrorMessage('Error parsing headers!')
		}
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

	let selectFormatCmd = vscode.commands.registerCommand('extension.format_from_selection', async () => {
		// vscode.window.showInformationMessage('Hello World!');
		const editor = vscode.window.activeTextEditor
		if (!editor) { return vscode.window.showErrorMessage('No active editor selected!') }
		const selection = editor.selection
		let raw = editor.document.getText(selection);
		// const text = result.lines.join("\n");
		let result
		try {
			result = getFormatted(raw)
		} catch (e) {
			console.log(e)
			return vscode.window.showErrorMessage('Error parsing headers!')
		}

		editor.edit(builder => {
			if (selection.isEmpty) {
				builder.insert(selection.start, result);
			}
			else {
				builder.replace(new vscode.Range(selection.start, selection.end), result);
			}
		});
	});

	context.subscriptions.push(pasteFormatCmd, selectFormatCmd);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
