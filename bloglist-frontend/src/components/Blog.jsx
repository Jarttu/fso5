import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete, user }) => {
	const [visible, setVisible] = useState(false)

	const toggleVisibility = () => {
		setVisible(!visible)
	}

	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 5,
		border: 'solid',
		borderWidth: 1,
		marginBottom: 5
	}

	const showDeleteButton =
		blog.user &&
		user &&
		blog.user.username === user.username

	return (
		<div style={blogStyle}>
			<div>
				{blog.title} <br/>
				{blog.author}
				<button onClick={toggleVisibility}>
					{visible ? 'hide' : 'view'}
				</button>
			</div>
			{visible && (
				<div>
					<div>{blog.url}</div>
					<div>
						likes {blog.likes}
						<button onClick={() => handleLike(blog)}>like</button>
					</div>
					<div>{blog.user?.name}</div>
					{showDeleteButton && (
						<button onClick={() => handleDelete(blog)}>delete</button>
					)}

				</div>
			)}
		</div>
	)
}

export default Blog