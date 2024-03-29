/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'

export default interface HttpClient {
  get: (url: string) => Promise<any>
  post: (url: string, data: any) => Promise<any>
}

export class AxiosAdapter implements HttpClient {
  async get(url: string): Promise<any> {
    const response = await axios.get(url)
    return response.data
  }

  async post(url: string, data: any): Promise<any> {
    const response = await axios.post(url, data)
    return response.data
  }
}

export class FetchAdapter implements HttpClient {
  async get(url: string): Promise<any> {
    const response = await fetch(url)
    return await response.json()
  }

  async post(url: string, data: any): Promise<any> {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return await response.json()
  }
}
