import type { TrpcRouterOutput } from '@pets/backend/src/router'
import { useState } from 'react'

import { AdminMenu } from '../../../components/AdminMenu'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { Loader } from '../../../components/Loader'
import { Segment } from '../../../components/Segment'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { trpc } from '../../../lib/trpc'
import commonCss from '../../../styles/adminTable.module.scss'
import { BannerModal } from '../PageModal/BannerModal'
import { DeleteBannerModal } from '../PageModal/DeleteBannerModal'

import css from './index.module.scss'

export const AdminBannersPage = withPageWrapper({
  title: 'Banners',
  isTitleExact: true,
})(() => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedBanner, setSelectedBanner] = useState<TrpcRouterOutput['banners']['getBanners'][number] | undefined>(
    undefined
  )
  const { data: banners, isLoading, error, refetch } = trpc.banners.getBanners.useQuery()

  if (isLoading) {
    return <Loader type="page" />
  }

  if (error) {
    return <Alert color="red">{error.message}</Alert>
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedBanner(undefined)
    void refetch()
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setSelectedBanner(undefined)
    void refetch()
  }

  return (
    <>
      <Segment title="Banners">
        <AdminMenu />
        <div className={css.buttonContainer}>
          <Button onClick={() => setIsEditModalOpen(true)}>Create Banner</Button>
        </div>
        <div className={commonCss.tableWrapper}>
          <table className={commonCss.table}>
            <thead>
              <tr>
                <th>Text</th>
                <th>Link</th>
                <th>Position</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners?.map((banner) => (
                <tr key={banner.id}>
                  <td>{banner.text}</td>
                  <td>{banner.link}</td>
                  <td>{banner.position}</td>
                  <td className={commonCss.actions}>
                    <Button
                      onClick={() => {
                        setSelectedBanner(banner)
                        setIsEditModalOpen(true)
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      color="red"
                      onClick={() => {
                        setSelectedBanner(banner)
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
        <BannerModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} banner={selectedBanner} />
        <DeleteBannerModal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal} banner={selectedBanner} />
      </Segment>
    </>
  )
})
