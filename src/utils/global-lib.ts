/**
 * TODO:
 */
export function checkFileExt(filename: string) {
    const result = (ext: 'xlsx' | 'csv' | null) => {
        if (ext) {
            return {
                isSupported: true,
                name: ext,
            } as const
        }

        return {
            isSupported: false,
            name: null,
        } as const
    }

    if (/.+\.xlsx$/.test(filename)) {
        return result('xlsx')
    }

    if (/.+\.csv$/.test(filename)) {
        return result('csv')
    }

    return result(null)
}
