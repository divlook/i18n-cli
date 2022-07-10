import * as path from 'path'
import { Configuration } from 'webpack'
import ESLintPlugin from 'eslint-webpack-plugin'

const config: Configuration = {
    mode: 'production',
    target: 'node',
    entry: {
        'i18n-cli': {
            import: path.resolve('./src/main.ts'),
            dependOn: 'vendors',
        },
        vendors: ['commander', '@googleapis/sheets'],
    },
    output: {
        filename: '[name].js',
        path: path.resolve('./dist'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                        },
                    },
                ],
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
}

export default config
