/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { activate } from '../api/apiCalls'
import Alert from '../components/Alert'
import Spinner from '../components/Spinner'

const AccountActivationPage = ({ match }) => {
	const [result, setResult] = useState('')

	useEffect(() => {
		setResult('')

		activate(match.params.token)
			.then(response => {
				if (response.ok) {
					setResult('success')
				} else {
					setResult('failed')
				}
			})
			.catch(() => setResult('failed'))
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
