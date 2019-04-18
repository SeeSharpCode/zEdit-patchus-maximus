export default function gameSettingsPatcher(helpers, locals, settings) {
  const { gameSettings } = settings;
  return {
    load: {
      signature: 'GMST',
      filter: gmst => {
        if (!locals.useWarrior) return false;
        const editorID = xelib.EditorID(gmst);
        return Object.keys(gameSettings).includes(editorID);
      },
    },
    patch: gmst => {
      const editorID = xelib.EditorID(gmst);
      const value = gameSettings[editorID];
      xelib.SetFloatValue(gmst, 'DATA\\Float', value);
      helpers.logMessage(`(GMST) set ${editorID} to ${value}`);
    },
  };
}
