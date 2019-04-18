export default function globPatcher(helpers, locals) {
  return {
    load: {
      signature: 'GLOB',
      filter: glob => {
        const editorID = xelib.EditorID(glob);
        return (locals.useMage && editorID === 'xMAIsPerMaMageRunning')
          || (locals.useWarrior && editorID === 'xMAIsPerMaWarriorRunning')
          || (locals.useThief && editorID === 'xMAIsPerMaThiefRunning');
      },
    },
    patch: glob => {
      xelib.SetFloatValue(glob, 'FLTV', 1);
    },
  };
}
