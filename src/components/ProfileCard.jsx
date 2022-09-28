import React from 'react'
import { object } from 'prop-types'

import defaultProfileImage from '../assets/profile.png'

const ProfileCard = ({ user: { username } }) => {
	return (
		<div className='card text-center'>
			<div className='card-header'>
				<img
					className='rounded-circle shadow'
					src={defaultProfileImage}
					alt='profile'
					height='200'
					width='200'
				/>
			</div>

			<div className='card-body'>
				<h3>{username}</h3>
			</div>
		</div>
	)
}

export default ProfileCard

ProfileCard.propTypes = {
	user: object.isRequired,
}
