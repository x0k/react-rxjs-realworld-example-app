import React, { ChangeEvent, useMemo } from 'react'
import { Link } from 'react-router-dom'

import { Article } from 'lib/conduit-client'
import { matcher } from 'lib/state'
import { createFormSubmitHandler } from 'lib/event'
import { useRxState, useSignalsHooks } from 'lib/rx-store-react'

import { Path } from 'models/path'

import { ErrorsList } from 'components/errors-list'
import { List } from 'components/list'
import { Button, ButtonVariant } from 'components/button'
import { Form } from 'components/form'
import { Textarea } from 'components/textarea'

import { comments, user } from 'store'
import { UserStates, UserStatus } from 'store/user'

export interface CommentsContainerProps {
  article: Article
}

const onCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
  comments.changeComment(e.target.value)

const onPostComment = createFormSubmitHandler(comments.postComment)

export function CommentsContainer({
  article: { slug },
}: CommentsContainerProps) {
  const hooks = useSignalsHooks(comments.load, comments.stop, slug)
  const {
    comment,
    comments: commentsList,
    errors,
    loading,
  } = useRxState(comments.state$, hooks)
  const userState = useRxState(user.state$)
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
            <Button
              variant={ButtonVariant.Primary}
              type="submit"
              disabled={loading}
            >
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
        {commentsList.map((comment) => {
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
                      onClick={() => comments.deleteComment(comment)}
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
