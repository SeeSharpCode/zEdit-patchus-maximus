export default function bookPatcher(helpers, locals) {
    return {
        load: {
            signature: 'BOOK',
            filter: record => xelib.GetFlag(record, 'DATA - Data\\Flags', 'Teaches Spell')
        },
        patch: record => {
            helpers.logMessage(`(BOOK) ${xelib.FullName(record)}`);
        }
    };
}
