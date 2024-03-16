import { useState } from "react";
import { AxiosAdapter } from "../infra/http/HttpClient";
import { AccountGatewayHttp } from "../infra/gateway/AccountGateway";

export function useSignupForm() {
  const [state, setState] = useState({
    isPassenger: false,
    isDriver: false,
    name: '',
    email: '',
    cpf: '',
    password: '',
    confirmPassword: '',
    step: 1,
    progress: () => calculateProgress(),
    error: '',
    success: ''
  })

  function calculateProgress(): number {
    let progress = 0
    if (state.isPassenger) {
      progress += 25
    }
    if (state.name) {
      progress += 15
    }
    if (state.email) {
      progress += 15
    }
    if (state.cpf) {
      progress += 15
    }
    if (state.password) {
      progress += 15
    }
    if (state.confirmPassword) {
      progress += 15
    }
    return progress
  }

  function validate () {
    if (state.step === 1) {
      if (!state.isPassenger && !state.isDriver) {
        setState({ ...state, step: 1, error: 'Selecione um tipo de conta: passageiro ou motorista ou ambos' })
        return false
      }
    }
    if (state.step === 2) {
      if (!state.name) {
        setState({ ...state, error: 'Digite o nome' })
        return false
      }
      if (!state.email) {
        setState({ ...state, error: 'Digite o e-mail' })
        return false
      }
      if (!state.cpf) {
        setState({ ...state, error: 'Digite o cpf' })
        return false
      }
    }
    if (state.step === 3) {
      if (state.password !== state.confirmPassword) {
        setState({ ...state, error: 'Senha deve ser igual a confirmação' })
        return false
      }
      if (state.password.length === 0 && state.confirmPassword.length === 0) {
        setState({ ...state, error: 'Senha nao deve ser vazia' })
        return false
      }
    }
    return true
  }

  function next() {
    if (validate()) {
      setState({ ...state, step: state.step + 1, error: '' })
    }
  }

  function previous() {
    setState({ ...state, step: state.step > 0 ? state.step - 1 : state.step, error: '' })
  }

  async function submit() {
    if (validate()) {
      const data = {
        isPassenger: state.isPassenger,
        name: state.name,
        email: state.email,
        cpf: state.cpf
      }
      const httpClient = new AxiosAdapter()
      const accountGateway = new AccountGatewayHttp(httpClient)
      await accountGateway.signup(data)
      setState({ ...state, success: 'Conta criada com sucesso' })
    }
  }

  return {
    state,
    setState,
    calculateProgress,
    next,
    previous,
    submit
  }
}