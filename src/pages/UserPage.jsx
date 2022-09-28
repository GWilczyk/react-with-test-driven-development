import React, { useEffect, useState } from 'react'
import { object } from 'prop-types'

import { getUserById } from '../api/apiCalls'

import Alert from '../components/Alert'
import ProfileCard from '../components/ProfileCard'
import Spinner from '../components/Spinner'

const UserPage = ({ match }) => {
	const [loading, setLoading] = useState(true)
	const [user, setUser] = useState({})

	useEffect(() => {
		async function getUserByIdRequest() {
			setLoading(true)
			setUser({})
			try {
				const response = await getUserById(match.params.id)

				if (response.ok) {
					const data = await response.json()
					setUser(data)
					setLoading(false)
				} else {
					throw new Error('User not found')
				}
			} catch (error) {
				setUser({})
				setLoading(false)
			}
		}

		getUserByIdRequest()
	}, [match.params.id])

	return (
		<div data-testid='user-page'>
			{loading ? (
				<Alert center={true} type='secondary'>
					<Spinner />
				</Alert>
			) : (
				<ProfileCard user={user} />
			)}
		</div>
	)
}

export default UserPage

UserPage.propTypes = {
	match: object.isRequired,
}
