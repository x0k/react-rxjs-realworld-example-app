import React, { createElement, FunctionComponent } from 'react'

import { FormGroup } from './form-group'
import { Textarea, TextareaProps } from './textarea'

export const TextField: FunctionComponent<TextareaProps> = (props) => (
  <FormGroup>{createElement(Textarea, props)}</FormGroup>
)
