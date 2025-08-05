import { createElement } from 'react'
import { type IconBaseProps } from 'react-icons'
import { AiFillCloseCircle } from 'react-icons/ai'

const icons = {
  delete: AiFillCloseCircle,
}

export const Icon = ({ name, ...restProps }: { name: keyof typeof icons } & IconBaseProps) => {
  return createElement(icons[name], restProps)
}
