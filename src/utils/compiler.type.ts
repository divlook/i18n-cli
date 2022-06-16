import { CommandOption } from '@/global.type'

export type CompilerOption = Pick<
    CommandOption,
    | 'excludeColumns' //
    | 'excludeKeys'
    | 'includeSheets'
    | 'keyFormat'
>
