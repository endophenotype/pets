import { useEffect } from 'react'
import 'easymde/dist/easymde.min.css'
import Modal from 'react-modal'
import SimpleMDE from 'react-simplemde-editor'
import { z } from 'zod'

import { Button } from '../../../components/Button'
import { Input } from '../../../components/Input'
import { useForm } from '../../../lib/form'
import { trpc } from '../../../lib/trpc'

import css from './StaticPageModal.module.scss'

type Props = {
  isOpen: boolean
  onClose: () => void
  staticPage?: {
    id: string
    title: string
    slug: string
    content: string
  }
}

const staticPageSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().min(1, 'Content is required'),
})

export const StaticPageModal = ({ isOpen, onClose, staticPage }: Props) => {
  const createMutation = trpc.staticPages.createStaticPage.useMutation({
    onSuccess: () => onClose(),
  })
  const updateMutation = trpc.staticPages.updateStaticPage.useMutation({
    onSuccess: () => onClose(),
  })

  const { formik } = useForm({
    initialValues: {
      title: staticPage?.title || '',
      slug: staticPage?.slug || '',
      content: staticPage?.content || '',
    },
    validationSchema: staticPageSchema,
    onSubmit: (values) => {
      if (staticPage) {
        updateMutation.mutate({ id: staticPage.id, ...values })
      } else {
        createMutation.mutate(values)
      }
    },
  })

  useEffect(() => {
    if (staticPage) {
      formik.setValues({
        title: staticPage.title,
        slug: staticPage.slug,
        content: staticPage.content,
      })
    } else {
      formik.resetForm()
    }
  }, [isOpen, staticPage])

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Static Page Modal">
      <h2>{staticPage ? 'Edit Static Page' : 'Create New Static Page'}</h2>
      <form onSubmit={formik.handleSubmit}>
        <Input label="Title" name="title" formik={formik} />
        <Input label="Slug" name="slug" formik={formik} />
        <SimpleMDE value={formik.values.content} onChange={(value) => formik.setFieldValue('content', value)} />
        <Button type="submit" disabled={formik.isSubmitting}>
          {staticPage ? 'Update' : 'Create'}
        </Button>
        <Button type="button" onClick={onClose} className={css.cancelButton}>
          Cancel
        </Button>
      </form>
    </Modal>
  )
}
