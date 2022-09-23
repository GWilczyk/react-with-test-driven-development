import React from 'react'
import { withRouter } from 'react-router-dom'
import { object } from 'prop-types'
import defaultProfileImage from '../assets/profile.png'

const UserListItem = ({ history, user: { id, username } }) => {
	return (
		<li
			className='list-group-item list-group-item-action'
			onClick={() => history.push(`/user/${id}`)}
			style={{ cursor: 'pointer' }}>
			<img
				className='rounded-circle shadow-sm me-3'
				src={defaultProfileImage}
				alt='profile'
				width='30'
			/>
			{username}
		</li>
	)
}

export default withRouter(UserListItem)

UserListItem.propTypes = {
	history: object.isRequired,
	user: object.isRequired,
}
