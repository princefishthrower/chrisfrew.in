// Given interface IFile:
export interface IFile {
    fileLabel: string
    code: string
}

// and interface IEditorSetting:
export interface IEditorSetting extends IFile {
    isActive: boolean
}

// and array editorSettingsState, which is of type Array<IEditorSetting>:
const editorSettingsState: Array<IEditorSetting> = [
    {
        fileLabel: 'myJSFile.js',
        code: '// some JS comment',
        isActive: false
    },
    {
        fileLabel: 'myHTMLFile.html',
        code: '<h1>hello world</h1>',
        isActive: true
    },
    {
        fileLabel: 'myCSSFile.css',
        code: 'h1 { color: red; }',
        isActive: false
    }
]

// and some incoming files from an API or similar:
const files: Array<IFile> = [
    {
        fileLabel: 'myJSFile.js',
        code: '// awesome server generated code'
    },
    {
        fileLabel: 'myHTMLFile.js',
        code: '<h1>awesome generated code</h1>'
    },
    {
        fileLabel: 'myCSSFile.css',
        code: 'h1 { color: blue; font-weight: bold; }'
    },
]

// This will return a new array of type Array<IEditorSetting>,
// with the code updated the code for all files WITHOUT changing the isActive property (since isActive is not in IFile)
const mergedArray = mergeArrays({
    mergeArray: files,
    existingArray: editorSettingsState,
    matchKey: "fileLabel"
})