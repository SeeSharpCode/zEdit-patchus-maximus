export default function globPatcher(helpers, locals) {
  return {
    load: {
      signature: 'GLOB',
      filter: record => {
        const editorID = xelib.EditorID(record);

        return (locals.useMage && editorID === 'xMAIsPerMaMageRunning')
          || (locals.useWarrior && editorID === 'xMAIsPerMaWarriorRunning')
          || (locals.useThief && editorID === 'xMAIsPerMaThiefRunning');
      },
    },
    patch: record => {
      xelib.SetFloatValue(record, 'FLTV', 1);
    },
  };
}
