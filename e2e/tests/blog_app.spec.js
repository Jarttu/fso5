const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3003/api/testing/reset')

        await request.post('http://localhost:3003/api/users', {
            data: {
                username: 'testuser',
                name: 'Test User',
                password: 'testpassword'
            }
        })
        await page.goto('http://localhost:5173')
    })

    test('Login form is shown', async ({ page }) => {
        await expect(page.getByText('Log in to application')).toBeVisible()
        await expect(page.getByText('Username')).toBeVisible()
        await expect(page.getByText('Password')).toBeVisible()
        await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
    })
    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await page.getByRole('textbox').first().fill('testuser')
            await page.getByRole('textbox').last().fill('testpassword')
            await page.getByRole('button', { name: 'login' }).click()

            await expect(page.getByText('Test User logged in')).toBeVisible()
        })
        test('fails with wrong credentials', async ({ page }) => {
            await page.getByRole('textbox').first().fill('testuser')
            await page.getByRole('textbox').last().fill('wrongtestpassword')
            await page.getByRole('button', { name: 'login' }).click()
            await expect(page.getByText('Wrong username or password')).toBeVisible()
        })
    })
    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await page.getByRole('textbox').first().fill('testuser')
            await page.getByRole('textbox').last().fill('testpassword')
            await page.getByRole('button', { name: 'login' }).click()

            await expect(page.getByText('Test User logged in')).toBeVisible()
        })
        test('A blog can be created', async ({ page }) => {
            await page.getByRole('button', { name: 'create new blog' }).click()

            await page.getByRole('textbox').first().fill('e2eTest Blog')
            await page.getByRole('textbox').nth(1).fill('e2eTest Blog Author')
            await page.getByRole('textbox').nth(2).fill('http://e2etestblogurl.com')
            await page.getByRole('button', { name: 'create' }).click()

            await expect(page.getByText('e2eTest Blog').first()).toBeVisible()
            await expect(page.getByText('e2eTest Blog Author').first()).toBeVisible()
        })
    })
})