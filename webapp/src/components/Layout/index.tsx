import { createRef } from 'react'
import { Link, Outlet } from 'react-router-dom'

import Logo from '../../assets/images/logo.svg?react'
import { useMe } from '../../lib/ctx'
import {
  getAllPetsRoute,
  getEditProfileRoute,
  getNewPetRoute,
  getSignInRoute,
  getSignOutRoute,
  getSignUpRoute,
  getStaticPageRoute,
} from '../../lib/routes'
import { Footer } from '../Footer'

import css from './index.module.scss'
export const layoutContentElRef = createRef<HTMLDivElement>()

export const Layout = () => {
  const me = useMe()

  return (
    <div className={css.layout}>
      <div className={css.navigation}>
        <Logo className={css.logo} />
        <ul className={css.menu}>
          <li className={css.menuItem}>
            <Link className={css.menuLink} to={getAllPetsRoute()}>
              Все питомцы
            </Link>
          </li>
          <li className={css.menuItem}>
            <Link className={css.menuLink} to={getStaticPageRoute({ slug: 'faq' })}>
              FAQ
            </Link>
          </li>
          <li className={css.menuItem}>
            <Link className={css.menuLink} to={getStaticPageRoute({ slug: 'contacts' })}>
              Контакты
            </Link>
          </li>
          <li className={css.menuItem}>
            <Link className={css.menuLink} to={getStaticPageRoute({ slug: 'about-us' })}>
              О нас
            </Link>
          </li>
          {me && (
            <li className={css.menuItem}>
              <Link className={css.menuLink} to={getNewPetRoute()}>
                Добавить питомца
              </Link>
            </li>
          )}
        </ul>
        <ul className={css.rightMenu}>
          {me ? (
            <>
              <li className={css.menuItem}>
                <Link className={css.menuLink} to={getEditProfileRoute()}>
                  Редактировать профиль
                </Link>
              </li>
              <li className={css.menuItem}>
                <Link className={css.menuLink} to={getSignOutRoute()}>
                  Выйти
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className={css.menuItem}>
                <Link className={css.menuLink} to={getSignInRoute()}>
                  Войти
                </Link>
              </li>
              <li className={css.menuItem}>
                <Link className={css.menuLink} to={getSignUpRoute()}>
                  Зарегистрироваться
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className={css.content} ref={layoutContentElRef}>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
