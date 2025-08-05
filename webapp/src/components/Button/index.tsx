import cn from 'classnames'
import { Link } from 'react-router-dom'

import css from './index.module.scss'

type ButtonColor = 'red' | 'green' | 'white'
export type ButtonProps = {
  children: React.ReactNode
  loading?: boolean
  color?: ButtonColor
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
  className?: string
}
export const Button = ({
  children,
  loading = false,
  color = 'green',
  type = 'submit',
  disabled,
  onClick,
  className,
}: ButtonProps) => {
  return (
    <button
      className={cn(className, {
        [css.button]: true,
        [css[`color-${color}`]]: true,
        [css.disabled]: disabled || loading,
        [css.loading]: loading,
      })}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
    >
      <span className={css.text}>{children}</span>
    </button>
  )
}
export const LinkButton = ({
  children,
  to,
  color = 'green',
}: {
  children: React.ReactNode
  to: string
  color?: ButtonColor
}) => {
  return (
    <Link className={cn({ [css.button]: true, [css[`color-${color}`]]: true })} to={to}>
      {children}
    </Link>
  )
}
export const Buttons = ({ children }: { children: React.ReactNode }) => {
  return <div className={css.buttons}>{children}</div>
}
