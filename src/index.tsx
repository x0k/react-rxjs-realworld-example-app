import React from 'react'
import ReactDOM from 'react-dom'

import { RxRouter } from 'lib/router'

import { App } from './app'
import { navigation } from './app-store'
import { history } from './browser-history'

ReactDOM.render(
  <React.StrictMode>
    <RxRouter history={history} state$={navigation.state$}>
      <App />
    </RxRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
