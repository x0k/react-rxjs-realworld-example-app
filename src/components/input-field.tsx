import React, { FunctionComponent } from 'react'

import { FormGroup } from './form-group'
import { Input, InputProps } from './input'

export const InputField: FunctionComponent<InputProps> = (props) => (
  <FormGroup>
    <Input {...props} />
  </FormGroup>
)
