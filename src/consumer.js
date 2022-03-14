const amqp = require('amqplib')

const data = require('./data.json')
const queueName = process.argv[2] || 'jobsQueue'

const connect = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost:5672')
    const channel = await connection.createChannel()
    await channel.assertQueue(queueName)

    console.log(`Waiting ${queueName}...`)

    channel.consume(queueName, (message) => {
      const messageInfo = JSON.parse(message.content.toString())
      const userInfo = data.find((item) => Number(item.id) === Number(messageInfo.description))
      if (userInfo) {
        console.log('User:', userInfo)
        channel.ack(message)
      }
    })
  } catch (err) {
    console.error(err.message)
  }
}
connect()
