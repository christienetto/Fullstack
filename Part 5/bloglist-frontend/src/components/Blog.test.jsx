import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog /> single view', () => {
  const blog = {
    id: '1',
    title: 'Component testing is done with react-testing-library',
    author: 'Kent C. Dodds',
    url: 'https://testing-library.com/',
    likes: 7,
    user: { username: 'mluukkai', name: 'Matti Luukkainen' },
  }

  test('shows blog info and likes to unauthenticated users without buttons', () => {
    render(<Blog blog={blog} user={null} />)

    expect(screen.getByText('Component testing is done with react-testing-library', { exact: false })).toBeVisible()
    expect(screen.getByText('https://testing-library.com/')).toBeVisible()
    expect(screen.getByText('likes 7', { exact: false })).toBeVisible()

    expect(screen.queryByText('like')).toBeNull()
    expect(screen.queryByText('remove')).toBeNull()
  })

  test('shows only the like button to a logged in user who is not the creator', () => {
    const otherUser = { username: 'hellas', name: 'Arto Hellas' }
    render(<Blog blog={blog} user={otherUser} />)

    expect(screen.getByText('like')).toBeVisible()
    expect(screen.queryByText('remove')).toBeNull()
  })

  test('shows like and remove buttons to the creator', () => {
    const creator = { username: 'mluukkai', name: 'Matti Luukkainen' }
    render(<Blog blog={blog} user={creator} />)

    expect(screen.getByText('like')).toBeVisible()
    expect(screen.getByText('remove')).toBeVisible()
  })

  test('calls the like handler twice when like is clicked twice', async () => {
    const likeBlog = vi.fn()
    const creator = { username: 'mluukkai', name: 'Matti Luukkainen' }
    render(<Blog blog={blog} user={creator} likeBlog={likeBlog} />)

    const user = userEvent.setup()
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(likeBlog.mock.calls).toHaveLength(2)
  })
})
