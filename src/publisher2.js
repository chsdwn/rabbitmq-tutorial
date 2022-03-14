const amqp = require('amqplib')

const queueName = process.argv[2] || 'jobsQueue'
const message = {
  description: 'Lorem ipsum'
}

const connect = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost:5672')
    const channel = await connection.createChannel()
    await channel.assertQueue(queueName)

    setInterval(() => {
      message.description = `${new Date().getTime()}-2`
      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)))
      console.log(`Message send to '${queueName}' queue:`, message)
    }, 1000)
  } catch (err) {
    console.error(err.message)
  }
}
connect()
