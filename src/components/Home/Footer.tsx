import React, { ReactElement } from 'react'
import styles from './Footer.module.css'
import Markdown from '@shared/Markdown'
import Image from 'next/image'
import footerImage from '../../@images/filecoin-foundation.png'

export default function Footer({
  content
}: // image
{
  content: string
  // image: string
}): ReactElement {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.text}>
          <Markdown text={content} />
        </div>
        <div className={styles.image}>
          {/* <Image src={image} alt="funded by" /> */}
          <Image src={footerImage} alt="funded by" />
        </div>
      </div>
    </div>
  )
}
