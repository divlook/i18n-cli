# i18n CLI

## Usage

### Download sample spreadsheet

- [i18n-cli spreadsheet sample](https://docs.google.com/spreadsheets/d/175B6ymwH8MtaLMDCxVQ4Ifjpar4XZBrRkTDSB_ud_b8)

### Via spreadsheet

```bash
$ npm install @divlook/i18n-cli
$ npx divlook-i18n --spreadsheet-id=175B6ymwH8MtaLMDCxVQ4Ifjpar4XZBrRkTDSB_ud_b8
```

### Via excel

```bash
$ npm install @divlook/i18n-cli
$ npx divlook-i18n --input=./i18n.xlsx
```

### Options

```bash
$ npx divlook-i18n --help
Usage: divlook-i18n [options]

Options:
  -v, --version                output the current version
  -o --output <path>           번역 파일들이 저장될 경로. (default: "./translations")
  --output-format <json>       지원되는 포맷 (default: "json")
  --clean                      결과물을 생성하기 전에 output 디렉토리를 깨끗하게 정리합니다. (default: false)
  --exclude-columns <columns>  결과물에서 제외시킬 컬럼명. `,`를 사용하여 복수로 입력할 수 있습니다. ex) `desc`, `memo`. glob 패턴을 지원합니다. ex) `ignore-*`
  --exclude-keys <keys>        결과물에서 제외시킬 key. `,`를 사용하여 복수로 입력할 수 있습니다. ex) `key1`, `key2`. glob 패턴을 지원합니다. ex) `ignore-*`
  --include-sheets <sheets>    변환을 시도할 시트명. `,`를 사용하여 복수로 입력할 수 있습니다. ex) `Sheet 1`, `Sheet 2`. glob 패턴을 지원합니다. ex) `Sheet*` (default: "*")
  --save-each-sheet            이 값이 true인 경우 Sheet별로 각각 저장합니다. 기본적으로 1개의 파일에 저장합니다. (default: false)
  --input <path>               `xlsx`, csv 파일 허용. ex) `./i18n.xlsx`
  --spreadsheet-id <id>        ID 찾는 방법 : https://docs.google.com/spreadsheets/d/{{id}}/edit
  --google-credentials <path>  Google Sheets Node API credentials 파일의 경로. 생성 방법 : https://developers.google.com/workspace/guides/create-credentials#desktop-app (default: "./credentials.json")
  --google-token <path>        Google Sheets API token 파일의 경로. 최초 실행시 생성되고 이후는 재사용할 수 있습니다. (default: "./token.json")
  -h, --help                   display help for command
```

## Develop guide

### Setup

```bash
nvm use # v16
npm install
```

### Develop

```bash
npm run test.watch
```

### Build

```bash
npm run build # output: ./dist/i18n-cli.js
```

### Execute

이 명령어는 `npm run build` 실행이 선행됩니다.

```bash
npm run exec # == node ./dist/i18n-cli.js
```
