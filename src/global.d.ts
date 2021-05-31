import { AjaxError } from 'rxjs/ajax'

declare module 'rxjs/ajax' {
  interface AjaxError<R = any> {
    response: R
  }
}
