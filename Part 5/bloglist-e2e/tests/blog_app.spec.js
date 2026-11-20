const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, openBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen',
      },
    })

    await page.goto('/')
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
      await expect(page).toHaveURL('/')
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')

      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'E2E testing with Playwright', 'Mluukkai', 'https://playwright.dev/')

      await expect(page).toHaveURL('/')
      await expect(page.getByRole('link', { name: 'E2E testing with Playwright' })).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'A likeable blog', 'Mluukkai', 'https://example.com/like')
      await openBlog(page, 'A likeable blog')

      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('a blog can be deleted', async ({ page }) => {
      await createBlog(page, 'Blog to delete', 'Mluukkai', 'https://example.com/delete')
      await openBlog(page, 'Blog to delete')

      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page).toHaveURL('/')
      await expect(page.getByRole('link', { name: 'Blog to delete' })).toHaveCount(0)
    })
  })
})
