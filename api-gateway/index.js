const express = require('express')
const httpProxy = require('http-proxy')

const proxy = httpProxy.createProxyServer()
const app = express()

app.use('/user', (req, res) => {
  proxy.web(req, res, { target: 'http://user-service:3001' }, (error) => {
    console.error('Proxy error:', error)
    res.status(500).send('Something went wrong with the user service')
  })})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`)
})
