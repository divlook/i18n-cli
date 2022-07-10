import fs from 'fs'
import { sheets } from '@googleapis/sheets'
import { SpreadsheetParserOption } from '@/parser/spreadsheet-parser.type'
import { GoogleAuth } from '@/utils/google-auth'

export class SpreadsheetParser {
    static async parse({
        credentialsPath,
        tokenPath,
        ...option
    }: SpreadsheetParserOption) {
        const oAuth2Client = await GoogleAuth.getOAuth2Client({
            credentialsPath,
            tokenPath,
        })

        const sheetClient = sheets({ version: 'v4', auth: oAuth2Client })

        // sheetClient.spreadsheets
    }
}
