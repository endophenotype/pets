import cn from 'classnames'
import type { FormikProps } from 'formik'

import css from './index.module.scss'

export const Input = ({
  name,
  label,
  formik,
  maxWidth,
  type = 'text',
}: {
  name: string
  label: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik: FormikProps<any>
  maxWidth?: number | string
  type?: 'text' | 'password'
}) => {
  const error = formik.errors[name] as string | undefined
  const touched = formik.touched[name]
  const invalid = !!touched && !!error
  const disabled = formik.isSubmitting

  return (
    <div className={cn({ [css.field]: true, [css.disabled]: disabled })}>
      <label className={css.label} htmlFor={name}>
        {label}
      </label>
      <input
        className={cn({
          [css.input]: true,
          [css.invalid]: invalid,
        })}
        style={{ maxWidth }}
        type={type}
        id={name}
        disabled={disabled}
        {...formik.getFieldProps(name)}
      />
      {invalid && <div className={css.error}> {error}</div>}
    </div>
  )
}
