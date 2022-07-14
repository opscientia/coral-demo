import React, { ReactElement, useEffect, useState } from 'react'
import AssetList from '@shared/AssetList'
import Button from '@shared/atoms/Button'
import Bookmarks from './Bookmarks'
import { Asset, LoggerInstance } from '@oceanprotocol/lib'
import { useUserPreferences } from '@context/UserPreferences'
import styles from './index.module.css'
import { useIsMounted } from '@hooks/useIsMounted'
import { useCancelToken } from '@hooks/useCancelToken'
import { SortTermOptions } from '../../@types/aquarius/SearchQuery'
import Markdown from '@shared/Markdown'
import Header from './Header'
import Intro from './Intro'
import Footer from './Footer'
import headerContent from '../../../content/pages/home/header.json'
import headerImage from '../../@images/opsci-dash.png'
import introContent from '../../../content/pages/home/intro.json'
import topicsContent from '../../../content/pages/home/topics.json'
import footerContent from '../../../content/pages/home/footer.json'
import footerImage from '../../@images/filecoin-foundation.png'

interface TTopic {
  title: string
  content: string
}

function sortElements(items: Asset[], sorted: string[]) {
  items.sort(function (a, b) {
    return (
      sorted.indexOf(a.services[0].datatokenAddress.toLowerCase()) -
      sorted.indexOf(b.services[0].datatokenAddress.toLowerCase())
    )
  })
  return items
}

export default function HomePage(): ReactElement {
  return (
    <>
      <Intro {...introContent} />
      {/* <Header {...headerContent} image={headerImage} /> */}
      <Header {...headerContent} />
      <div className={styles.topicsWrapper}>
        <div className={styles.topics}>
          {(topicsContent.topics as TTopic[]).map((topic, i) => (
            <div key={i} className={styles.content}>
              <h1>{topic.title}</h1>
              <Markdown text={topic.content} />
            </div>
          ))}
        </div>
      </div>

      {/* <Footer content={footerContent.content} image={footerImage} /> */}
      <Footer content={footerContent.content} />
    </>
  )
}
