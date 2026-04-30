
const vscode = require('vscode');
let signalsCache = [];

function activate(context) {
    const provider = vscode.languages.registerCompletionItemProvider('python', {
        provideCompletionItems(document, position) {
            const linePrefix = document.lineAt(position).text.substr(0, position.character);
            const fullText = document.getText();

            // --- نظام المزامنة (The Sync Engine) ---
            //هنا تحديث المصفوفة
            const signalRegex = /connect\s*\([^,]+,\s*self\.(\w+)\)/g;
            let match;
            let currentSignals = [];

            while ((match = signalRegex.exec(fullText)) !== null) {
                if (!currentSignals.includes(match[1])) {
                    currentSignals.push(match[1]);
                }
            }
            // تحديث الحالة الحالية (يمسح القديم، يضيف الجديد، يعدل الموجود)
            signalsCache = currentSignals;

            // --- تنفيذ ميزة عند كتابة def ---
            if (linePrefix.match(/def\s+\w*$/)) {
                let suggestions = [
                    {
                        label: '__init__',
                        detail: 'def __init__(self):',
                        docs: 'DOC?',
                        insert: '__init__(self):'
                    }
                ];

                // إضافة كل ما في مصفوفة للاقتراحات
                signalsCache.forEach(signalName => {
                    suggestions.push({
                        label: signalName,
                        detail: `Callback function for signal`,
                        docs: `DOC?`,
                        insert: `${signalName}(self, widget):\n\t\${0:pass}`
                    });
                });

                return suggestions.map(s => createItem(s, vscode.CompletionItemKind.Function));
            }

            if (linePrefix.match(/Gtk\.\w*$/i)) {
				// --- Autocomplate Section ---
                return [
					{
						label: 'Box',
						detail: 'Gtk.Box()',
						docs: 'A box in which you can arrange things in a grid pattern.',
						insert: 'Box($1)'
					},
                    {
                        label: 'Button',
                        detail: 'Gtk.Button(label="")',
                        docs: 'Interactive button - can be pressed.',
                        insert: 'Button(label="$1")'
                    },
                    {
                        label: 'Window',
                        detail: 'Gtk.Window',
                        docs: 'This is the main window that contains all the elements.',
                        insert: 'Window'
                    },
                    {
                        label: 'main',
                        detail: 'Gtk.main()',
                        docs: 'DOC?',
                        insert: 'main()'                        
                    },
                    {
                        label: 'main_quit',
                        detail: 'Gtk.main_quit',
                        docs: 'DOC?',
                        insert: 'main_quit'
                    },
                    {
                        label: 'Orientation',
                        detail: 'Gtk.Orientation',
                        docs: 'DOC?',
                        insert: 'Orientation'
                    },
                    {
                        label: 'Label',
                        detail: 'Gtk.Label()',
                        docs: 'DOC?',
                        insert: 'Label($1)'
                    },
                    {
                        label: 'Align',
                        detail: 'AC-GTK',
                        docs: 'DOC?',
                        insert: 'Align'
                    },
                    {
                        label: 'Entry',
                        detail: 'AC-GTK',
                        docs: 'DOC?',
                        insert: 'Entry($1)'
                    },
                    {
                        label: 'AboutDialog',
                        detail: 'AC-GTK',
                        docs: 'DOC?',
                        insert: 'AboutDialog()'
                    }
                ].map(s => createItem(s, vscode.CompletionItemKind.Class));
            }

            if (linePrefix.match(/Orientation\.\w*$/)) {
                return [
                    {
                        label: 'VERTICAL',
                        detail: 'Orientation.VERTICAL',
                        docs: 'DOC?',
                        insert: 'VERTICAL'
                    },
                    {
                        label: 'HORIZONTAL',
                        detail: 'Orientation.HORIZONTAL',
                        docs: 'DOC?',
                        insert: 'HORIZONTAL'
                    }
                ].map(s => createItem(s, vscode.CompletionItemKind.Property))
            }

            if (linePrefix.match(/VERTICAL|HORIZONTAL\,\s*$/)) {
                return [
                    {
                        label: 'spacing',
                        detail: 'spacing=',
                        docs: 'DOC?',
                        insert: 'spacing=$1'
                    }
                ].map(s => createItem(s, vscode.CompletionItemKind.Property))
            }

            if (linePrefix.match(/Label\(\w*$/)) {
                return [
                    {
                        label: 'label',
                        detail: 'Gtk.Label(label="")',
                        docs: 'DOC?',
                        insert: 'label="$1"'
                    }
                ].map(s => createItem(s, vscode.CompletionItemKind.Property))
            }

            if (linePrefix.match(/Align\.\w*$/)) {
                return [
                    {
                        label: 'CENTER',
                        detail: 'AC-GTK',
                        docs: 'DOC?',
                        insert: 'CENTER'
                    },
                    {
                        label: 'RIGHT',
                        detail: 'AC-GTK',
                        docs: 'DOC?',
                        insert: 'RIGHT'
                    },
                    {
                        label: 'LEFT',
                        detail: 'AC-GTK',
                        docs: 'DOC?',
                        insert: 'LEFT'
                    },
                    {
                        label: 'TOP',
                        detail: 'AC-GTK',
                        docs: 'DOC?',
                        insert: 'TOP'
                    },
                    {
                        label: 'BUTTOM',
                        detail: 'AC-GTK',
                        docs: 'DOC?',
                        insert: 'BUTTOM'
                    }
                ].map(s => createItem(s, vscode.CompletionItemKind.Property))
            }

            if (linePrefix.match(/label\s*=\s*".*?"\s*,\s*$/)) {
                return [
                    {
                        label: 'angle',
                        detail: 'angle=int',
                        docs: 'DOC?',
                        insert: 'angle='
                    },
                ].map(s => createItem(s, vscode.CompletionItemKind.Property))
            }

            if (linePrefix.match(/\d+\,\s*$/)) {
                return [
                    {
                        label: 'halign',
                        detail: 'halign=',
                        docs: 'DOC?',
                        insert: 'halign='
                    }
                ].map(s => createItem(s, vscode.CompletionItemKind.Property))
            }

            if (linePrefix.match(/self\.\w*$/)) {
                return [
                    {
                        label: 'set_default_size',
                        detail: 'self.set_default_size(width, height)',
                        docs: 'To control the window size.',
                        insert: 'set_default_size($1)'
                    },
					{
						label: 'add',
						detail: 'self.add(element)',
						docs: 'DOC?',
						insert: 'add($1)'
					},
                    {
                        label: 'show_all',
                        detail: 'show_all()',
                        docs: 'DOC?',
                        insert: 'show_all()'
                    }
                ].map(s => createItem(s, vscode.CompletionItemKind.Method));
            }

			if (linePrefix.match(/def\s+\w*$/)) {
				return [
					{
						label: '__init__',
						detail: 'def __init__(self):',
						docs: 'DOC?',
						insert: '__init__(self):'
					}
				].map(s => createItem(s, vscode.CompletionItemKind.Function))
			}
            //suggests 'widget' if create a function with 'self' and ',' in brackets. 
            if (linePrefix.match(/def\s+\w+\(self,\s*$/)) {
                return [
                    {
                        label: 'widget',
                        detail: 'Common parameter for GTK signals',
                        docs: 'DOC?',
                        insert: 'widget'
                    }
                ].map(s => createItem(s, vscode.CompletionItemKind.Variable));
            }

            if (linePrefix.match(/def\s+\w+\(\s*$/)) {
                return [
                    {
                        label: 'button',
                        detail: 'AC-GTK',
                        docs: 'DOC?',
                        insert: 'button'
                    }
                ].map(s => createItem(s, vscode.CompletionItemKind.Variable));
            }
            
            if (linePrefix.match(/super\(\)\.\w*$/)) {
                return [
                    {
                        label: '__init__',
                        detail: 'super().__init__(title="")',
                        docs: 'DOC?',
                        insert: '__init__(title="$1")'
                    }
                ].map(s => createItem(s, vscode.CompletionItemKind.Method));
            }

            if (linePrefix.match(/super\(\)\.__init__\(\w*$/)) {
                return [
                    {
                        label: 'title',
                        detail: 'super().__init__(title="")',
                        docs: 'DOC?',
                        insert: 'title="$1"'
                    }
                ].map(s => createItem(s, vscode.CompletionItemKind.Property))
            }

            const VarMatchs = linePrefix.match(/(\w+)\.(\w*)$/)

            if (VarMatchs) {
                const varName = VarMatchs[1];
                let results = []; // Array for all

                const gtkTypes = ['Window', 'Button', 'Box', 'Label', 'Entry'];
                const isGtk = gtkTypes.some(type => getVarable(document, varName, type));

                // Gtk
                if (isGtk) {
                    results.push(...[
                        {
                            label: 'props',
                            detail: 'props.propertie_name',
                            docs: 'DOC?',
                            insert: 'props'
                        },
                        {
                            label: 'set_property',
                            detail: 'set_property("{{prop_name}", prop_new_status)',
                            docs: 'DOC?',
                            insert: 'set_property($1)'
                        },
                        {
                            label: 'get_property',
                            detail: 'get_property("{prop_name}")',
                            docs: 'DOC?',
                            insert: 'get_property($1)'
                        }
                    ].map(s => createItem(s, vscode.CompletionItemKind.Method)));
                }

                // Label
                if (getVarable(document, varName, 'Label')) {
                    results.push(...[
                        {
                            label: 'set_text',
                            detail: 'set_text({varable_text_name})',
                            docs: 'DOC?',
                            insert: 'set_text($1)'
                        },
                        {
                            label: 'get_text',
                            detail: 'get_text()',
                            docs: 'DOC?',
                            insert: 'get_text()'
                        }
                    ].map(s => createItem(s, vscode.CompletionItemKind.Method)));
                }

                // Window
                if (getVarable(document, varName, 'Window')) {
                    results.push(...[
                        {
                            label: 'connect',
                            detail: 'Gtk.Window.connect() or your class or varable.',
                            docs: 'DOC?',
                            insert: 'connect($1)'
                        },
                        {
                            label: 'show_all',
                            detail: 'Gtk.Window.show_all() or your class or varable.',
                            docs: 'DOC?',
                            insert: 'show_all($1)'
                        },
                        {
                            label: 'add',
                            detail: 'Gtk.Window().add()',
                            docs: 'DOC?',
                            insert: 'add($1)'
                        }
                    ].map(s => createItem(s, vscode.CompletionItemKind.Method)));
                }

                // Button
                if (getVarable(document, varName, 'Button')) {
                    results.push(...[
                        {
                            label: 'connect',
                            detail: 'Gtk.Button.connect() or your class or varable.',
                            docs: 'DOC?',
                            insert: 'connect($1)'
                        }
                    ].map(s => createItem(s, vscode.CompletionItemKind.Method)));
                }

                // Box
                if (getVarable(document, varName, 'Box')) {
                    results.push(...[
                        {
                            label: 'pack_start',
                            detail: 'pack_start(widget:Object, expand:Bool, fill:Bool, padding:int)',
                            docs: 'DOC?',
                            insert: 'pack_start($1)'
                        }
                    ].map(s => createItem(s, vscode.CompletionItemKind.Method)));
                }

                // Entry
                if (getVarable(document, varName, 'Entry')) {
                    results.push(...[
                        {
                            label: 'in next update [0.0.4]',
                            detail: 'in next update [0.0.4] i have exam..',
                            docs: 'in next update [0.0.4] i have exam..',
                            insert: 'in next update [0.0.4] i have exam..'
                        }
                    ].map(s => createItem(s, vscode.CompletionItemKind.Method)));
                }

                // AboutDialog
                if (getVarable(document, varName, 'AboutDialog')) {
                    results.push(...[
                        {
                            label: 'set_program_name',
                            detail: 'AC-GTK',
                            docs: 'DOC?',
                            insert: 'set_program_name("$1")'
                        },
                        {
                            label: 'set_version',
                            detail: 'AC-GTK',
                            docs: 'DOC?',
                            insert: 'set_version("$1")'
                        },
                        {
                            label: 'set_authors',
                            detail: 'AC-GTK',
                            docs: 'DOC?',
                            insert: 'set_authors(["$1"])'
                        },
                        {
                            label: 'set_copyright',
                            detail: 'AC-GTK',
                            docs: 'DOC?',
                            insert: 'set_copyright("$1")'
                        },
                        {
                            label: 'set_comments',
                            detail: 'AC-GTK',
                            docs: 'DOC?',
                            insert: 'set_comments("$1")'
                        },
                        {
                            label: 'set_website',
                            detail: 'AC-GTK',
                            docs: 'DOC?',
                            insert: 'set_website("$1")'
                        },
                        {
                            label: 'run',
                            detail: 'AC-GTK',
                            docs: 'DOC?',
                            insert: 'run()'
                        },
                        {
                            label: 'destroy',
                            detail: 'AC-GTK',
                            docs: 'DOC?',
                            insert: 'destroy()'
                        }
                    ].map(s => createItem(s, vscode.CompletionItemKind.Method)));
                }

                // All Suggests
                if (results.length > 0) {
                    return results;
                }
            }

            if (linePrefix.match(/set_property\("?$/)) {
                return [
                    {
                        label: '"angle"',
                        detail: '"angle"',
                        docs: 'DOC?',
                        insert: '"angle"'
                    }
                ].map(s => {
                    let item = createItem(s, vscode.CompletionItemKind.Enum);

                    if (linePrefix.endsWith('"')) {
                        item.insertText = new vscode.SnippetString(s.insert.substring(1, s.insert.length - 1));
                    }
                    return item;
                });
            }

            if (linePrefix.match(/props\.\w*$/)) {
                return [
                    {
                        label: 'label',
                        detail: 'AC-GTK',
                        docs: 'DOC?',
                        insert: 'label'
                    }
                ].map(s => createItem(s, vscode.CompletionItemKind.Property))
            }

            if (linePrefix.match(/connect\("?$/)) {
                return [
                    {
                        label: '"destroy"',
                        detail: '"destroy"',
                        docs: 'DOC?',
                        insert: '"destroy"'
                    },
                    {
                        label: '"clicked"',
                        detail: '"clicked"',
                        docs: 'DOC?',
                        insert: '"clicked"'
                    }
                ].map(s => {
                    let item = createItem(s, vscode.CompletionItemKind.Enum);

                    if (linePrefix.endsWith('"')) {
                        item.insertText = new vscode.SnippetString(s.insert.substring(1, s.insert.length - 1));
                    }
                    
                    return item;
                });
            }

            if (linePrefix.match(/connect\(".*",\s*$/)) {
                return [
                    {
                        label: 'Gtk',
                        detail: '"destroy", Gtk',
                        docs: 'DOC?',
                        insert: 'Gtk'
                    },
                    {
                        label: 'self',
                        detail: '"clicked", self.`function`',
                        docs: 'DOC?',
                        insert: 'self'
                    }
                ].map(s => createItem(s, vscode.CompletionItemKind.Method));
            }

            if (linePrefix.match(/Window\(\s*$/i)) {
                return [
                    {
                        label: 'title',
                        detail: 'Gtk.Window(title="")',
                        docs: 'DOC?',
                        insert: 'title="$1"'
                    }
                ].map(s => createItem(s, vscode.CompletionItemKind.Property));
            }

            if (linePrefix.match(/Button\(\w*$/i)) {
                return [
                    {
                        label: 'label',
                        detail: 'Gtk.Button(label"")',
                        docs: 'DOC?',
                        insert: 'label="$1"'
                    }
                ].map(s => createItem(s, vscode.CompletionItemKind.Property));
            }

            if (linePrefix.match(/Box\(\w*$/i)) {
                return [
                    {
                        label: 'orientation',
                        detail: 'orientation=',
                        docs: 'DOC?',
                        insert: 'orientation='
                    }
                ].map(s => createItem(s, vscode.CompletionItemKind.Property))
            }

            return undefined;
        }
    //Trigger ↓ - ↓ - ↓ 
    }, '.', ' ', '!', '(', ',', '"');

    context.subscriptions.push(provider);
}

// --- Create New Item ---
function createItem(s, kind) {
    const item = new vscode.CompletionItem(s.label, kind);
    item.detail = s.detail || '';
    item.documentation = new vscode.MarkdownString(`**AC-GTK:**\n\n${s.docs}`);
    item.insertText = new vscode.SnippetString(s.insert);
	// Sort Up
	item.sortText = `00_${s.label}`
    return item;
}
//get varable and confirm it, for example 'Gtk.Window' to auto connect.
function getVarable(document, varName, gtkType) {
    const fullText = document.getText();
    const classMatch = new RegExp(`(?:self\\.)?${varName}\\s*=\\s*(\\w+)`, 'g').exec(fullText);

    if (classMatch) {
        const className = classMatch[1];
        const isInherited = new RegExp(`class\\s+${className}\\s*\\(\\s*Gtk\\.${gtkType}\\s*\\)`, 'g').test(fullText);
        const isDirect = new RegExp(`(?:self\\.)?${varName}\\s*=\\s*Gtk\\.${gtkType}`, 'g').test(fullText);
        
        return isInherited || isDirect;
    }
    return new RegExp(`(?:self\\.)?${varName}\\s*=\\s*Gtk\\.${gtkType}`, 'g').test(fullText);
}

function deactivate() {}

module.exports = { activate, deactivate };