import { useState } from 'react'
import { TextField, Button } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create new</h2>

      <form onSubmit={addBlog}>
        <div>
          <TextField
            label="title"
            value={title}
            onChange={event => setTitle(event.target.value)}
            placeholder="blog title"
            margin="dense"
            fullWidth
          />
        </div>
        <div>
          <TextField
            label="author"
            value={author}
            onChange={event => setAuthor(event.target.value)}
            placeholder="blog author"
            margin="dense"
            fullWidth
          />
        </div>
        <div>
          <TextField
            label="url"
            value={url}
            onChange={event => setUrl(event.target.value)}
            placeholder="blog url"
            margin="dense"
            fullWidth
          />
        </div>
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
          create
        </Button>
      </form>
    </div>
  )
}

export default BlogForm
