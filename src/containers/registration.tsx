import React from 'react'

import { useRxState } from 'lib/store-rx-state'
import { createFormSubmitHandler, createFieldChangeHandlers } from 'lib/event'

import { Button, ButtonSize, ButtonVariant } from 'components/button'
import { Form } from 'components/form'
import { InputField } from 'components/input-field'
import { ErrorsList } from 'components/errors-list'

import {
  registration$,
  registrationChangeField,
  registrationCleanup,
  registrationSignUp,
} from 'store/registration'
import { createStopSignalHooks } from 'lib/store-rx-signals'

const [onUsernameChange, onEmailChange, onPasswordChange] =
  createFieldChangeHandlers(
    registrationChangeField,
    'username',
    'email',
    'password'
  )

const submitHandler = createFormSubmitHandler(registrationSignUp)

const hooks = createStopSignalHooks(registrationCleanup)

export function RegistrationContainer() {
  const { email, errors, loading, password, username } = useRxState(
    registration$,
    hooks
  )
  return (
    <>
      {Object.keys(errors).length > 0 && <ErrorsList errors={errors} />}
      <Form onSubmit={submitHandler}>
        <InputField
          className="form-control-lg"
          name="username"
          placeholder="Username"
          type="text"
          value={username}
          onChange={onUsernameChange}
        />
        <InputField
          className="form-control-lg"
          name="email"
          placeholder="Email"
          type="email"
          value={email}
          onChange={onEmailChange}
        />
        <InputField
          autoComplete="current-password"
          className="form-control-lg"
          name="password"
          placeholder="Password"
          type="password"
          value={password}
          onChange={onPasswordChange}
        />
        <Button
          size={ButtonSize.Large}
          variant={ButtonVariant.Primary}
          className="pull-xs-right"
          disabled={loading}
          type="submit"
        >
          Sign Up
        </Button>
      </Form>
    </>
  )
}
