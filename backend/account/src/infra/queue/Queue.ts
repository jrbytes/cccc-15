import amqp from 'amqplib'

export default interface Queue {
  connect: () => Promise<void>
  consume: (queue: string, callback: any) => Promise<void>
  publish: (queue: string, data: any) => Promise<void>
}

export class RabbitMQAdapter implements Queue {
  connection: any

  async connect() {
    this.connection = await amqp.connect('amqp://localhost')
  }

  async consume(queue: string, callback: any) {
    const channel = await this.connection.createChannel()
    await channel.assertQueue(queue, { durable: true })
    channel.consume(queue, async (msg: any) => {
      const input = JSON.parse(msg.content.toString() as string)
      try {
        await callback(input)
        channel.ack(msg)
      } catch (e: any) {
        console.log('Error processing message: ', e)
      }
    })
  }

  async publish(queue: string, data: any) {
    const channel = await this.connection.createChannel()
    await channel.assertQueue(queue, { durable: true })
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)))
  }
}
