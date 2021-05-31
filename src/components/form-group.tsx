import React, { FunctionComponent } from 'react'

export const FormGroup: FunctionComponent = ({ children }) => (
  <fieldset className="form-group">{children}</fieldset>
)
