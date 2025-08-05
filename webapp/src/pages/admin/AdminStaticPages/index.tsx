import { useState } from 'react'

import { AdminMenu } from '../../../components/AdminMenu'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { Loader } from '../../../components/Loader'
import { Segment } from '../../../components/Segment'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { trpc } from '../../../lib/trpc'
import commonCss from '../../../styles/adminTable.module.scss'

import { DeleteStaticPageModal } from './DeleteStaticPageModal'
import { StaticPageModal } from './StaticPageModal'
import css from './index.module.scss'

export const AdminStaticPages = withPageWrapper({
  title: 'Static Pages',
  isTitleExact: true,
})(() => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedPage, setSelectedPage] = useState<
    | {
        id: string
        title: string
        slug: string
        content: string
      }
    | undefined
  >(undefined)
  const { data: staticPages, isLoading, error, refetch } = trpc.staticPages.getStaticPages.useQuery()

  if (isLoading) {
    return <Loader type="page" />
  }

  if (error) {
    return <Alert color="red">{error.message}</Alert>
  }

  const handleCloseEditModal = async () => {
    setIsEditModalOpen(false)
    setSelectedPage(undefined)
    await refetch()
  }

  const handleCloseDeleteModal = async () => {
    setIsDeleteModalOpen(false)
    setSelectedPage(undefined)
    await refetch()
  }

  return (
    <>
      <Segment title="Static Pages">
        <AdminMenu />
        <div className={css.buttonContainer}>
          <Button onClick={() => setIsEditModalOpen(true)}>Create Page</Button>
        </div>
        <div className={commonCss.tableWrapper}>
          <table className={commonCss.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staticPages?.map((page) => (
                <tr key={page.id}>
                  <td>{page.title}</td>
                  <td>{page.slug}</td>
                  <td className={commonCss.actions}>
                    <Button
                      onClick={() => {
                        setSelectedPage(page)
                        setIsEditModalOpen(true)
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      color="red"
                      onClick={() => {
                        setSelectedPage(page)
                        setIsDeleteModalOpen(true)
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <StaticPageModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} staticPage={selectedPage} />
        <DeleteStaticPageModal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal} staticPage={selectedPage} />
      </Segment>
    </>
  )
})
