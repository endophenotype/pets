import type { TrpcRouterOutput } from '@pets/backend/src/router'
import { zGetPetsTrpcInput } from '@pets/backend/src/router/pets/getPets/input'
import { useMemo } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { Link } from 'react-router-dom'
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

export const PendingPetsPage = withPageWrapper({
  title: 'Pending Pets',
  isTitleExact: true,
})(() => {
  const utils = trpc.useContext()
  const { formik } = useForm({
    initialValues: { search: '' },
    validationSchema: zGetPetsTrpcInput.pick({ search: true }),
  })
  const [debouncedValue] = useDebounceValue(formik.values.search, 500)
  const getPetsInput = useMemo(() => ({ search: debouncedValue, status: 'pending' as const }), [debouncedValue])

  type GetPetsOutput = TrpcRouterOutput['getPets']

  const getPetsOptions = useMemo(
    () => ({
      getNextPageParam: (lastPage: GetPetsOutput) => {
        return lastPage.nextCursor
      },
    }),
    []
  )
  const { data, error, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage, isRefetching } =
    trpc.getPets.useInfiniteQuery(getPetsInput, getPetsOptions)
  const pets = useMemo(() => data?.pages.flatMap((page) => page.pets) ?? [], [data])

  const approvePetMutation = trpc.approvePet.useMutation({
    onSuccess: () => {
      void utils.getPets.invalidate()
    },
  })

  return (
    <Segment title="Pending Pets">
      <div className={css.filter}>
        <Input maxWidth={'100%'} label="Search" name="search" formik={formik} />
      </div>
      <AdminMenu />
      {isLoading || isRefetching ? (
        <Loader type="section" />
      ) : isError ? (
        <Alert color="red">{error.message}</Alert>
      ) : !pets.length ? (
        <Alert color="brown">No pets waiting for approval</Alert>
      ) : (
        <div className={css.pets}>
          <InfiniteScroll
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
            {pets.map((pet) => {
              return (
                <div className={css.pet} key={pet.nick}>
                  <Segment
                    size={2}
                    title={
                      <Link className={css.petLink} to={getViewPetRoute({ nick: pet.nick })}>
                        {pet.name}
                      </Link>
                    }
                  >
                    <Button
                      onClick={() => approvePetMutation.mutate({ petId: pet.id })}
                      loading={approvePetMutation.isLoading}
                    >
                      Approve
                    </Button>
                  </Segment>
                </div>
              )
            })}
          </InfiniteScroll>
        </div>
      )}
    </Segment>
  )
})
