import { test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Blog from './blog'

test('renders title and author', () => {
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
    render(<Blog blog={blog} />)

    expect(screen.getByText('Testjsx Blog Testjsx Author')).toBeInTheDocument()

    expect(screen.queryByText('http://testjsxblog.com')).toBeNull()
    expect(screen.queryByText('likes 5')).toBeNull()

})