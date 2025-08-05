import cn from 'classnames'
import { type ComponentPropsWithoutRef, type PropsWithChildren } from 'react'

import { Icon } from '../Icon'

import css from './index.module.scss'

type Props = PropsWithChildren<
  ComponentPropsWithoutRef<'select'> & {
    label: string
    error?: string
    id?: string
  }
>

export const Select = ({ id, label, error, children, ...props }: Props) => {
  const invalid = !!error

  return (
    <div className={cn({ [css.field]: true, [css.invalid]: invalid })}>
      <label htmlFor={id} className={css.label}>
        {label}
      </label>
      <div className={css.selectWrapper}>
        <select id={id} className={css.select} {...props}>
          {children}
        </select>
        <Icon className={css.arrow} name="arrowDown" />
      </div>
      {invalid && <div className={css.error}>{error}</div>}
    </div>
  )
}
