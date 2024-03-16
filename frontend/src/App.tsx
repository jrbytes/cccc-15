import './App.css'
import { useSignupForm } from './domain/useSignupForm'

function App() {
  const {
    state,
    setState,
    calculateProgress,
    next,
    previous,
    submit
  } = useSignupForm()

  return (
    <>
      <span>Passo {state.step}</span>
      <br />
      <span>{calculateProgress()}%</span>
      <br />
      <span>{state.error}</span>
      {state.success && (
        <>
          <span>{state.success}</span>
          <br />
        </>
      )}
      {state.error && <br />}
      {state.step === 1 && (
        <>
          <input type="checkbox" onChange={(e) => {
            setState({ ...state, isPassenger: e.target.checked })
          }} /> Passenger
        </>
      )}
      {state.step === 2 && (
        <>
          <label htmlFor="nome">Nome</label>
          <input type="text" id='nome' value={state.name} onChange={e => {
            setState({ ...state, name: e.target.value })
          }} />
          <br />
          <label htmlFor="email">E-mail</label>
          <input type="email" id='email' value={state.email} onChange={e => {
            setState({ ...state, email: e.target.value })
          }} />
          <br />
          <label htmlFor="cpf">CPF</label>
          <input type="text" id='cpf' value={state.cpf} onChange={e => {
            setState({ ...state, cpf: e.target.value })
          }} />
        </>
      )}
      {state.step === 3 && (
        <>
          <label htmlFor="password">Senha</label>
          <input type="password" id='password' value={state.password} onChange={e => {
            setState({ ...state, password: e.target.value })
          }} />
          <br />
          <label htmlFor="confirmpassword">Confirmação de Senha</label>
          <input type="password" id='confirmpassword' value={state.confirmPassword} onChange={e => {
            setState({ ...state, confirmPassword: e.target.value })
          }} />
        </>
      )}
      <br />
      <button onClick={() => previous()}>Anterior</button>
      <button onClick={() => next()} hidden={state.step >= 3}>Próximo</button>
      <button hidden={state.step !== 3} onClick={() => submit()}>Enviar</button>
    </>
  )
}

export default App
