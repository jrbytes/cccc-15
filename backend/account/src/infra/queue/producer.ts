import amqp from 'amqplib'
import { v4 } from 'uuid'

async function main() {
  const connection = await amqp.connect('amqp://localhost')
  const channel = await connection.createChannel()
  await channel.assertQueue('test', { durable: true })
  const input = {
    id: v4(),
  }
  channel.sendToQueue('test', Buffer.from(JSON.stringify(input)))
}

void main()
