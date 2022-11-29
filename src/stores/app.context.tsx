import { FC, Reducer, ReactNode, createContext, useReducer, useEffect } from 'react'
import { AlertColor } from '@mui/material'
import { BodyBudgets, BodyProducts } from '@hm-dto/services.dto'
import { SnackAlert } from '@hm-components/Alert'
import { BackdropLoading } from '@hm-components/Loading'

interface State {
  budgets: BodyBudgets[]
  products: BodyProducts[]
  loading: boolean
  snackAlert: {
    msg: string
    type: AlertColor
  }
}

enum ActionType {
  set = 'SET',
  reset = 'RESET'
}

interface Action {
  type: ActionType
  payload?: {
    key?: keyof State
    data?: any
  }
}

interface Context extends State {
  set: (key: keyof State, data: any) => void
  reset: () => void
}

interface Props {
  children?: ReactNode
  value: {
    budgets: any[]
    products: any[]
  }
}

// ==================================================

const _state: State = {
  budgets: [],
  products: [],
  loading: false,
  snackAlert: {
    type: 'error',
    msg: ''
  }
}

const _context: Context = {
  ..._state,
  set: () => null,
  reset: () => null
}

const _reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ActionType.set:
      return action?.payload?.key
        ? { ...state, [action?.payload?.key]: action?.payload?.data }
        : state
    case ActionType.reset:
      return _state
    default:
      return state
  }
}

// ==================================================

const AppContext = createContext<Context>(_context)

export const AppProvider: FC<Props> = ({ children, value }) => {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(_reducer, _state)

  // setter dispatch ----------------
  const set: Context['set'] = (key, data) => dispatch({ type: ActionType.set, payload: { key, data } })

  const reset: Context['reset'] = () => dispatch({ type: ActionType.reset })

  // context app --------------------
  const context: Context = {
    loading: state.loading,
    budgets: state.budgets,
    products: state.products,
    snackAlert: state.snackAlert,
    set,
    reset
  }

  // hooks functional ---------------
  useEffect(() => set('budgets', value.budgets), [value.budgets])

  useEffect(() => set('products', value.products), [value.products])

  // renderer steps ---------------=
  return (
    <AppContext.Provider value={context}>

      <BackdropLoading
        loading={state.loading}
      />

      <SnackAlert
        message={state.snackAlert.msg}
        severity={state.snackAlert.type}
        open={state.snackAlert.msg !== ''}
        onClose={() => set('snackAlert', { ..._state.snackAlert })}
      />

      {children}
    </AppContext.Provider>
  )
}

export default AppContext
