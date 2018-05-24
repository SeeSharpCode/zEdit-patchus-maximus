// TODO: Remove when zEdit v0.4.2+ releases
if (!xelib.hasOwnProperty('GetRefEditorID')) {
    xelib.GetRefEditorID = function(id, path) {
        return xelib.WithHandle(xelib.GetLinksTo(id, path), linked => {
            return linked ? xelib.EditorID(linked) : '';
        });
    };
}