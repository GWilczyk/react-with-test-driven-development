import React, { useEffect, useState } from 'react'
import { object } from 'prop-types'

import { getUserById } from '../api/apiCalls'

import Alert from '../components/Alert'
import ProfileCard from '../components/ProfileCard'
import Spinner from '../components/Spinner'

const UserPage = ({ match }) => {
	const [loading, setLoading] = useState(true)
	const [user, setUser] = useState({})
	const [errorMessage, setErrorMessage] = useState('')

	useEffect(() => {
		async function getUserByIdRequest() {
			setLoading(true)
			setErrorMessage('')
			setUser({})
			try {
				const response = await getUserById(match.params.id)

				if (response.ok) {
					const data = await response.json()
					setUser(data)
					setLoading(false)
				} else if (response.status === 404) {
					const { message } = await response.json()
					setErrorMessage(message)
					throw new Error(message)
				}
			} catch (error) {
				setUser({})
				setLoading(false)
			}
		}

		getUserByIdRequest()
	}, [match.params.id])

	let content = (
		<Alert center type='secondary'>
			<Spinner />
		</Alert>
	)

	if (!loading) {
		if (errorMessage) {
			content = (
				<Alert center type='danger'>
					{errorMessage}
				</Alert>
			)
		} else {
			content = <ProfileCard user={user} />
		}
	}

	return <div data-testid='user-page'>{content}</div>
}

export default UserPage

UserPage.propTypes = {
	match: object.isRequired,
}
