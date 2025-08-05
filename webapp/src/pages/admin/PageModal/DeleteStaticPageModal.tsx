import { Button } from '../../../components/Button'
import { Modal } from '../../../components/Modal'
import { trpc } from '../../../lib/trpc'

import css from './PageModal.module.scss'

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
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Static Page">
      <p className={css.modalText}>
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
