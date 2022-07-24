import { CommandOption } from '@/global.type'

export type FileMakerOption = Pick<
    CommandOption,
    | 'output' //
    | 'outputFormat'
    | 'clean'
    | 'saveEachSheet'
>
