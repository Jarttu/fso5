const Blog = ({ blog }) => {
	return (	
		<div>
			{blog.title} <br />
			{blog.author} <br />
			<a href={blog.url} target="_blank" rel="noreferrer">
				{blog.url}
			</a>
		</div>
	)
}

export default Blog