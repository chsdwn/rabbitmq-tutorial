const amqp = require('amqplib')

const data = require('./data.json')
const queueName = process.argv[2] || 'jobsQueue'
const message = {
  description: 'Lorem ipsum'
}

const connect = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost:5672')
    const channel = await connection.createChannel()
    await channel.assertQueue(queueName)

    data.forEach((item) => {
      message.description = item.id
      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)))
      console.log(`Message send to '${queueName}' queue:`, message)
    })

    // setInterval(() => {
    //   message.description = new Date().getTime()
    //   channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)))
    //   console.log(`Message send to '${queueName}' queue:`, message)
    // }, 1000)
  } catch (err) {
    console.error(err.message)
  }
}
connect()
