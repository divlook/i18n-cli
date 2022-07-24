import merge from 'merge'
import { sheets } from '@googleapis/sheets'
import { SpreadsheetParserOption } from '@/parser/spreadsheet-parser.type'
import { GoogleAuth } from '@/utils/google-auth'
import { ParsedData, ParseOption } from '@/global.type'
import { textFilter, UserError } from '@/utils/global-lib'

export class SpreadsheetParser {
    #sheets
    sheetId

    constructor({
        credentialsPath,
        tokenPath,
        sheetId,
    }: SpreadsheetParserOption) {
        this.#sheets = GoogleAuth.getOAuth2Client({
            credentialsPath,
            tokenPath,
        }).then(async (auth) => {
            const sheetClient = sheets({
                version: 'v4',
                auth,
            })

            return sheetClient.spreadsheets
        })

        this.sheetId = sheetId
    }

    async parse(option: ParseOption): Promise<ParsedData> {
        const sheetNames = textFilter(
            await this.#getSheetNames(),
            option.includeSheets
        )

        const result: ParsedData[] = []

        // 1초에 5개씩 보내도록 제한함 (Google Sheet APi 제한 : 1분에 300개)
        while (sheetNames.length > 0) {
            const currentCount = result.length
            const part = sheetNames.splice(0, 5)
            const promises = part.map(async (sheetName, sheetIndex) => {
                const parsedData: ParsedData = {}
                const rows = await this.#getRowsBySheetName(sheetName)
                const head = rows.shift() ?? []
                const allowedHeadSet = new Set(
                    textFilter(head, option.excludeColumns, false)
                )
                const allowedHeadIndexMap = new Map<number, string>()

                head.forEach((value, index) => {
                    if (value && allowedHeadSet.has(value)) {
                        allowedHeadIndexMap.set(index, value)
                    }
                })

                rows.forEach((cols, rowIndex) => {
                    const key = cols[0]

                    if (!key) {
                        throw new UserError(`'${sheetName}'시트의 ${rowIndex + 2}번째 줄 'key'가 누락되었습니다.`) // prettier-ignore
                    }

                    if (!textFilter(key, option.excludeKeys, false).length) {
                        return
                    }

                    for (let colIndex = 1; colIndex < cols.length; colIndex++) {
                        const lang = allowedHeadIndexMap.get(colIndex)
                        const text = cols[colIndex] || ''

                        if (!lang) {
                            continue
                        }

                        parsedData[lang] ??= {}
                        parsedData[lang][sheetName] ??= {}
                        parsedData[lang][sheetName][key] ||= text

                        if (!parsedData[lang][sheetName][key]) {
                            throw new UserError(`'${sheetName}'시트의 ${lang}:${rowIndex + 2} 값이 누락되었습니다.`) // prettier-ignore
                        }
                    }
                })

                result[currentCount + sheetIndex] = parsedData
            })

            await Promise.all(promises)

            await new Promise((resolve) => setTimeout(resolve, 1000))
        }

        return merge.recursive(...result)
    }

    async #getSheetNames(): Promise<string[]> {
        const sheets = await this.#sheets

        return sheets
            .get({
                spreadsheetId: this.sheetId,
            })
            .then((res) => {
                const arr = res?.data?.sheets ?? []

                return arr.map((row) => {
                    return row.properties?.title ?? ''
                })
            })
            .catch((error) => {
                console.error(error)
                throw error
            })
    }

    async #getRowsBySheetName(sheetName: string): Promise<string[][]> {
        const sheets = await this.#sheets

        return sheets.values
            .get({
                spreadsheetId: this.sheetId,
                range: sheetName,
            })
            .then((res) => {
                return res?.data?.values || []
            })
            .catch((error) => {
                console.error(error)
                throw error
            })
    }
}
