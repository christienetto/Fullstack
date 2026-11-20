import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> calls createBlog with the right details', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  await user.type(screen.getByPlaceholderText('blog title'), 'Testing forms')
  await user.type(screen.getByPlaceholderText('blog author'), 'Jane Doe')
  await user.type(screen.getByPlaceholderText('blog url'), 'https://example.com/forms')
  await user.click(screen.getByText('create'))

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Testing forms',
    author: 'Jane Doe',
    url: 'https://example.com/forms',
  })
})
