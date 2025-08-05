import cn from 'classnames'
import { type ComponentPropsWithoutRef, type PropsWithChildren } from 'react'

import css from './index.module.scss'

type Props = PropsWithChildren<
  ComponentPropsWithoutRef<'select'> & {
    label: string
    error?: string
  }
>

export const Select = ({ label, error, children, ...props }: Props) => {
  const invalid = !!error

  return (
    <div className={cn({ [css.field]: true, [css.invalid]: invalid })}>
      <label className={css.label}>{label}</label>
      <select className={css.select} {...props}>
        {children}
      </select>
      {invalid && <div className={css.error}>{error}</div>}
    </div>
  )
}
