import fs from 'fs'
import readline from 'readline'
import { auth } from '@googleapis/sheets'
import { OAuth2Client } from 'google-auth-library'
import { UserError, workdir } from '@/utils/global-lib'
import {
    Credentials,
    GetOAuth2ClientOption,
    Token,
} from '@/utils/google-auth.type'

export class GoogleAuth {
    static #DEFAULT_CREDENTIALS_PATH = './credentials.json'

    static #DEFAULT_TOKEN_PATH = './token.json'

    static async getOAuth2Client(option: GetOAuth2ClientOption) {
        const credentials = this.#getCredentials(option.credentialsPath)

        let token = this.#getToken(option.tokenPath)

        const oAuth2Client = this.#getOAuth2Client(credentials)

        if (!token) {
            token = await this.#getNewToken(oAuth2Client, option.tokenPath)
        }

        oAuth2Client.setCredentials(token)

        return oAuth2Client
    }

    static #getCredentials(credentialsPath = this.#DEFAULT_CREDENTIALS_PATH) {
        const credentialsFullPath = workdir(credentialsPath)

        let credentials: Credentials

        try {
            credentials = JSON.parse(
                fs.readFileSync(credentialsFullPath).toString()
            )
        } catch {
            throw new UserError(
                `${credentialsPath} 파일을 읽는 중 오류가 발생하였습니다. (${credentialsFullPath})`
            )
        }

        if (
            credentials?.installed &&
            credentials.installed?.client_id &&
            credentials.installed?.client_secret &&
            credentials.installed?.redirect_uris?.[0]
        ) {
            return credentials
        }

        throw new UserError(
            `credentials 파일의 형식이 잘못되었습니다. 생성 방법 : https://developers.google.com/workspace/guides/create-credentials#desktop-app`
        )
    }

    static #getToken(tokenPath = this.#DEFAULT_TOKEN_PATH) {
        const tokenFullPath = workdir(tokenPath)

        let token: Token

        try {
            token = JSON.parse(fs.readFileSync(tokenFullPath).toString())
        } catch {
            return undefined
        }

        return token
    }

    static #getNewToken(
        oAuth2Client: OAuth2Client,
        tokenPath = this.#DEFAULT_TOKEN_PATH
    ) {
        const tokenFullPath = workdir(tokenPath)

        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        })

        console.log('Authorize this app by visiting this url:', authUrl)

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        })

        return new Promise<Token>((resolve, reject) => {
            rl.question(
                'Enter the code from that page here: ',
                async (code) => {
                    rl.close()

                    const token = await oAuth2Client
                        .getToken(code)
                        .then(({ tokens }) => tokens as Token)
                        .catch((error) => {
                            console.log(
                                'Error while trying to retrieve access token'
                            )

                            reject(error)
                            return null
                        })

                    if (!token) {
                        return
                    }

                    fs.writeFile(
                        tokenFullPath,
                        JSON.stringify(token),
                        (err) => {
                            if (err) {
                                reject(err)
                                return
                            }

                            console.log('Token stored to', tokenPath)
                            resolve(token)
                        }
                    )
                }
            )
        })
    }

    static #getOAuth2Client(credentials: Credentials) {
        const { client_secret, client_id, redirect_uris } =
            credentials.installed

        return new auth.OAuth2(client_id, client_secret, redirect_uris[0])
    }
}
