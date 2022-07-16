import fs from 'fs'
import * as XLSX from 'xlsx'
import { ParsedData, ParseOption } from '@/global.type'
import { XlsxParserOption } from '@/parser/xlsx-parser.type'
import { checkFileExt, UserError, workdir } from '@/utils/global-lib'

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
        // npm run exec -- --input="./i18n-cli spreadsheet sample.xlsx"

        const buffer = fs.readFileSync(this.filePath)
        const wb = XLSX.read(buffer)

        for (const sheetName of wb.SheetNames) {
            const ws = wb.Sheets[sheetName]

            console.log(sheetName)

            // 엑셀파서에서는 head가 필요없을 수 있겠군
            // const head = XLSX.utils.sheet_to_json(ws, {
            //     header: 1,
            //     range: 'A1:Z1',
            // })[0]
            // console.log(head)

            const rows = XLSX.utils.sheet_to_json(ws)

            // csv는 인코딩 변환
            if (this.extName === 'csv') {
                const prevJsonText = JSON.stringify(rows)
                const bf = Buffer.from(prevJsonText, 'ascii')
                const nextJsonText = bf.toString()
                const nextJson = JSON.parse(nextJsonText)
                rows.splice(0, rows.length, ...nextJson)
            }

            console.log(rows)
        }

        return {} // TODO:
    }
}
