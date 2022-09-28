import React, { useEffect, useState } from 'react'
import { object } from 'prop-types'

import { getUserById } from '../api/apiCalls'

import ProfileCard from '../components/ProfileCard'

const UserPage = ({ match }) => {
	const [user, setUser] = useState({})

	useEffect(() => {
		async function getUserByIdRequest() {
			setUser({})
			try {
				const response = await getUserById(match.params.id)

				if (response.ok) {
					const data = await response.json()
					setUser(data)
				} else {
					throw new Error('User not found')
				}
			} catch (error) {
				setUser({})
			}
		}

		getUserByIdRequest()
	}, [match.params.id])

	return (
		<div data-testid='user-page'>
			<ProfileCard user={user} />
		</div>
	)
}

export default UserPage

UserPage.propTypes = {
	match: object.isRequired,
}
