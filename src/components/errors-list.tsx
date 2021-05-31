import React, { FunctionComponent } from 'react'

import { Errors } from 'models/errors'

export interface ErrorsListProps {
  errors: Errors
}

export const ErrorsList: FunctionComponent<ErrorsListProps> = ({ errors }) => {
  return (
    <ul className="error-messages">
      {Object.keys(errors).map((key) => (
        <li key={key}>
          {key} {errors[key].join(', ')}
        </li>
      ))}
    </ul>
  )
}
