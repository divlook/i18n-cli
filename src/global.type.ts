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
    input?: string
    spreadsheetId?: string
    googleCredentials?: string
    googleToken?: string
    keyFormat: string
}
