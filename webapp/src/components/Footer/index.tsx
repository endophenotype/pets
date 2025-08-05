import { Link } from 'react-router-dom'

import { getStaticPageRoute } from '../../lib/routes'

import css from './index.module.scss'

export const Footer = () => {
  return (
    <div className={css.footer}>
      <div className={css.footerColumns}>
        <ul className={css.footerMenu}>
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
        </ul>
        <ul className={css.footerMenu}>
          <li className={css.menuItem}>
            <Link className={css.menuLink} to={getStaticPageRoute({ slug: 'rules' })}>
              Правила объявлений
            </Link>
          </li>
          <li className={css.menuItem}>
            <Link className={css.menuLink} to={getStaticPageRoute({ slug: 'moderation' })}>
              Модерация
            </Link>
          </li>
        </ul>
      </div>
      <div className={css.footerText}>
        Жалобы, предложения, вопросы сотрудничества вы можете направлять на почту
        <br />
        support@mail.org или в телеграм -{' '}
        <a className={css.footerLink} href="https://t.me/pppurppp">
          @PetsSupport
        </a>
        <br />
        ©2025 Pets.com
      </div>
      <div className={css.footerColumns}>
        <ul className={css.footerMenu}>
          <li className={css.menuItem}>
            <Link className={css.menuLink} to={getStaticPageRoute({ slug: 'privacy-policy' })}>
              Политика конфиденциальности
            </Link>
          </li>
        </ul>
        <ul className={css.footerMenu}>
          <li className={css.menuItem}>
            <Link className={css.menuLink} to={getStaticPageRoute({ slug: 'user-agreement' })}>
              Пользовательское соглашение
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
