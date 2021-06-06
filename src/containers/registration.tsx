import React from 'react'

import { createFormSubmitHandler, createFieldChangeHandlers } from 'lib/event'
import { createStopSignalHooks } from 'lib/rx-store'
import { useRxState } from 'lib/rx-store-react'

import { Button, ButtonSize, ButtonVariant } from 'components/button'
import { Form } from 'components/form'
import { InputField } from 'components/input-field'
import { ErrorsList } from 'components/errors-list'

import { registration } from 'app-store'

const [onUsernameChange, onEmailChange, onPasswordChange] =
  createFieldChangeHandlers(
    registration.changeField,
    'username',
    'email',
    'password'
  )

const submitHandler = createFormSubmitHandler(registration.signUp)

const hooks = createStopSignalHooks(registration.stop)

export function RegistrationContainer() {
  const { email, errors, loading, password, username } = useRxState(
    registration.state$,
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
