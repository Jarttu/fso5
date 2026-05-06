import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/notification'
import Togglable from './components/togglable'
const App = () => {
  	const [blogs, setBlogs] = useState([])
	const [user, setUser] = useState(null)

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const [title, setTitle] = useState('')
	const [author, setAuthor] = useState('')
	const [url, setUrl] = useState('')

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
		catch (error) {
			showNotification('wrong username or password', 'error')
		}
	}

	const handleLogout = () => {
		window.localStorage.removeItem('loggedBlogappUser')
		setUser(null)

		showNotification('logged out', 'success')
	}

	const handleCreate = async (event) => {
		event.preventDefault()
		
		if (!title || !author || !url) {
  			showNotification('fill all fields', 'error')
  			return
		}

		try {
			const newBlog ={
				title, author, url
			}
			const returnedBlog = await blogService.create(newBlog)
			setBlogs(blogs.concat(returnedBlog))

			setTitle('')
			setAuthor('')
			setUrl('')
			
			blogFormRef.current.toggleVisibility()

			showNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, 'success')
		}
		catch (error) {
			showNotification('error creating blog', 'error')
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
				<h3>create new</h3>

				<form onSubmit={handleCreate}>
					<div>
						title
						<input
							value={title}
							onChange={({ target }) => setTitle(target.value)}
						/>
					</div>
					<div>
						author
						<input
							value={author}
							onChange={({ target }) => setAuthor(target.value)}
						/>
					</div>
					<div>
						url
						<input
							value={url}
							onChange={({ target }) => setUrl(target.value)}
						/>
					</div>
					<button type="submit">create</button>
				</form>
			</Togglable>
			{blogs.map(blog =>
				<Blog key={blog.id} blog={blog} />
			)}
		</div>
	)
}
export default App