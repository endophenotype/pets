import type { TrpcRouterOutput } from '@pets/backend/src/router'
import { canApprovePet, canBlockPets, canEditPet } from '@pets/backend/src/utils/can'
import { getAvatarUrl, getCloudinaryUploadUrl } from '@pets/shared/src/cloudinary'
import { format } from 'date-fns/format'
import DOMPurify from 'dompurify'
import { useMemo } from 'react'
import React from 'react'

import { Alert } from '../../../components/Alert'
import { Button, LinkButton } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Modal } from '../../../components/Modal'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { getEditPetRoute, getViewPetRoute } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'

import css from './index.module.scss'

const ApprovePet = ({ pet }: { pet: NonNullable<TrpcRouterOutput['getPet']['pet']> }) => {
  const approvePet = trpc.approvePet.useMutation()
  const trpcUtils = trpc.useContext()
  const { formik, alertProps, buttonProps } = useForm({
    onSubmit: async () => {
      await approvePet.mutateAsync({ petId: pet.id })
      await trpcUtils.getPet.refetch({ nick: pet.nick })
    },
  })
  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <Alert {...alertProps} />
        <Button color="green" {...buttonProps}>
          Approve Pet
        </Button>
      </FormItems>
    </form>
  )
}

const BlockPet = ({ pet }: { pet: NonNullable<TrpcRouterOutput['getPet']['pet']> }) => {
  const blockPet = trpc.blockPet.useMutation()
  const trpcUtils = trpc.useContext()
  const { formik, alertProps, buttonProps } = useForm({
    onSubmit: async () => {
      await blockPet.mutateAsync({ petId: pet.id })
      await trpcUtils.getPet.refetch({ nick: pet.nick })
    },
  })
  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <Alert {...alertProps} />
        <Button color="red" {...buttonProps}>
          Block Pet
        </Button>
      </FormItems>
    </form>
  )
}

const UnblockPet = ({ pet }: { pet: NonNullable<TrpcRouterOutput['getPet']['pet']> }) => {
  const unblockPet = trpc.unblockPet.useMutation()
  const trpcUtils = trpc.useContext()
  const { formik, alertProps, buttonProps } = useForm({
    onSubmit: async () => {
      await unblockPet.mutateAsync({ petId: pet.id })
      await trpcUtils.getPet.refetch({ nick: pet.nick })
    },
  })
  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <Alert {...alertProps} />
        <Button color="green" {...buttonProps}>
          Unblock Pet
        </Button>
      </FormItems>
    </form>
  )
}

export const ViewPetPage = withPageWrapper({
  useQuery: () => {
    const { nick } = getViewPetRoute.useParams()
    return trpc.getPet.useQuery({
      nick,
    })
  },
  setProps: ({ queryResult, checkExists, ctx }) => ({
    pet: checkExists(queryResult.data.pet, 'Pet not found'),
    me: ctx.me,
  }),
  showLoaderOnFetching: false,
  title: ({ pet }) => pet.name,
})(({ pet, me }) => {
  if (pet.blockedAt && !(me?.permissions.includes('BLOCK_PERSONS') || me?.permissions.includes('ALL'))) {
    return <Alert color="red">Pet is blocked by administrator</Alert>
  }

  const sanitizedText = useMemo(() => (pet.text ? DOMPurify.sanitize(pet.text, { ALLOWED_TAGS: [] }) : ''), [pet.text])
  const [modalIndex, setModalIndex] = React.useState<number | null>(null)

  const { data: bannersData } = trpc.banners.getBanners.useQuery()
  const leftBanner = bannersData?.find((banner) => banner.position === 'LEFT')
  const rightBanner = bannersData?.find((banner) => banner.position === 'RIGHT')

  return (
    <>
      <div className={css.bannersContainer}>
        {leftBanner ? (
          <a href={leftBanner.link} target="_blank" rel="noreferrer" className={css.leftBanner}>
            <div className={css.bannerCard}>
              <img src={getCloudinaryUploadUrl(leftBanner.image, 'image', 'large')} alt={leftBanner.text} />
              <p>{leftBanner.text}</p>
            </div>
          </a>
        ) : (
          <div className={css.bannerPlaceholder} />
        )}
        <div className={css.pageContainer}>
          <div className={css.petCard}>
            <div className={css.headerBlock}>
              <div className={css.petName}>{pet.name}</div>
            </div>
            <div className={css.rows}>
              <div className={css.rowContainer}>
                <div className={css.rowPair}>
                  <div className={css.text}>
                    <div className={css.fieldLabel}>Мои данные:</div>
                    {sanitizedText ? sanitizedText.split('\n').map((line, idx) => <div key={idx}>{line}</div>) : null}
                  </div>
                </div>
                {pet.price && (
                  <div className={css.rowPair}>
                    {pet.price && (
                      <div className={css.price}>
                        <div className={css.fieldLabel}>Цена:</div>
                        {pet.price.split('\n').map((line, idx) => (
                          <div key={idx}>{line}</div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className={css.buttonsContainer}>
              {pet.groupLink && (
                <a href={pet.groupLink} target="_blank" rel="noreferrer">
                  <Button color="white">Группа</Button>
                </a>
              )}
              <a href={pet.contactLink} target="_blank" rel="noreferrer">
                <Button color="white">Связаться</Button>
              </a>
            </div>
            {!!pet.images.length && (
              <div className={css.photoBlock}>
                <div className={css.photoGrid}>
                  {pet.images.map((image, idx) => (
                    <img
                      key={image}
                      src={getCloudinaryUploadUrl(image, 'image', 'preview')}
                      alt=""
                      className={css.photoThumb}
                      onClick={() => setModalIndex(idx)}
                    />
                  ))}
                </div>
                <div className={css.createdAt}>Дата создания: {format(pet.createdAt, 'dd-MM-yyyy')}</div>
              </div>
            )}
            {me?.permissions.includes('ALL') && (
              <div className={css.author}>
                <img className={css.avatar} alt="" src={getAvatarUrl(pet.author.avatar, 'small')} />
                <div className={css.name}>
                  Автор:
                  <br />
                  {pet.author.nick}
                  {pet.author.name ? ` (${pet.author.name})` : ''}
                </div>
              </div>
            )}
            {canEditPet(me, pet) && (
              <div className={css.editButton}>
                <LinkButton to={getEditPetRoute({ nick: pet.nick })}>Редактировать</LinkButton>
              </div>
            )}
            {canApprovePet(me) && !pet.approvedAt && !pet.blockedAt && (
              <div className={css.approvePet}>
                <ApprovePet pet={pet} />
              </div>
            )}
            {canBlockPets(me) && (
              <div className={css.blockPet}>{pet.blockedAt ? <UnblockPet pet={pet} /> : <BlockPet pet={pet} />}</div>
            )}
          </div>
        </div>
        {rightBanner ? (
          <a href={rightBanner.link} target="_blank" rel="noreferrer" className={css.rightBanner}>
            <div className={css.bannerCard}>
              <img src={getCloudinaryUploadUrl(rightBanner.image, 'image', 'large')} alt={rightBanner.text} />
              <p>{rightBanner.text}</p>
            </div>
          </a>
        ) : (
          <div className={css.bannerPlaceholder} />
        )}
      </div>
      {modalIndex !== null && (
        <Modal
          isOpen={modalIndex !== null}
          onClose={() => setModalIndex(null)}
          title=""
          hideCloseButton={true}
          transparentBackground={true}
        >
          <img
            src={getCloudinaryUploadUrl(pet.images[modalIndex], 'image', 'large')}
            alt=""
            className={css.modalImage}
          />
          {pet.images.length > 1 && (
            <>
              <button
                className={`${css.modalArrow} ${css.modalArrowLeft}`}
                onClick={() => setModalIndex((modalIndex - 1 + pet.images.length) % pet.images.length)}
                onTouchEnd={(e) => {
                  e.preventDefault()
                  setModalIndex((modalIndex - 1 + pet.images.length) % pet.images.length)
                }}
              >
                ‹
              </button>
              <button
                className={`${css.modalArrow} ${css.modalArrowRight}`}
                onClick={() => setModalIndex((modalIndex + 1) % pet.images.length)}
                onTouchEnd={(e) => {
                  e.preventDefault()
                  setModalIndex((modalIndex + 1) % pet.images.length)
                }}
              >
                ›
              </button>
            </>
          )}
          <button className={css.modalClose} onClick={() => setModalIndex(null)}>
            &times;
          </button>
        </Modal>
      )}
    </>
  )
})
