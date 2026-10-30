const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

let token = null

describe('when there are initially some blogs saved', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'Superuser', passwordHash })
    await user.save()

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    token = loginResponse.body.token

    const blogsWithUser = helper.initialBlogs.map((blog) => ({ ...blog, user: user._id }))
    await Blog.insertMany(blogsWithUser)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('the unique identifier property is named id', async () => {
    const response = await api.get('/api/blogs')

    assert(response.body[0].id)
    assert.strictEqual(response.body[0]._id, undefined)
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data and a valid token', async () => {
      const newBlog = {
        title: 'Async/await simplifies making async calls',
        author: 'Mluukkai',
        url: 'https://fullstackopen.com/en/part4',
        likes: 2,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map((blog) => blog.title)
      assert(titles.includes('Async/await simplifies making async calls'))
    })

    test('likes defaults to 0 when missing', async () => {
      const newBlog = {
        title: 'No likes yet',
        author: 'Mluukkai',
        url: 'https://fullstackopen.com/en/part4',
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)

      assert.strictEqual(response.body.likes, 0)
    })

    test('the creator is set to the user identified by the token', async () => {
      const newBlog = {
        title: 'Who wrote this?',
        url: 'https://example.com/creator',
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)

      const blogsAtEnd = await Blog.find({}).populate('user', { username: 1 })
      const created = blogsAtEnd.find((blog) => blog.title === 'Who wrote this?')
      assert.strictEqual(created.user.username, 'root')
    })

    test('fails with status code 401 if token is missing', async () => {
      const newBlog = {
        title: 'No token here',
        url: 'https://example.com/no-token',
      }

      await api.post('/api/blogs').send(newBlog).expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('fails with status code 400 if title is missing', async () => {
      const newBlog = {
        author: 'Mluukkai',
        url: 'https://fullstackopen.com/en/part4',
        likes: 1,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('fails with status code 400 if url is missing', async () => {
      const newBlog = {
        title: 'A blog without url',
        author: 'Mluukkai',
        likes: 1,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 when the creator deletes it', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      const ids = blogsAtEnd.map((blog) => blog.id)
      assert(!ids.includes(blogToDelete.id))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })

    test('fails with status code 401 if token is missing', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('fails with status code 401 when another user tries to delete it', async () => {
      const passwordHash = await bcrypt.hash('othersecret', 10)
      await new User({ username: 'mallory', passwordHash }).save()

      const otherLogin = await api
        .post('/api/login')
        .send({ username: 'mallory', password: 'othersecret' })

      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${otherLogin.body.token}`)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('updating a blog', () => {
    test('updates the number of likes', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({ likes: 42 })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, 42)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd[0].likes, 42)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
