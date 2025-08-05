import DOMPurify from 'dompurify'
import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { Loader } from '../../../components/Loader'
import { Segment } from '../../../components/Segment'
import { trpc } from '../../../lib/trpc'
import { NotFoundPage } from '../NotFoundPage'

import css from './index.module.scss'

export const StaticPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const { data, isLoading, error } = trpc.staticPages.getStaticPage.useQuery({ slug: slug || '' }, { enabled: !!slug })

  const sanitizedContent = useMemo(() => (data?.content ? DOMPurify.sanitize(data.content) : ''), [data?.content])

  if (isLoading) {
    return <Loader type="page" />
  }

  if (error || !data) {
    return <NotFoundPage />
  }

  return (
    <div className={css.wrapper}>
      <Segment title={data.title} className={css.title}>
        <div className={css.content} dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
      </Segment>
    </div>
  )
}
