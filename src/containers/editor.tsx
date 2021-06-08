import React, { KeyboardEvent } from 'react'

import { createFieldChangeHandlers, createFormSubmitHandler } from 'lib/event'
import { useRxState, useSignalsHooks } from 'lib/rx-store-react'
import { ArticleSlug } from 'lib/models'

import { ErrorsList } from 'components/errors-list'
import { Form } from 'components/form'
import { InputField } from 'components/input-field'
import { TextField } from 'components/text-field'
import { Input } from 'components/input'
import { TagsList } from 'components/tags-list'
import { Tag } from 'components/tag'
import { Button, ButtonSize, ButtonVariant } from 'components/button'
import { FormGroup } from 'components/form-group'

import { editor$, editorSubjects } from 'app-store'

const [onTitleChange, onDescriptionChange, onBodyChange, onTagChange] =
  createFieldChangeHandlers(
    editorSubjects.changeField$,
    'title',
    'description',
    'body',
    'tag'
  )

const onTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    editorSubjects.addTag$.next()
  }
}

const submitHandler = createFormSubmitHandler(editorSubjects.publish$)

export interface EditorContainerProps {
  slug?: ArticleSlug
}

export function EditorContainer({ slug }: EditorContainerProps) {
  const hooks = useSignalsHooks(
    editorSubjects.loadArticle$,
    editorSubjects.stop$,
    slug
  )
  const {
    errors,
    loading,
    tag,
    body,
    description,
    title,
    tagList = [],
  } = useRxState(editor$, hooks)
  return (
    <>
      {Object.keys(errors).length > 0 && <ErrorsList errors={errors} />}
      <Form onSubmit={submitHandler}>
        <InputField
          className="form-control-lg"
          name="title"
          placeholder="Article Title"
          value={title}
          onChange={onTitleChange}
          disabled={loading}
        />
        <InputField
          name="description"
          placeholder="What's this article about?"
          value={description}
          onChange={onDescriptionChange}
          disabled={loading}
        />
        <TextField
          name="body"
          placeholder="Write your article (in markdown)"
          rows={8}
          value={body}
          onChange={onBodyChange}
          disabled={loading}
        />
        <FormGroup>
          <Input
            autoComplete="off"
            name="tag-list"
            placeholder="Enter tags"
            value={tag}
            onChange={onTagChange}
            onKeyDown={onTagKeyDown}
            disabled={loading}
          />
          <TagsList as="div">
            {tagList.map((tag) => (
              <Tag as="span" key={tag}>
                <i
                  onClick={() => editorSubjects.removeTag$.next(tag)}
                  className="ion-close-round"
                />
                &nbsp;
                {tag}
              </Tag>
            ))}
          </TagsList>
        </FormGroup>
        <Button
          size={ButtonSize.Large}
          variant={ButtonVariant.Primary}
          className="pull-xs-right"
          disabled={loading}
          type="submit"
        >
          Publish article
        </Button>
      </Form>
    </>
  )
}
