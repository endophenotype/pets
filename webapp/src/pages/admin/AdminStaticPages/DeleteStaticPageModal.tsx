import Modal from 'react-modal'

import { Button } from '../../../components/Button'
import { trpc } from '../../../lib/trpc'

import css from './StaticPageModal.module.scss'

type Props = {
  isOpen: boolean
  onClose: () => void
  staticPage?: {
    id: string
    title: string
  }
}

export const DeleteStaticPageModal = ({ isOpen, onClose, staticPage }: Props) => {
  const deleteMutation = trpc.staticPages.deleteStaticPage.useMutation({
    onSuccess: () => onClose(),
  })

  const handleDelete = () => {
    if (staticPage) {
      deleteMutation.mutate({ id: staticPage.id })
    }
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Delete Static Page Modal">
      <h2>Delete Static Page</h2>
      <p>
        Are you sure you want to delete the page `<strong>{staticPage?.title}</strong>`?
      </p>
      <Button onClick={handleDelete} color="red" disabled={deleteMutation.isLoading}>
        Delete
      </Button>
      <Button onClick={onClose} className={css.cancelButton}>
        Cancel
      </Button>
    </Modal>
  )
}
