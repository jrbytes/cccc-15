export default class Mediator {
  services: Array<{ event: string; callback: any }>

  constructor() {
    this.services = []
  }

  register(event: string, callback: any) {
    this.services.push({ event, callback })
  }

  async notify(event: string, data: any) {
    for (const service of this.services) {
      if (service.event === event) {
        await service.callback(data)
      }
    }
  }
}
