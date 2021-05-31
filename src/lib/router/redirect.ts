import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { To } from 'history'

export interface RedirectProps {
  to: To | ((navigate: ReturnType<typeof useNavigate>) => void)
  replace?: boolean
}

export function Redirect({ to, replace }: RedirectProps) {
  const navigate = useNavigate()
  const location = useLocation()
  useEffect(() => {
    if (typeof to === 'function') {
      to(navigate)
    } else {
      navigate(to, { replace, state: { from: location } })
    }
  }, [to, replace, navigate, location])
  return null
}
