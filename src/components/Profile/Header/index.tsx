import React, { ReactElement, useState } from 'react'
import PublisherLinks from './PublisherLinks'
import Markdown from '@shared/Markdown'
import Stats from './Stats'
import Account from './Account'
import styles from './index.module.css'
import { useProfile } from '@context/Profile'

const isDescriptionTextClamped = () => {
  const el = document.getElementById('description')
  if (el) return el.scrollHeight > el.clientHeight
}

const LinkExternal = ({ url, text }: { url: string; text: string }) => {
  return (
    <a href={url} target="_blank" rel="noreferrer">
      {text}
    </a>
  )
}

export default function AccountHeader({
  accountId
}: {
  accountId: string
}): ReactElement {
  const { profile } = useProfile()
  const [isShowMore, setIsShowMore] = useState(false)

  const toogleShowMore = () => {
    setIsShowMore(!isShowMore)
  }

  return (
    <div className={styles.grid}>
      <div>
        <Account accountId={accountId} />
        <Stats accountId={accountId} />
      </div>

      <div>
        <Markdown text={profile?.description} className={styles.description} />
        {profile?.links?.length > 0 && (
          <PublisherLinks className={styles.publisherLinks} />
        )}
      </div>
      <div className={styles.meta}>
        {profile?.accountEns && (
          <>
            Profile data from{' '}
            <LinkExternal
              url={`https://app.ens.domains/name/${profile.accountEns}`}
              text="ENS"
            />{' '}
            &{' '}
          </>
        )}
      </div>
    </div>
  )
}
