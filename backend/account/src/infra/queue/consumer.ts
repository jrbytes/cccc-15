import amqp, { type Message } from 'amqplib'

async function main() {
  const connection = await amqp.connect('amqp://localhost')
  const channel = await connection.createChannel()
  await channel.assertQueue('test', { durable: true })
  channel.consume('test', async function (msg: any) {
    const input = JSON.parse(msg.content.toString() as string)
    console.log(input)
    channel.ack(msg as Message)
  }) as any
}

void main()
