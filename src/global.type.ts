export const enum OutputFormatEnum {
    Json = 'json',
}

export type OutputFormat = `${OutputFormatEnum}`

export interface CommandOption {
    output: string
    outputFormat: OutputFormatEnum
    clean: boolean
    excludeColumns?: string
    excludeKeys?: string
    includeSheets: string
    keyFormat: string
    input?: string
    spreadsheetId?: string
    googleCredentials?: string
    googleToken?: string
}

export type ParseOption = Pick<
    CommandOption,
    | 'excludeColumns' //
    | 'excludeKeys'
    | 'includeSheets'
    | 'keyFormat'
>

export interface ParsedData {
    [lang: string]: {
        [sheetName: string]: {
            [key: string]: string
        }
    }
}
