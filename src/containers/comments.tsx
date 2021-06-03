import React, { ChangeEvent, useMemo } from 'react'
import { Link } from 'react-router-dom'

import { Article } from 'lib/conduit-client'
import { useRxState } from 'lib/store-rx-state'
import { matcher } from 'lib/state'
import { createFormSubmitHandler } from 'lib/event'
import { useSignalsHooks } from 'lib/store-rx-signals'

import { Path } from 'models/path'

import { ErrorsList } from 'components/errors-list'
import { List } from 'components/list'
import { Button, ButtonVariant } from 'components/button'
import { Form } from 'components/form'
import { Textarea } from 'components/textarea'

import {
  comments$,
  commentsChangeComment,
  commentsCleanup,
  commentsDeleteComment,
  commentsLoad,
  commentsPostComment,
} from 'store/comments'
import { user$, UserStates, UserStatus } from 'store/user'

export interface CommentsContainerProps {
  article: Article
}

const onCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
  commentsChangeComment.next(e.target.value)

const onPostComment = createFormSubmitHandler(commentsPostComment)

export function CommentsContainer({
  article: { slug },
}: CommentsContainerProps) {
  const hooks = useSignalsHooks(commentsLoad, commentsCleanup, slug)
  const { comment, comments, errors, loading } = useRxState(comments$, hooks)
  const userState = useRxState(user$)
  const userMatcher = useMemo(
    () => matcher<UserStatus, UserStates>(userState),
    [userState]
  )
  return (
    <>
      {Object.keys(errors).length > 0 && <ErrorsList errors={errors} />}
      {userMatcher.match(UserStatus.Authorized) ? (
        <Form className="card comment-form" onSubmit={onPostComment}>
          <div className="card-block">
            <Textarea
              placeholder="Write a comment..."
              rows={3}
              value={comment}
              onChange={onCommentChange}
              disabled={loading}
            />
          </div>
          <div className="card-footer">
            <img
              alt={userMatcher.state.user.username}
              className="comment-author-img"
              src={userMatcher.state.user.image}
            />
            <Button variant={ButtonVariant.Primary} type="submit" disabled={loading} >
              Post Comment
            </Button>
          </div>
        </Form>
      ) : (
        <p>
          <Link to={Path.Login}>Sign in</Link>
          &nbsp;or&nbsp;
          <Link to={Path.Registration}>sign up</Link>
          &nbsp;to add comments on this article.
        </p>
      )}
      <List>
        {comments.map((comment) => {
          const { id, body, author, createdAt } = comment
          return (
            <div className="card" key={id}>
              <div className="card-block">
                <p className="card-text">{body}</p>
              </div>
              <div className="card-footer">
                <Link className="comment-author" to={`/@${author.username}`}>
                  <img
                    alt={author.username}
                    className="comment-author-img"
                    src={author.image}
                  />
                </Link>
                &nbsp;
                <Link className="comment-author" to={`/@${author.username}`}>
                  {author.username}
                </Link>
                <span className="date-posted">
                  {new Date(createdAt).toDateString()}
                </span>
                {userMatcher.match(UserStatus.Authorized) &&
                  userMatcher.state.user.username === author.username && (
                    <span
                      className="mod-options"
                      onClick={() => commentsDeleteComment.next(comment)}
                    >
                      <i className="ion-trash-a" />
                    </span>
                  )}
              </div>
            </div>
          )
        })}
      </List>
    </>
  )
}
