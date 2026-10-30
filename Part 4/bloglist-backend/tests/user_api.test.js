const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('the password is stored as a hash, not in plain text', async () => {
    await api
      .post('/api/users')
      .send({ username: 'hellas', name: 'Arto', password: 'salainen' })
      .expect(201)

    const savedUser = await User.findOne({ username: 'hellas' })
    assert.notStrictEqual(savedUser.passwordHash, 'salainen')
    assert.strictEqual(await bcrypt.compare('salainen', savedUser.passwordHash), true)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('expected `username` to be unique'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails if username is shorter than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const result = await api
      .post('/api/users')
      .send({ username: 'ab', name: 'Short', password: 'salainen' })
      .expect(400)

    assert(result.body.error.includes('username must be at least 3 characters long'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails if password is missing or shorter than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const missing = await api
      .post('/api/users')
      .send({ username: 'newuser', name: 'No Password' })
      .expect(400)
    assert(missing.body.error.includes('password must be at least 3 characters long'))

    const short = await api
      .post('/api/users')
      .send({ username: 'newuser', name: 'Short Password', password: 'ab' })
      .expect(400)
    assert(short.body.error.includes('password must be at least 3 characters long'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

describe('logging in', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    await new User({ username: 'root', passwordHash }).save()
  })

  test('succeeds with the correct password and returns a token', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
      .expect(200)

    assert(response.body.token)
    assert.strictEqual(response.body.username, 'root')
  })

  test('fails with status code 401 for a wrong password', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'wrong' })
      .expect(401)

    assert(response.body.error.includes('invalid username or password'))
  })
})

after(async () => {
  await mongoose.connection.close()
})
