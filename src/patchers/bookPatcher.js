export default function bookPatcher(configService) {
    const createStaff = function(record) {

    };

    return {
        load: {
            signature: 'BOOK',
            filter: record => xelib.GetFlag(record, 'DATA - Data\\Flags', 'Teaches Spell')
        },
        patch: record => {
            if (createStaff(record)) {

            }
        }
    };
}
