import { zGetPetsTrpcInput } from '@pets/backend/src/router/pets/getPets/input'
import { getCloudinaryUploadUrl } from '@pets/shared/src/cloudinary'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { useEffect, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { useDebounceValue } from 'usehooks-ts'

import { AdminMenu } from '../../../components/AdminMenu'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { Input } from '../../../components/Input'
import { layoutContentElRef } from '../../../components/Layout'
import { Loader } from '../../../components/Loader'
import { Segment } from '../../../components/Segment'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { getViewPetRoute } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'

import css from './index.module.scss'

export const AllPetsPage = withPageWrapper({
  title: 'Pets',
  isTitleExact: true,
})(() => {
  const { formik } = useForm({
    initialValues: { search: '' },
    validationSchema: zGetPetsTrpcInput.pick({ search: true }),
  })
  const [debouncedValue] = useDebounceValue(formik.values.search, 500)
  const getPetsInput = useMemo(
    () => ({
      search: debouncedValue,
      sort: { serialNumber: 'asc' as const },
    }),
    [debouncedValue]
  )
  const getPetsOptions = useMemo(
    () => ({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getNextPageParam: (lastPage: any) => {
        return lastPage.nextCursor
      },
      staleTime: 0, // Устанавливаем staleTime в 0 для принудительного обновления
    }),
    []
  )
  const { data, error, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage, isRefetching } =
    trpc.getPets.useInfiniteQuery(getPetsInput, getPetsOptions)

  const pets = useMemo(() => {
    const flattenedPets = data?.pages.flatMap((page) => page.pets) ?? []
    return flattenedPets
  }, [data])

  return (
    <Segment title="Все питомцы" className={css.title}>
      <div className={css.filter}>
        <Input maxWidth={'100%'} label="Search" name="search" formik={formik} />
      </div>
      <AdminMenu />
      {isLoading || isRefetching ? (
        <Loader type="section" />
      ) : isError ? (
        <Alert color="red">{error.message}</Alert>
      ) : !pets.length ? (
        <Alert color="brown">Nothing found by search</Alert>
      ) : (
        <div className={css.pets}>
          <InfiniteScroll
            className={css.petsGrid}
            threshold={250}
            loadMore={() => {
              if (!isFetchingNextPage && hasNextPage) {
                void fetchNextPage()
              }
            }}
            hasMore={hasNextPage}
            loader={
              <div className={css.more} key="loader">
                <Loader type="section" />
              </div>
            }
            getScrollParent={() => layoutContentElRef.current}
            useWindow={(layoutContentElRef.current && getComputedStyle(layoutContentElRef.current).overflow) !== 'auto'}
          >
            {pets.map((pet) => (
              <PetCard pet={pet} key={pet.id} />
            ))}
          </InfiniteScroll>
        </div>
      )}
    </Segment>
  )
})

type PetCardProps = {
  pet: {
    nick: string
    name: string
    images: string[]
  }
}

const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  const { images, name, nick } = pet
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (images && images.length > 1) {
      const timer = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [images])

  const handlePrevClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!images) {
      return
    }
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const handleNextClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!images) {
      return
    }
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  return (
    <div className={css.pet}>
      {images && images.length > 0 ? (
        <img
          src={getCloudinaryUploadUrl(images[currentImageIndex], 'image', 'large')}
          alt={name}
          className={css.petImage}
        />
      ) : (
        <div className={css.petImagePlaceholder} />
      )}

      {images && images.length > 1 && (
        <div className={css.sliderControls}>
          <div className={css.leftControl} onClick={handlePrevClick}>
            <span className={css.arrow}>{'<'}</span>
          </div>
          <div className={css.rightControl} onClick={handleNextClick}>
            <span className={css.arrow}>{'>'}</span>
          </div>
        </div>
      )}

      <div className={css.petOverlay}>
        <div className={css.petName}>{name}</div>
        <Button
          className={css.petLink}
          onClick={() => {
            window.location.href = getViewPetRoute({ nick })
          }}
        >
          Подробнее
        </Button>
        <div className={css.sliderDots}>
          {images &&
            images.length > 1 &&
            Array.from({ length: Math.min(images.length, 4) }).map((_, index) => {
              const isActive =
                images.length <= 4
                  ? index === currentImageIndex
                  : index === Math.round(((Math.min(images.length, 4) - 1) * currentImageIndex) / (images.length - 1))

              return <span key={index} className={classnames(css.dot, { [css.activeDot]: isActive })} />
            })}
        </div>
      </div>
    </div>
  )
}

PetCard.propTypes = {
  pet: PropTypes.shape({
    nick: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
}
