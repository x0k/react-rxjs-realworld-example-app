import React, { FunctionComponent } from 'react'

import { ButtonProps } from '../button'

import './pagination-item.css'

export type PaginationItemProps = ButtonProps & {
  active: boolean
}

export const PaginationItem: FunctionComponent<PaginationItemProps> = ({
  active,
  onClick,
  children,
}) => (
  <button
    className="pagination-item"
    data-active={active}
    type="button"
    onClick={onClick}
  >
    <span className="page-link">{children}</span>
  </button>
)
