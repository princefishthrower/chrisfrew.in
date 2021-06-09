import { updateArray } from "../../../../frontend/typescript/utils/updateArray"

// Given interface IEditorSetting:
export default interface IEditorSetting {
    fileLabel: string
    code: string
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

const code = "<p>some new HTML code for the html editor</p>"

// This will return a new array of type Array<IEditorSetting>,
// with the code updated the code ONLY for the editor(s) which isActive = true
const updatedArray = updateArray<IEditorSetting, "isActive", "code">({
    array: editorSettingsState,
    testKey: "isActive",
    testValue: true,
    updateKey: "code",
    updateValue: code,
})