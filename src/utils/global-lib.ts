import * as path from 'path'
import minimatch from 'minimatch'

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

export function textFilter(
    input: string | string[],
    pattern: string | null = null,
    isInclude = true
) {
    const texts: string[] = []

    if (Array.isArray(input)) {
        texts.push(...input)
    } else {
        texts.push(input)
    }

    if (pattern === null) {
        return texts
    }

    const patterns = new Set(pattern.split(',').map((row) => row.trim()))

    return texts.filter((sheetName) => {
        for (const pattern of patterns) {
            if (minimatch(sheetName, pattern)) {
                return isInclude
            }
        }

        return !isInclude
    })
}

export function makeKey({
    key,
    sheetName,
    keyFormat,
}: {
    key: string
    sheetName: string
    keyFormat: string
}) {
    let result = key

    if (keyFormat) {
        if (key) {
            result = keyFormat.replaceAll(`[key]`, key)
        }

        if (sheetName) {
            result = keyFormat.replaceAll(`[sheetName]`, sheetName)
        }
    }

    return result
}
