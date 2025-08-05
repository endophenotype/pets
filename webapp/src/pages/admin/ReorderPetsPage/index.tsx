import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { AdminMenu } from '../../../components/AdminMenu'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { Loader } from '../../../components/Loader'
import { Segment } from '../../../components/Segment'
import { trpc } from '../../../lib/trpc'
import commonCss from '../../../styles/adminTable.module.scss'

import css from './index.module.scss'

type Pet = {
  id: string
  nick: string
  name: string
  serialNumber: number
}

export const ReorderPetsPage = () => {
  // Получаем всех Pet (без пагинации)
  const queryClient = useQueryClient()
  const { data, isLoading, isError, error } = trpc.getPets.useQuery({ limit: 1000 }, { refetchOnWindowFocus: false })
  const [pets, setPets] = useState<Pet[]>([])

  useEffect(() => {
    if (data?.pets) {
      // Сортируем по serialNumber (asc), чтобы порядок всегда был актуален
      setPets([...data.pets].sort((a, b) => a.serialNumber - b.serialNumber))
    }
  }, [data])

  const reorderPetsMutation = trpc.reorderPets.useMutation()

  const movePet = (index: number, direction: 'up' | 'down') => {
    if (!pets) {
      return
    }
    const newPets = [...pets]
    if (direction === 'up' && index > 0) {
      ;[newPets[index - 1], newPets[index]] = [newPets[index], newPets[index - 1]]
    }
    if (direction === 'down' && index < newPets.length - 1) {
      ;[newPets[index], newPets[index + 1]] = [newPets[index + 1], newPets[index]]
    }
    // Пересчитываем serialNumber
    setPets(
      newPets.map((p, idx) => ({
        ...p,
        serialNumber: idx + 1,
      }))
    )
  }

  const handleSave = async () => {
    try {
      await reorderPetsMutation.mutateAsync(pets.map(({ id, serialNumber }) => ({ id, serialNumber })))
      await queryClient.invalidateQueries({ queryKey: ['getPets'], refetchType: 'all' })
    } catch {
      // Ошибка будет показана ниже
    }
  }

  return (
    <Segment title="Изменение порядка питомцев" className={css.segment}>
      <AdminMenu />
      {isLoading ? (
        <Loader type="section" />
      ) : isError ? (
        <Alert color="red">{error.message}</Alert>
      ) : (
        <>
          <div className={commonCss.tableWrapper}>
            <table className={commonCss.table}>
              <thead>
                <tr>
                  <th>Nickname</th>
                  <th>Имя</th>
                  <th>Порядок</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {pets.map((pet, idx) => (
                  <tr key={pet.id}>
                    <td>{pet.nick}</td>
                    <td>{pet.name}</td>
                    <td>{pet.serialNumber}</td>
                    <td>
                      <Button disabled={idx === 0} onClick={() => movePet(idx, 'up')} className={css.arrowBtn}>
                        ↑
                      </Button>
                      <Button
                        disabled={idx === pets.length - 1}
                        onClick={() => movePet(idx, 'down')}
                        className={css.arrowBtn}
                      >
                        ↓
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button
            onClick={handleSave}
            loading={reorderPetsMutation.isLoading}
            disabled={reorderPetsMutation.isLoading}
            className={css.saveBtn}
          >
            Сохранить порядок
          </Button>
          {reorderPetsMutation.isError && <Alert color="red">{reorderPetsMutation.error.message}</Alert>}
          {reorderPetsMutation.isSuccess && <Alert color="green">Порядок успешно сохранён</Alert>}
        </>
      )}
    </Segment>
  )
}

export default ReorderPetsPage
