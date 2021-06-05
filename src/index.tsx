import React from 'react'
import ReactDOM from 'react-dom'

import { RxRouter } from 'lib/router'
import { history } from 'lib/history'

import { navigation } from 'store'

import { App } from './app'

ReactDOM.render(
  <React.StrictMode>
    <RxRouter history={history} state$={navigation.state$}>
      <App />
    </RxRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
