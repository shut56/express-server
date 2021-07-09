const express = require('express')

const server = express()

const PORT = process.env.PORT || 8080

function getAcces(method, req) {
  const checkUID = '12test34-test-5678-test-90test123456'
  const md5 = 'edcc6814de29e7439dfd50068f455653'
  if (!req.headers.authorization) {
    return {
      "status": "error",
      "details": "Incorrect User Token"
    }
  }
  const token = req.headers.authorization.split(' ') // test@test.com_year_2020 === edcc6814de29e7439dfd50068f455653
  const { uid } = req.params
  // console.log(token)
  if (uid !== checkUID) {
    return {
      "status": "error",
      "details": "Incorrect User Id"
    }
  } else if (token[0] !== 'Bearer' || token[1] !== md5) {
    return {
      "status": "error",
      "details": "Incorrect Header Token"
    }
  } else if (token[0] === 'Bearer' && token[1] === md5) {
    switch (method) {
      case 'get': {
        return {
          "status": "ok",
          "message": "Let's see how deep you can go",
          "nextUrl": "/api/homework/v1/learn/api/<your-id>/login/5d9b8990-ab41-43d4-ae2a-75852ca6744f",
          "nextMethod": "POST",
          "body": {
              "login": "<your-login>",
              "password": "<your-password>"
          },
          "content-type": "application/json"
        }
      }
      case 'post': {
        console.log(req.body)
        if (!req.body) {
          return {
            "status": "error",
            "details": "Field <login> is not provided"
          }
        }
        const login = req.body.login
        const password = req.body.password
        if (login === 'test@test.com' && password === 'test') {
          return {
            "status": "ok",
            "message": "Let's see how deep you can go",
            "nextUrl": "/api/homework/v1/learn/api/<your-id>/dob/bb3bead9-3161-490e-a04b-52b5029d88ea",
            "nextMethod": "Put",
            "body": {
                "date_of_birth": "DD.MM.YYYY"
            },
            "content-type": "application/json",
            "description": "Body should contain date of birth. if day or month has single digit you need to use 0. 07.08.2019 -> correct. 7.8.2019 - incorrect"
          }
        }
        return {
          "status": "error",
          "details": "Access denied. User Not Found"
        }
      }
      case 'put': {
        if (typeof req.body === 'undefined' || !req.body.date_of_birth) {
          return {
            "status": "error",
            "details": "Field <date_of_birth> is not provided"
          }
        }
        const dob = req.body.date_of_birth.split('.')
        if (dob[0].length === 2 && dob[1].length === 2 && dob[2].length === 4) {
          return {
            "status": "ok",
            "message": "You have unlocked achievement new <<API Warrior Level 1>>",
            "description": "Congratulation! You just have added your birth day to your account"
          }
        }
        return {
          "status": "error",
          "details": "Incorrect Date Of Birth Size"
        }
      }
      default: 
        return 1
    }
  }
}

server.use(express.json())

const style = 'border: 1px solid #ddd; border-left: 0.2em solid #f36d33; background: #f4f4f4; margin-left: 1em; padding: 1em;'
const uid = `<your_ID>`

server.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body>
        <h1>Welcome to PepeTest</h1>
        <div style="${style}">
          <p>Your ID: 12test34-test-5678-test-90test123456</p>
          <p>Server: http://${req.headers.host}/</p>
          <p>Method: GET</p>
          <p>URL: /api/homework/v1/learn/api/<</>your-id>/token</p>
          <p>Example: name@example.com_year_2020</p>
        </div>
        <h2>Test user:</h2>
        <div style="${style}">
          <p>Login: test@test.com</p>
          <p>Password: test</p>
        </div>
      </body>
    </html>
  `)
})

server.get('/api/homework/v1/learn/api/:uid/token', (req, res) => {
  const response = getAcces(req.method.toLowerCase(), req)
  if (response.status === 'ok') {
    res.json(response)
  } else {
    res.status(401).json(response)
  }
})

server.post('/api/homework/v1/learn/api/:uid/login/5d9b8990-ab41-43d4-ae2a-75852ca6744f', (req, res) => {
  const response = getAcces(req.method.toLowerCase(), req)
  if (response.status === 'ok') {
    res.json(response)
  } else {
    res.status(401).json(response)
  }
})

server.put('/api/homework/v1/learn/api/:uid/dob/bb3bead9-3161-490e-a04b-52b5029d88ea', (req, res) => {
  const response = getAcces(req.method.toLowerCase(), req)
  if (response.status === 'ok') {
    res.json(response)
  } else {
    res.status(401).json(response)
  }
})

server.listen(PORT)

console.log(`Serving at localhost:${PORT}`)