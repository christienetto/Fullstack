import { Card, CardContent, CardActions, Typography, Button, Link } from '@mui/material'

const Blog = ({ blog, user, likeBlog, removeBlog }) => {
  if (!blog) {
    return null
  }

  const isCreator = user && blog.user.username === user.username

  return (
    <Card className="blog-details" style={{ marginTop: 20 }}>
      <CardContent>
        <Typography variant="h5">
          {blog.title} {blog.author}
        </Typography>
        <Typography>
          <Link href={blog.url}>{blog.url}</Link>
        </Typography>
        <Typography>likes {blog.likes}</Typography>
        <Typography color="text.secondary">
          added by {blog.user.name}
        </Typography>
      </CardContent>
      {user && (
        <CardActions>
          <Button variant="outlined" onClick={() => likeBlog(blog)}>like</Button>
          {isCreator && (
            <Button variant="outlined" color="error" onClick={() => removeBlog(blog)}>
              remove
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  )
}

export default Blog
