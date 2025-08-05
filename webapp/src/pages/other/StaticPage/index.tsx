import DOMPurify from 'dompurify'
import parse from 'html-react-parser'
import { marked } from 'marked'
import React from 'react'
import { useParams } from 'react-router-dom'

import { Loader } from '../../../components/Loader'
import { Segment } from '../../../components/Segment'
import { trpc } from '../../../lib/trpc'
import { NotFoundPage } from '../NotFoundPage'

import css from './index.module.scss'

export const StaticPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const { data, isLoading, error } = trpc.staticPages.getStaticPage.useQuery({ slug: slug || '' }, { enabled: !!slug })

  const sanitizedContent = data?.content ? DOMPurify.sanitize(marked(data.content) as string) : ''

  if (isLoading) {
    return <Loader type="page" />
  }

  if (error || !data) {
    return <NotFoundPage />
  }

  return (
    <div className={css.wrapper}>
      <Segment title={data.title} className={css.title}>
        <div className={css.content}>{parse(sanitizedContent)}</div>
      </Segment>
    </div>
  )
}
