import { CommandOption } from '@/global.type'

export type SpreadsheetParserOption = Pick<
    CommandOption,
    | 'spreadsheetId' //
    | 'googleCredentials'
    | 'googleToken'
>
