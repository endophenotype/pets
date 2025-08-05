import { z } from 'zod'

export const zEnvNonemptyTrimmed = z.string().trim().min(1)
export const zEnvNonemptyTrimmedRequiredOnNotLocal = zEnvNonemptyTrimmed
  .optional()
  // eslint-disable-next-line n/no-process-env
  .refine((val) => `${process.env.HOST_ENV}` === 'local' || !!val, 'Required on not local host')
export const zEnvHost = z.enum(['local', 'production'])

export const zStringRequired = z.string({ required_error: 'Please, fill it' }).min(1, 'Пожалуйста, заполните это поле')
export const zStringOptional = z.string().optional()
export const zEmailRequired = zStringRequired.email()
export const zNickRequired = zStringRequired.regex(
  /^[a-z0-9-]+$/,
  'Nickname может содержать только строчные буквы, цифры и тире'
)
export const zStringMin = (min: number) => zStringRequired.min(min, `Text should be at least ${min} characters long`)
export const zPasswordsMustBeTheSame =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (passwordFieldName: string, passwordAgainFieldName: string) => (val: any, ctx: z.RefinementCtx) => {
    if (val[passwordFieldName] !== val[passwordAgainFieldName]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Пароли не совпадают',
        path: [passwordAgainFieldName],
      })
    }
  }
