const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const favorite = blogs.reduce((best, blog) => {
    return blog.likes > best.likes ? blog : best
  })

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const countByAuthor = {}
  blogs.forEach((blog) => {
    countByAuthor[blog.author] = (countByAuthor[blog.author] || 0) + 1
  })

  const topAuthor = Object.keys(countByAuthor).reduce((best, author) => {
    return countByAuthor[author] > countByAuthor[best] ? author : best
  })

  return {
    author: topAuthor,
    blogs: countByAuthor[topAuthor],
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const likesByAuthor = {}
  blogs.forEach((blog) => {
    likesByAuthor[blog.author] = (likesByAuthor[blog.author] || 0) + blog.likes
  })

  const topAuthor = Object.keys(likesByAuthor).reduce((best, author) => {
    return likesByAuthor[author] > likesByAuthor[best] ? author : best
  })

  return {
    author: topAuthor,
    likes: likesByAuthor[topAuthor],
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
