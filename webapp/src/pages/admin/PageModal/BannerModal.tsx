import { useEffect } from 'react'
import { z } from 'zod'

import { Button } from '../../../components/Button'
import { Input } from '../../../components/Input'
import { Modal } from '../../../components/Modal'
import { Select } from '../../../components/Select'
import { UploadToCloudinary } from '../../../components/UploadToCloudinary'
import { useForm } from '../../../lib/form'
import { trpc } from '../../../lib/trpc'

import css from './PageModal.module.scss'
type Props = {
  isOpen: boolean
  onClose: () => void
  banner?: import('@pets/backend/src/router').TrpcRouterOutput['banners']['getBanners'][number]
}

const validationSchema = z.object({
  image: z.string().min(1, 'Image is required'),
  text: z.string().min(1, 'Text is required'),
  link: z.string().min(1, 'Link is required'),
  position: z.enum(['LEFT', 'RIGHT']),
})

export const BannerModal = ({ isOpen, onClose, banner }: Props) => {
  const createBannerMutation = trpc.banners.createBanner.useMutation()
  const updateBannerMutation = trpc.banners.updateBanner.useMutation()

  const { formik, buttonProps } = useForm({
    validationSchema,
    initialValues: {
      image: '',
      text: '',
      link: '',
      position: 'LEFT',
    },
    onSubmit: async (values) => {
      if (banner) {
        await updateBannerMutation.mutateAsync({ id: banner.id, ...values })
      } else {
        await createBannerMutation.mutateAsync(values)
      }
      onClose()
    },
  })

  const { setValues, resetForm } = formik
  useEffect(() => {
    if (banner) {
      setValues({
        image: banner.image,
        text: banner.text,
        link: banner.link,
        position: banner.position,
      })
    } else {
      resetForm()
    }
  }, [banner, setValues, resetForm])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={banner ? 'Edit Banner' : 'Create Banner'}>
      <form onSubmit={formik.handleSubmit}>
        <Input className={css.modalInput} label="Text" name="text" formik={formik} />
        <Input className={css.modalInput} label="Link" name="link" formik={formik} />
        <UploadToCloudinary label="Image" name="image" formik={formik} type="image" preset="banners" />
        <Select
          label="Position"
          id="position"
          {...formik.getFieldProps('position')}
          error={formik.touched.position ? formik.errors.position : undefined}
        >
          <option value="LEFT">Left</option>
          <option value="RIGHT">Right</option>
        </Select>
        <Button type="submit" {...buttonProps}>
          Save
        </Button>
      </form>
    </Modal>
  )
}
