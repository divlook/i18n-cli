import { program } from 'commander'
import packageJson from '~/package.json'
import { CommandOption, OutputFormatEnum, ParsedData } from '@/global.type'
import { UserError } from '@/utils/global-lib'
import { SpreadsheetParser } from '@/parser/spreadsheet-parser'
import { XlsxParser } from '@/parser/xlsx-parser'
import { FileMaker } from '@/utils/file-maker'

program
    .name(`divlook-i18n`)
    .version(packageJson.version, `-v, --version`, `output the current version`)
    .option(
        `-o --output <path>`,
        `번역 파일들이 저장될 경로.`,
        `./translations`
    )
    .option(
        `--output-format <${OutputFormatEnum.Json}>`,
        `지원되는 포맷`,
        OutputFormatEnum.Json
    )
    .option(
        `--clean`,
        `결과물을 생성하기 전에 output 디렉토리를 깨끗하게 정리합니다.`,
        false
    )
    .option(
        `--exclude-columns <columns>`,
        `결과물에서 제외시킬 컬럼명. \`,\`를 사용하여 복수로 입력할 수 있습니다. ex) \`desc\`, \`memo\`. glob 패턴을 지원합니다. ex) \`ignore-*\``
    )
    .option(
        `--exclude-keys <keys>`,
        `결과물에서 제외시킬 key. \`,\`를 사용하여 복수로 입력할 수 있습니다. ex) \`key1\`, \`key2\`. glob 패턴을 지원합니다. ex) \`ignore-*\``
    )
    .option(
        `--include-sheets <sheets>`,
        `변환을 시도할 시트명. \`,\`를 사용하여 복수로 입력할 수 있습니다. ex) \`Sheet 1\`, \`Sheet 2\`. glob 패턴을 지원합니다. ex) \`Sheet*\``,
        `*`
    )
    .option(
        `--save-each-sheet`,
        `이 값이 true인 경우 Sheet별로 각각 저장합니다. 기본적으로 1개의 파일에 저장합니다.`,
        false
    )
    .option(`--input <path>`, `\`xlsx\`, csv 파일 허용. ex) \`./i18n.xlsx\``)
    .option(
        `--spreadsheet-id <id>`,
        `ID 찾는 방법 : https://docs.google.com/spreadsheets/d/{{id}}/edit`
    )
    .option(
        `--google-credentials <path>`,
        `Google Sheets Node API credentials 파일의 경로. 생성 방법 : https://developers.google.com/workspace/guides/create-credentials#desktop-app`,
        `./credentials.json`
    )
    .option(
        `--google-token <path>`,
        `Google Sheets API token 파일의 경로. 최초 실행시 생성되고 이후는 재사용할 수 있습니다.`,
        `./token.json`
    )
    .action(async (option: CommandOption) => {
        try {
            let data: ParsedData | null = null

            if (!option.spreadsheetId && !option.input) {
                program.error(
                    `\`--spreadsheet-id\`, \`--input\` 옵션 중 하나는 필수로 입력이 필요합니다.`
                )
            }

            if (option.spreadsheetId) {
                data = await new SpreadsheetParser({
                    sheetId: option.spreadsheetId,
                    credentialsPath: option.googleCredentials,
                    tokenPath: option.googleToken,
                }).parse({
                    includeSheets: option.includeSheets,
                    excludeColumns: option.excludeColumns,
                    excludeKeys: option.excludeKeys,
                })
            }

            if (option.input) {
                data = await new XlsxParser({
                    input: option.input,
                }).parse({
                    includeSheets: option.includeSheets,
                    excludeColumns: option.excludeColumns,
                    excludeKeys: option.excludeKeys,
                })
            }

            if (data) {
                new FileMaker(data, {
                    clean: option.clean,
                    output: option.output,
                    outputFormat: option.outputFormat,
                    saveEachSheet: option.saveEachSheet,
                })
            }
        } catch (error) {
            if (error instanceof UserError && error.message) {
                program.error(error.message)
            }

            if (error instanceof Error && error.message) {
                program.error(error.message)
            }

            console.error(error)
        }
    })

program.parse(process.argv)
