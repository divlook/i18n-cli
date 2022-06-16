import { OutputFormatEnum } from '@/global.type'
import { FileMakerOption } from '@/utils/file-maker.type'

export class FileMaker {
    constructor(option: FileMakerOption) {
        const [outputDir, outputFilename] = this.#getDirAndFilename(
            option.output
        )

        if (option.clean) {
            this.#clean(outputDir)
        }

        // option.output
        // option.outputFormat
        // option.clean
        //

        switch (option.outputFormat) {
            case OutputFormatEnum.Json: {
                this.#makeJson()
            }
        }
    }

    /**
     * TODO:
     */
    #getDirAndFilename(output: string) {
        return ['', '']
    }

    /**
     * TODO:
     */
    #clean(dir: string) {
        //
    }

    /**
     * TODO:
     */
    #makeJson() {
        //
    }
}
