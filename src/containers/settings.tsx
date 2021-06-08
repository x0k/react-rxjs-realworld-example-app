import React from 'react'

import { createStopSignalHooks } from 'lib/rx-store'
import { useRxState } from 'lib/rx-store-react'
import { createFieldChangeHandlers, createFormSubmitHandler } from 'lib/event'

import { ErrorsList } from 'components/errors-list'
import { Form } from 'components/form'
import { InputField } from 'components/input-field'
import { TextField } from 'components/text-field'
import { Button, ButtonSize, ButtonVariant } from 'components/button'
import { FormControlSize } from 'components/form-control'

import { settings$, settingsSubjects } from 'app-store'

const [
  onImageChange,
  onUsernameChange,
  onBioChange,
  onEmailChange,
  onPasswordChange,
] = createFieldChangeHandlers(
  settingsSubjects.changeField$,
  'image',
  'username',
  'bio',
  'email',
  'password'
)

const submitHandler = createFormSubmitHandler(settingsSubjects.update$)

const hooks = createStopSignalHooks(settingsSubjects.stop$)

export function SettingsContainer() {
  const { errors, loading, bio, email, image, password, username } = useRxState(
    settings$,
    hooks
  )
  return (
    <>
      {Object.keys(errors).length > 0 && <ErrorsList errors={errors} />}
      <Form onSubmit={submitHandler}>
        <InputField
          name="image"
          placeholder="URL of profile picture"
          value={image}
          disabled={loading}
          onChange={onImageChange}
        />
        <InputField
          className="form-control-lg"
          name="username"
          placeholder="Username"
          value={username}
          disabled={loading}
          onChange={onUsernameChange}
        />
        <TextField
          size={FormControlSize.Large}
          name="bio"
          placeholder="Short bio about you"
          rows={8}
          value={bio}
          disabled={loading}
          onChange={onBioChange}
        />
        <InputField
          className="form-control-lg"
          name="email"
          placeholder="Email"
          type="email"
          value={email}
          disabled={loading}
          onChange={onEmailChange}
        />
        <InputField
          autoComplete="current-password"
          className="form-control-lg"
          name="password"
          placeholder="New Password"
          type="password"
          value={password}
          disabled={loading}
          onChange={onPasswordChange}
        />
        <Button
          size={ButtonSize.Large}
          variant={ButtonVariant.Primary}
          className="pull-xs-right"
          disabled={loading}
          type="submit"
        >
          Update Settings
        </Button>
      </Form>
    </>
  )
}
