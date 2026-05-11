import { test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './Blogform'

const blog = {
    title: 'Testjsx Blog',
    author: 'Testjsx Author',
    url: 'http://testjsxblog.com',
    likes: 5,
    user: {
        username: 'testjsxuser',
        name: 'Testjsx User',
        id: '12345'
    }
}
const user = {
    username: 'testjsxuser',
    name: 'Testjsx User',
}

test('renders title and author', () => {

    render(<Blog blog={blog} user={user} handleLike={() => {}} handleDelete={() => {}} />)

    const titleAuthor = screen.getByText(/Testjsx Blog.*Testjsx Author/i)
    expect(titleAuthor).toBeInTheDocument()

    expect(screen.queryByText('http://testjsxblog.com')).toBeNull()
    expect(screen.queryByText(/likes 5/i)).toBeNull()

})
test('renders url and likes when view button is clicked', async () => {
    const userEv = userEvent.setup()
    render(<Blog blog={blog} user={user} handleLike={() => {}} handleDelete={() => {}} />)

    const button = screen.getByText('view')
    await userEv.click(button)

    expect(screen.getByText('http://testjsxblog.com')).toBeInTheDocument()
    expect(screen.getByText('likes 5')).toBeInTheDocument()
    expect(screen.getByText('Testjsx User')).toBeInTheDocument()
})

test('calls handleLike twice when like button is clicked twice', async () => {
    const userEv = userEvent.setup()
    const handleLike = vi.fn()
    render(<Blog blog={blog} user={user} handleLike={handleLike} handleDelete={() => {}} />)

    await userEv.click(screen.getByText('view'))

    const likeButton = screen.getByText('like')
    await userEv.click(likeButton)
    await userEv.click(likeButton)

    expect(handleLike).toHaveBeenCalledTimes(2)
})
test('calls createBlog with correct details when form is submitted', async () => {
    const userEv = userEvent.setup()
    const createBlog = vi.fn()
    render(<BlogForm createBlog={createBlog} />)
    
    const inputs = screen.getAllByRole('textbox')
    
    const titleInput = inputs[0]
    const authorInput = inputs[1]
    const urlInput = inputs[2]

    const submitButton = screen.getByText('create')

    await userEv.type(titleInput, 'Jsx createtester blog')
    await userEv.type(authorInput, 'Jsx createtester')
    await userEv.type(urlInput, 'http://jsxcreatetesterblog.com')
    await userEv.click(submitButton)

    expect(createBlog).toHaveBeenCalledTimes(1)
    expect(createBlog).toHaveBeenCalledWith({
        title: 'Jsx createtester blog',
        author: 'Jsx createtester',
        url: 'http://jsxcreatetesterblog.com'
    })
})