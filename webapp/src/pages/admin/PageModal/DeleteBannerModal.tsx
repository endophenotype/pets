import * as Sentry from '@sentry/browser'

import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { Modal } from '../../../components/Modal'
import { trpc } from '../../../lib/trpc'

type Props = {
  isOpen: boolean
  onClose: () => void
  banner?: {
    id: string
    image: string
    text: string
    link: string
    position: 'LEFT' | 'RIGHT'
  }
}

export const DeleteBannerModal = ({ isOpen, onClose, banner }: Props) => {
  const deleteBannerMutation = trpc.banners.deleteBanner.useMutation()

  const handleDelete = async () => {
    if (!banner) {
      return
    }

    try {
      await deleteBannerMutation.mutateAsync({ id: banner.id })
      onClose()
    } catch (_error) {
      Sentry.captureException(_error)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Banner">
      <Alert color="red">Are you sure you want to delete this banner?</Alert>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="red" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </Modal>
  )
}
