import { NavLink } from 'react-router-dom'

import * as routes from '../../lib/routes'
import { trpc } from '../../lib/trpc'

import styles from './index.module.scss'

export const AdminMenu = () => {
  const { data } = trpc.getMe.useQuery()
  const me = data?.me

  const canViewBlock = me?.permissions.includes('BLOCK_PERSONS') || me?.permissions.includes('ALL')
  const canEditStaticPages = me?.permissions.includes('EDIT_STATIC_PAGES') || me?.permissions.includes('ALL')
  const canManageBanners = me?.permissions.includes('MANAGE_BANNERS') || me?.permissions.includes('ALL')

  if (!canViewBlock && !canEditStaticPages && !canManageBanners) {
    return null
  }

  return (
    <div className={styles.menu}>
      {canViewBlock && (
        <>
          <NavLink to={routes.getAllPetsRoute()} className={({ isActive }) => (isActive ? styles.active : '')}>
            Все питомцы
          </NavLink>
          <NavLink to={routes.getApprovedPetsRoute()} className={({ isActive }) => (isActive ? styles.active : '')}>
            Одобренные
          </NavLink>
          <NavLink to={routes.getPendingPetsRoute()} className={({ isActive }) => (isActive ? styles.active : '')}>
            Ожидают одобрения
          </NavLink>
          <NavLink to={routes.getBlockedPetsRoute()} className={({ isActive }) => (isActive ? styles.active : '')}>
            Заблокированные
          </NavLink>
          <NavLink to={routes.getReorderPetsRoute()} className={({ isActive }) => (isActive ? styles.active : '')}>
            Изменить порядок питомцев
          </NavLink>
        </>
      )}
      {canEditStaticPages && (
        <NavLink to="/admin/static-pages" className={({ isActive }) => (isActive ? styles.active : '')}>
          Редактирование страниц
        </NavLink>
      )}
      {canManageBanners && (
        <NavLink to={routes.getAdminBannersRoute()} className={({ isActive }) => (isActive ? styles.active : '')}>
          Рекламные баннеры
        </NavLink>
      )}
    </div>
  )
}
