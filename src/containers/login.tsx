import React from 'react'

import { useRxState } from 'lib/store-rx-state'
import { createFormSubmitHandler, createFieldChangeHandlers } from 'lib/event'
import { createStopSignalHooks } from 'lib/store-rx-signals'

import { Form } from 'components/form'
import { InputField } from 'components/input-field'
import { Button, ButtonSize, ButtonVariant } from 'components/button'
import { ErrorsList } from 'components/errors-list'

import { auth$, authChangeField, authCleanup, authSignIn } from 'store/auth'

const [onEmailChange, onPasswordChange] = createFieldChangeHandlers(
  authChangeField,
  'email',
  'password'
)

const submitHandler = createFormSubmitHandler(authSignIn)

const hooks = createStopSignalHooks(authCleanup)

export function LoginContainer() {
  const { email, errors, loading, password } = useRxState(auth$, hooks)
  return (
    <>
      {Object.keys(errors).length > 0 && <ErrorsList errors={errors} />}
      <Form onSubmit={submitHandler}>
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
          Sign In
        </Button>
      </Form>
    </>
  )
}
