import * as path from 'path'

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

export function workdir(...paths: string[]) {
    return path.join(process.cwd(), ...paths)
}

export class UserError extends Error {
    constructor(message?: string) {
        super(message)
        this.name = 'UserError'
    }
}
