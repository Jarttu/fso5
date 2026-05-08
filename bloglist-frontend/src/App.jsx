import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/notification'
import Togglable from './components/togglable'
import BlogForm from './components/blogForm'

const App = () => {
  	const [blogs, setBlogs] = useState([])
	const [user, setUser] = useState(null)

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const [notification, setNotification] = useState(null)
	const [notificationType, setNotificationType] = useState('success')

	const blogFormRef = useRef()

  	useEffect(() => {
    	blogService.getAll().then(blogs =>
    	  	setBlogs( blogs )
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

	const showNotification = (message, type = 'success') => {
		setNotification(message)
		setNotificationType(type)

		setTimeout(() => {
			setNotification(null)
		}, 3000)
	}

	const handleLogin = async (event) => {
		event.preventDefault()

		try {
			const user = await loginService.login({
				username, password,
			})

			setUser(user)

			blogService.setToken(user.token)

			window.localStorage.setItem(
				'loggedBlogappUser',
				JSON.stringify(user)
			)

			setUsername('')
			setPassword('')

			showNotification(`logged in ${user.name}`, 'success')
		}
		catch {
			showNotification('wrong username or password', 'error')
		}
	}

	const handleLogout = () => {
		window.localStorage.removeItem('loggedBlogappUser')
		setUser(null)

		showNotification('logged out', 'success')
	}

	const handleCreate = async (newBlog) => {

		if (!newBlog.title || !newBlog.author || !newBlog.url) {
  			showNotification('fill all fields', 'error')
  			return
		}

		try {
			const returnedBlog = await blogService.create(newBlog)

			const blogWithUser = {
				...returnedBlog,
				user: {
					id: user.id,
					username: user.username,
					name: user.name
				}
			}

			setBlogs(prevBlogs => prevBlogs.concat(blogWithUser))

			blogFormRef.current.toggleVisibility()

			showNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, 'success')
		}
		catch {
			showNotification('error creating blog', 'error')
		}
	}

	const handleLike = async (blog) => {
		const updatedBlog = {
			...blog,
			likes: blog.likes + 1,
			user: blog.user.id
		}

		const returnedBlog = await blogService.update(blog.id, updatedBlog)
		setBlogs(prev => prev.map(b => b.id !== blog.id ? b : returnedBlog))
		console.log('UPDATED BLOG RETURNED:', returnedBlog)
	}

	const handleDelete = async (blog) => {
		const confirmDelete = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
		if (!confirmDelete) {
			return
		}
		try {
			await blogService.remove(blog.id)

			setBlogs(blogs.filter(b => b.id !== blog.id))
			showNotification(`´Deleted ${blog.title} by ${blog.author}`, 'success')
		}
		catch {
			showNotification('error deleting blog', 'error')
		}
	}

	if (user === null) {
		return (
			<div>
				<h2>Log in to application</h2>
				<Notification message={notification} type={notificationType} />

				<form onSubmit={handleLogin}>
					<div>
						username
						<input
							value={username}
							onChange={({ target }) => setUsername(target.value)}
						/>
					</div>
					<div>
						password
						<input
							type="password"
							value={password}
							onChange={({ target }) => setPassword(target.value)}
						/>
					</div>
					<button type="submit">login</button>
				</form>
			</div>
		)
	}
	return (
		<div>
			<h2>blogs</h2>
			<Notification message={notification} type={notificationType} />
			<div>
				{user.name} logged in
				<button onClick={handleLogout}>logout</button>
			</div>

			<Togglable buttonLabel="create new blog" ref={blogFormRef}>
				<BlogForm createBlog={handleCreate} />
			</Togglable>

			{blogs.sort((a, b) => b.likes - a.likes).map(blog =>
				<Blog key={blog.id} blog={blog} handleLike={handleLike} handleDelete={handleDelete} user={user} />
			)}
		</div>
	)
}
export default App