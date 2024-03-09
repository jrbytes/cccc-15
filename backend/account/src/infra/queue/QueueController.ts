import type Signup from '../../application/usecase/Signup'
import type Queue from './Queue'

export default class QueueController {
  constructor(queue: Queue, signup: Signup) {
    void queue.consume('signup', async function (input: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await signup.execute(input)
    })
  }
}
