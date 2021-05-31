import React, { FunctionComponent, useMemo } from 'react'

import { PaginationItem } from './pagination-item'

export interface PaginationProps {
  current: number
  perPage: number
  count: number
  onClick: (page: number) => void
}

export const Pagination: FunctionComponent<PaginationProps> = ({
  count,
  current,
  onClick,
  perPage,
}) => {
  const pages = useMemo(
    () => Array.from({ length: Math.ceil(count / perPage) }, (_, x) => x + 1),
    [count, perPage]
  )
  return count < perPage ? null : (
    <nav>
      <ul className="pagination">
        {pages.map((page) => (
          <li className="page-item" key={page}>
            <PaginationItem
              active={page === current}
              onClick={() => onClick(page)}
            >
              {page}
            </PaginationItem>
          </li>
        ))}
      </ul>
    </nav>
  )
}
