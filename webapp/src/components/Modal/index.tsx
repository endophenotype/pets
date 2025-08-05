import { type PropsWithChildren } from 'react'
import ReactModal from 'react-modal'

import css from './index.module.scss'

type Props = PropsWithChildren<{
  isOpen: boolean
  onClose: () => void
  title: string
  style?: ReactModal.Styles
  hideCloseButton?: boolean
  transparentBackground?: boolean
}>

export const Modal = ({ isOpen, onClose, title, children, style, hideCloseButton, transparentBackground }: Props) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={`${css.modal} ${transparentBackground ? css.transparent : ''}`}
      overlayClassName={css.overlay}
      ariaHideApp={false}
      style={style}
    >
      {!hideCloseButton && (
        <div className={css.header}>
          <div className={css.title}>{title}</div>
          <button className={css.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
      )}
      <div className={css.content}>{children}</div>
    </ReactModal>
  )
}
