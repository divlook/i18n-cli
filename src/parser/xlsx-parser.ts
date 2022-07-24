import fs from 'fs'
import * as XLSX from 'xlsx'
import merge from 'merge'
import { ParsedData, ParseOption } from '@/global.type'
import { XlsxParserOption } from '@/parser/xlsx-parser.type'
import {
    checkFileExt,
    textFilter,
    UserError,
    workdir,
} from '@/utils/global-lib'

export class XlsxParser {
    filePath
    extName

    constructor({ input }: XlsxParserOption) {
        const ext = checkFileExt(input)

        const filePath = workdir(input)

        if (!ext.isSupported || !ext.name) {
            throw new UserError('지원되지 않는 포맷의 파일입니다.')
        }

        if (!fs.existsSync(filePath)) {
            throw new UserError('파일이 존재하지 않습니다.')
        }

        this.filePath = filePath
        this.extName = ext.name
    }

    async parse(option: ParseOption): Promise<ParsedData> {
        const buffer = fs.readFileSync(this.filePath)
        const wb = XLSX.read(buffer)

        const sheetNames = textFilter(wb.SheetNames, option.includeSheets)

        const result: ParsedData[] = []

        for (const sheetName of sheetNames) {
            const parsedData: ParsedData = {}

            const ws = wb.Sheets[sheetName]
            const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:Z1')
            const headRange = XLSX.utils.encode_range({
                s: {
                    r: range.s.r,
                    c: range.s.c,
                },
                e: {
                    c: range.e.c,
                    r: range.s.r,
                },
            })

            const head = XLSX.utils.sheet_to_json<string[]>(ws, {
                header: 1,
                range: headRange,
            })[0]

            const allowedHeadSet = new Set(
                textFilter(head, option.excludeColumns, false)
            )

            const rows = XLSX.utils.sheet_to_json<Record<string, string>>(ws)

            // csv는 인코딩 변환
            if (this.extName === 'csv') {
                const prevJsonText = JSON.stringify(rows)
                const bf = Buffer.from(prevJsonText, 'ascii')
                const nextJsonText = bf.toString()
                const nextJson = JSON.parse(nextJsonText)
                rows.splice(0, rows.length, ...nextJson)
            }

            rows.forEach((row, rowIndex) => {
                const key = row['key']

                if (!key) {
                    throw new UserError(`'${sheetName}'시트의 ${rowIndex + 2}번째 줄 'key'가 누락되었습니다.`) // prettier-ignore
                }

                if (!textFilter(key, option.excludeKeys, false).length) {
                    return
                }

                for (const lang of allowedHeadSet) {
                    if (lang === 'key') {
                        continue
                    }

                    const text = String(row[lang] || '')

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

            result.push(parsedData)
        }

        return merge.recursive(...result)
    }
}
