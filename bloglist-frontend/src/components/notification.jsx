const Notification = ({ message, type }) => {
	if (message === null) {
		return null
	}
	const baseStyle = {
		padding: '12px',
		marginBottom: '15px',
		borderRadius: '5px',
		fontSize: '16px',
		fontWeight: 'bold'
	}
	const errorStyle = {
		color: 'red',
		backgroundColor: 'rgb(255, 255, 255)',
		border: '2px solid red'
	}
	const successStyle = {
		color: 'green',
		backgroundColor: 'rgb(255, 255, 255)',
		border: '2px solid green'
	}

	const style = type === 'error'
		? { ...baseStyle, ...errorStyle }
		: { ...baseStyle, ...successStyle }

	return (
		<div style={style}>
			{message}
		</div>
	)
}
export default Notification