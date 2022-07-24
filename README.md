# i18n CLI

## Usage

```bash
npm install @divlook/i18n-cli
npx divlook-i18n --spreadsheet-id=175B6ymwH8MtaLMDCxVQ4Ifjpar4XZBrRkTDSB_ud_b8
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
