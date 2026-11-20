import { useState, useEffect } from 'react'
import {
  Routes, Route, Link, Navigate, useMatch, useNavigate
} from 'react-router-dom'
import { Container, AppBar, Toolbar, Button, Box, Typography } from '@mui/material'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const match = useMatch('/blogs/:id')
  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  const notify = (text, type = 'success') => {
    setNotification({ text, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      navigate('/')
    } catch {
      notify('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    navigate('/')
  }

  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat({ ...returnedBlog, user: { username: user.username, name: user.name } }))
        notify(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
        navigate('/')
      })
  }

  const likeBlog = (blog) => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }

    blogService
      .update(blog.id, updatedBlog)
      .then(returnedBlog => {
        setBlogs(blogs.map(b => (b.id === blog.id ? returnedBlog : b)))
      })
  }

  const removeBlog = (blog) => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      return
    }

    blogService
      .remove(blog.id)
      .then(() => {
        setBlogs(blogs.filter(b => b.id !== blog.id))
        navigate('/')
      })
  }

  const navButtonStyle = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/" sx={navButtonStyle}>
            blogs
          </Button>
          {user && (
            <Button color="inherit" component={Link} to="/create" sx={navButtonStyle}>
              create new
            </Button>
          )}
          <Box sx={{ flexGrow: 1 }} />
          {user
            ? (
              <>
                <Typography sx={{ marginRight: 2 }}>{user.name} logged in</Typography>
                <Button color="inherit" onClick={handleLogout} sx={navButtonStyle}>
                  logout
                </Button>
              </>
            )
            : (
              <Button color="inherit" component={Link} to="/login" sx={navButtonStyle}>
                login
              </Button>
            )
          }
        </Toolbar>
      </AppBar>

      <Notification notification={notification} />

      <Routes>
        <Route path="/blogs/:id" element={
          <Blog
            blog={blog}
            user={user}
            likeBlog={likeBlog}
            removeBlog={removeBlog}
          />
        } />
        <Route path="/create" element={
          user ? <BlogForm createBlog={addBlog} /> : <Navigate replace to="/login" />
        } />
        <Route path="/login" element={
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        } />
        <Route path="/" element={<BlogList blogs={blogs} />} />
      </Routes>
    </Container>
  )
}

export default App
