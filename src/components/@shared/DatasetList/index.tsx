import DatasetTeaser from '@shared/DatasetTeaser/DatasetTeaser'
import React, { ReactElement, useEffect, useState } from 'react'
import Pagination from '@shared/Pagination'
import styles from './index.module.css'
import classNames from 'classnames/bind'
import Loader from '@shared/atoms/Loader'
import { useIsMounted } from '@hooks/useIsMounted'
import { Dataset } from 'src/@types/Dataset'
import { useWeb3 } from '@context/Web3'

const cx = classNames.bind(styles)

function LoaderArea() {
  return (
    <div className={styles.loaderWrap}>
      <Loader />
    </div>
  )
}

declare type DatasetListProps = {
  datasets: Dataset[]
  showPagination: boolean
  page?: number
  totalPages?: number
  isLoading?: boolean
  onPageChange?: React.Dispatch<React.SetStateAction<number>>
  className?: string
}

export default function DatasetList({
  datasets,
  showPagination,
  page,
  totalPages,
  isLoading,
  onPageChange,
  className
}: DatasetListProps): ReactElement {
  const { accountId } = useWeb3()
  const [loading, setLoading] = useState<boolean>(isLoading)
  const isMounted = useIsMounted()

  // // This changes the page field inside the query
  function handlePageChange(selected: number) {
    onPageChange(selected + 1)
  }

  const styleClasses = cx({
    assetList: true,
    [className]: className
  })

  return datasets && !loading ? (
    <>
      <div className={styleClasses}>
        {datasets.length > 0 ? (
          datasets.map((dataset) => (
            <DatasetTeaser dataset={dataset} key={dataset._id} />
          ))
        ) : (
          <div className={styles.empty}>No results found</div>
        )}
      </div>

      {showPagination && (
        <Pagination
          totalPages={totalPages}
          currentPage={page}
          onChangePage={handlePageChange}
        />
      )}
    </>
  ) : (
    <LoaderArea />
  )
}
