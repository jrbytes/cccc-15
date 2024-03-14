import type UseCase from '../usecase/UseCase'

export default class SecurityDecorator implements UseCase {
  constructor(readonly useCase: UseCase) {}

  async execute(input: any): Promise<any> {
    console.log('SecurityDecorator', input)
    return await this.useCase.execute(input)
  }
}
