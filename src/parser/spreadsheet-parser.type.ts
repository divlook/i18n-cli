import { CommandOption } from '@/global.type'
import { GetOAuth2ClientOption } from '@/utils/google-auth.type'

export interface SpreadsheetParserOption extends GetOAuth2ClientOption {
    sheetId: NonNullable<CommandOption['spreadsheetId']>
}
