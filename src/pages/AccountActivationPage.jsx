import React, { useEffect, useState } from 'react'
import { object } from 'prop-types'

import { activate } from '../api/apiCalls'

import Alert from '../components/Alert'
import Spinner from '../components/Spinner'

const AccountActivationPage = ({ match }) => {
	const [result, setResult] = useState('')

	useEffect(() => {
		async function activateRequest() {
			setResult('')
			try {
				const response = await activate(match.params.token)

				if (response.ok) {
					setResult('success')
				} else {
					throw 'Activation failure'
				}
			} catch (error) {
				setResult('failed')
			}
		}

		activateRequest()
	}, [match.params.token])

	let content = (
		<Alert center={true} type='secondary'>
			<Spinner />
		</Alert>
	)

	if (result === 'success') {
		content = <Alert>Account is activated</Alert>
	} else if (result === 'failed') {
		content = <Alert type='danger'>Activation failure</Alert>
	}

	return <div data-testid='activation-page'>{content}</div>
}

export default AccountActivationPage

AccountActivationPage.propTypes = {
	match: object.isRequired,
}
