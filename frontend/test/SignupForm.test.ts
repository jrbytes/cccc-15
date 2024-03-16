import { act, renderHook, waitFor } from "@testing-library/react";
import axios from "axios";
import vitest, { expect, test, vi } from "vitest";
import { useSignupForm } from "../src/domain/useSignupForm";

vi.mock('axios')
const mockedAxios = axios as vitest.Mocked<typeof axios>
mockedAxios.post.mockResolvedValue({ 
  data: { accountId: '123' }
})

test('deve testar o signupForm', async () => {
  const { result } = renderHook(() => useSignupForm())
  expect(result.current.state.step).toBe(1)
  expect(result.current.calculateProgress()).toBe(0)
  act(() => {
    result.current.setState({ ...result.current.state, isPassenger: true })
  })
  expect(result.current.state.isPassenger).toBe(true)
  expect(result.current.calculateProgress()).toBe(25)
  act(() => {
    result.current.next()
  })
  expect(result.current.state.step).toBe(2)
  act(() => {
    result.current.previous()
  })
  expect(result.current.state.step).toBe(1)
  act(() => {
    result.current.next()
  })
  act(() => {
    result.current.setState({ ...result.current.state, name: 'John Doe' })
  })
  expect(result.current.calculateProgress()).toBe(40)
  act(() => {
    result.current.setState({ ...result.current.state, email: 'johndoe@gmail.com' })
  })
  expect(result.current.calculateProgress()).toBe(55)
  act(() => {
    result.current.setState({ ...result.current.state, cpf: '12345678912' })
  })
  expect(result.current.calculateProgress()).toBe(70)
  act(() => {
    result.current.next()
  })
  expect(result.current.state.step).toBe(3)
  act(() => {
    result.current.previous()
  })
  expect(result.current.state.step).toBe(2)
  act(() => {
    result.current.next()
  })
  act(() => {
    result.current.setState({ ...result.current.state, password: '12345678' })
  })
  expect(result.current.calculateProgress()).toBe(85)
  act(() => {
    result.current.setState({ ...result.current.state, confirmPassword: '12345678' })
  })
  expect(result.current.calculateProgress()).toBe(100)
  expect(result.current.state.error).toBe('')
  act(() => {
    result.current.submit()
  })
  await waitFor(() => expect(result.current.state.success).toBe('Conta criada com sucesso'))
})