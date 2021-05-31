import {
  Configuration,
  DefaultApi,
  ProfileApi,
  ArticlesApi,
  CommentsApi,
  FavoritesApi,
  UserAndAuthenticationApi,
} from 'lib/conduit-client'
import { omitNullProps } from 'lib/types'

import { TOKEN_KEY } from 'models/app'

const configuration = new Configuration({
  basePath: process.env.REACT_APP_BACKEND,
  middleware: [
    {
      pre(request) {
        const { headers } = request

        return {
          ...request,
          headers: headers && omitNullProps(headers as Record<string, any>),
        }
      },
    },
  ],
  //@ts-expect-error
  apiKey: () => {
    const token = localStorage.getItem(TOKEN_KEY)
    return token && `Token ${token}`
  },
})

export const defaultApi = new DefaultApi(configuration)
export const profileApi = new ProfileApi(configuration)
export const articleApi = new ArticlesApi(configuration)
export const commentsApi = new CommentsApi(configuration)
export const favoriteApi = new FavoritesApi(configuration)
export const userAndAuthenticationApi = new UserAndAuthenticationApi(
  configuration
)
