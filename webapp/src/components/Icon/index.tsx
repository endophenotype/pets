import { createElement } from 'react'
import { type IconBaseProps } from 'react-icons'
import { SlClose, SlArrowLeft, SlArrowRight, SlArrowDown } from 'react-icons/sl'

const icons = {
  delete: SlClose,
  arrowLeft: SlArrowLeft,
  arrowRight: SlArrowRight,
  arrowDown: SlArrowDown,
}

export const Icon = ({ name, ...restProps }: { name: keyof typeof icons } & IconBaseProps) => {
  return createElement(icons[name], restProps)
}
