import React from 'react'

import { createFormSubmitHandler, createFieldChangeHandlers } from 'lib/event'
import { createStopSignalHooks } from 'lib/rx-store'
import { useRxState } from 'lib/rx-store-react'

import { Form } from 'components/form'
import { InputField } from 'components/input-field'
import { Button, ButtonSize, ButtonVariant } from 'components/button'
import { ErrorsList } from 'components/errors-list'

import { auth } from 'store'

const [onEmailChange, onPasswordChange] = createFieldChangeHandlers(
  auth.changeField,
  'email',
  'password'
)

const submitHandler = createFormSubmitHandler(auth.signIn)

const hooks = createStopSignalHooks(auth.stop)

export function LoginContainer() {
  const { email, errors, loading, password } = useRxState(auth.state$, hooks)
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
