import { program } from 'commander'
import packageJson from '~/package.json'
import { CommandOption, OutputFormatEnum } from '@/global.type'
import { UserError } from '@/utils/global-lib'
import { SpreadsheetParser } from '@/parser/spreadsheet-parser'
import { XlsxParser } from '@/parser/xlsx-parser'

program
    .name(`divlook-i18n`)
    .version(packageJson.version, `-v, --version`, `output the current version`)
    .option(
        `-o --output <path>`,
        `번역 파일들이 저장될 경로 및 파일명. 변수 \`lang\`, \`sheet_name\`을 사용할 수 있습니다. ex) \`./i18n/[lang]\`, \`./i18n/[sheet_name]/[lang]\``,
        `./translations/[lang]`
    )
    .option(
        `--output-format <format>`,
        `지원되는 포맷 : ${OutputFormatEnum.Json}`,
        OutputFormatEnum.Json
    )
    .option(
        `--clean`,
        `결과물을 생성하기 전에 output 디렉토리를 깨끗하게 정리합니다.`,
        false
    )
    .option(
        `--exclude-columns <columns>`,
        `결과물에서 제외시킬 컬럼명. \`,\`를 사용하여 복수로 입력할 수 있습니다. ex) \`desc\`, \`memo\` glob 패턴을 지원합니다. ex) \`ignore-*\``
    )
    .option(
        `--exclude-keys <keys>`,
        `결과물에서 제외시킬 key. \`,\`를 사용하여 복수로 입력할 수 있습니다. ex) \`key1\`, \`key2\` glob 패턴을 지원합니다. ex) \`ignore-*\``
    )
    .option(
        `--include-sheets <sheets>`,
        `변환을 시도할 시트명. \`,\`를 사용하여 복수로 입력할 수 있습니다. ex) \`Sheet 1\`, \`Sheet 2\` glob 패턴을 지원합니다. ex) \`Sheet*\``,
        `*`
    )
    .option(
        `--key-format <format>`,
        `key 포맷입니다. 변수 \`key\`, \`sheet_name\`을 사용할 수 있습니다. ex) \`[key]\`, \`[sheet_name].[key]\``,
        `[key]`
    )
    .option(
        `--group-by-sheet`,
        `이 값이 true인 경우 key를 sheet 단위로 묶어서 출력합니다.`,
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
            if (option.spreadsheetId) {
                const data = await new SpreadsheetParser({
                    sheetId: option.spreadsheetId,
                    credentialsPath: option.googleCredentials,
                    tokenPath: option.googleToken,
                }).parse({
                    includeSheets: option.includeSheets,
                    keyFormat: option.keyFormat,
                    excludeColumns: option.excludeColumns,
                    excludeKeys: option.excludeKeys,
                })

                console.log(data)
                return
            }

            if (option.input) {
                const data = await new XlsxParser({
                    input: option.input,
                }).parse({
                    includeSheets: option.includeSheets,
                    keyFormat: option.keyFormat,
                    excludeColumns: option.excludeColumns,
                    excludeKeys: option.excludeKeys,
                })

                console.log(data)
                return
            }

            program.error(
                `\`--spreadsheet-id\`, \`--input\` 옵션 중 하나는 필수로 입력이 필요합니다.`
            )
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

// const options = program.opts()
