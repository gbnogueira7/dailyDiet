import fastify from 'fastify'
const app = fastify()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app
  .listen({
    port: 3000,
  })
  .then(() => {
    console.log('Server is running 🚀')
  })
