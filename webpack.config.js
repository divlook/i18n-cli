// @ts-check
import * as path from 'path'
import ESLintPlugin from 'eslint-webpack-plugin'

/**
 * @returns { import('webpack').Configuration }
 */
export default () => ({
    mode: 'production',
    target: 'node',
    entry: {
        'i18n-cli': {
            import: path.resolve('./src/main.ts'),
            dependOn: 'vendors',
        },
        vendors: ['commander'],
    },
    output: {
        filename: '[name].cjs',
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
        extensions: ['.ts', '.js', '.json'],
        alias: {
            '~': path.resolve(),
            '@': path.resolve('./src'),
        },
    },
    plugins: [new ESLintPlugin()],
    stats: 'minimal',
})
