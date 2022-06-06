// @ts-check
import * as path from 'path'
import ESLintPlugin from 'eslint-webpack-plugin'

/**
 * @returns { import('webpack').Configuration }
 */
export default () => ({
    mode: 'production',
    target: 'node',
    entry: path.resolve('./src/main.ts'),
    output: {
        filename: 'i18n-cli.cjs',
        path: path.resolve('./dist'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts'],
        alias: {
            '~': path.resolve(),
            '@': path.resolve('./src'),
        },
    },
    plugins: [new ESLintPlugin()],
})
