import fs from 'fs'
import path from 'path'
import { OutputFormatEnum, ParsedData } from '@/global.type'
import { FileMakerOption } from '@/utils/file-maker.type'

export class FileMaker {
    #cleaningByOutputDir = new Set<string>()

    constructor(data: ParsedData, private option: FileMakerOption) {
        const { output, outputFormat, saveEachSheet } = option

        for (const lang in data) {
            const dataByLang = data[lang]
            const filename = `${lang}.${outputFormat}`
            const outputDir = path.join(process.cwd(), output)

            if (saveEachSheet) {
                for (const sheetName in dataByLang) {
                    const dataBySheetName = dataByLang[sheetName]
                    const outputDirBySheetName = path.join(outputDir, sheetName)

                    this.#save(outputDirBySheetName, filename, dataBySheetName)
                }
                continue
            }

            this.#save(outputDir, filename, dataByLang)
        }
    }

    #save(outputDir: string, filename: string, data: object) {
        const { clean } = this.option

        if (clean && !this.#cleaningByOutputDir.has(outputDir)) {
            fs.rmSync(outputDir, {
                force: true,
                recursive: true,
            })
            this.#cleaningByOutputDir.add(outputDir)
        }

        fs.mkdirSync(outputDir, {
            recursive: true,
        })

        fs.writeFileSync(path.join(outputDir, filename), this.#toString(data))
    }

    #toString(data: object) {
        switch (this.option.outputFormat) {
            case OutputFormatEnum.Json:
            default:
                return JSON.stringify(data, null, 4)
        }
    }
}
