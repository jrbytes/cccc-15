import express, { type Request, type Response } from 'express'

export default interface HttpServer {
  register: (method: string, url: string, callback: any) => void
  listen: (port: number) => void
}

export class ExpressAdapter implements HttpServer {
  app: any

  constructor() {
    this.app = express()
    this.app.use(express.json())
  }

  register(method: string, url: string, callback: any) {
    this.app[method](url, async (req: Request, res: Response) => {
      try {
        const output = await callback(req.params, req.body)
        res.json(output)
      } catch (e: any) {
        return res.status(422).json({ message: e.message })
      }
    })
  }

  listen(port: number) {
    this.app.listen(port)
  }
}
