let getFormID = function(plugin, group, editorID) {
    let element = xelib.GetElement(0, `${plugin}\\${group}\\${editorID}`);
    return xelib.GetHexFormID(element, false, false);
};