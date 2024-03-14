import type DomainEvent from './event/DomainEvent'

export default class Aggregate {
  listeners: Array<{ name: string; callback: any }>

  constructor() {
    this.listeners = []
  }

  register(name: string, callback: any) {
    this.listeners.push({ name, callback })
  }

  notify(event: DomainEvent) {
    for (const listener of this.listeners) {
      if (listener.name === event.name) {
        listener.callback(event)
      }
    }
  }
}
