import { program } from 'commander'
import packageJson from '~/package.json'

program
    .name('divlook-i18n')
    .version(packageJson.version, '-v, --version', 'output the current version')
    .option(
        '-o -output <path>',
        '번역 파일들이 저장될 경로 및 파일명. 변수 `column`, `sheet_name`을 사용할 수 있습니다. ex) "./i18n/[column]", "./i18n/[sheet_name]/[column]"',
        './translations/[column]'
    )

program.parse(process.argv)

// const options = program.opts()
