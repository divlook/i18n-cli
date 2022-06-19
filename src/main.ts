import { program } from 'commander'
import packageJson from '~/package.json'
import { CommandOption, OutputFormatEnum } from '@/global.type'
import { checkFileExt, UserError } from '@/utils/global-lib'
import { SpreadsheetParser } from '@/parser/spreadsheet-parser'

program
    .name(`divlook-i18n`)
    .version(packageJson.version, `-v, --version`, `output the current version`)
    .option(
        `-o --output <path>`,
        `번역 파일들이 저장될 경로 및 파일명. 변수 \`column\`, \`sheet_name\`을 사용할 수 있습니다. ex) \`./i18n/[column]\`, \`./i18n/[sheet_name]/[column]\``,
        `./translations/[column]`
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
    .option(
        `--key-format <format>`,
        `key 포맷입니다. 변수 \`key\`, \`sheet_name\`을 사용할 수 있습니다. ex) \`[key]\`, \`[sheet_name].[key]\``,
        `[key]`
    )
    .action(async (option: CommandOption) => {
        try {
            if (option.spreadsheetId) {
                await SpreadsheetParser.parse({
                    sheetId: option.spreadsheetId,
                    credentialsPath: option.googleCredentials,
                    tokenPath: option.googleToken,
                })
                return
            }

            if (option.input) {
                const ext = checkFileExt(option.input)

                if (!ext.isSupported) {
                    program.error(`지원되지 않는 포맷의 파일입니다.`)
                }

                switch (ext.name) {
                    case 'xlsx': {
                        //
                        break
                    }

                    case 'csv': {
                        //
                        break
                    }
                }

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
