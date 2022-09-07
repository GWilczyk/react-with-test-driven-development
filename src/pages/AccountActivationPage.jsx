/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { activate } from '../api/apiCalls'

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

	let content = <span className='spinner-border' role='status' />

	if (result === 'success') {
		content = (
			<div className='alert alert-success mt-3'>Account is activated</div>
		)
	} else if (result === 'failed') {
		content = <div className='alert alert-danger mt-3'>Activation failure</div>
	}

	return <div data-testid='activation-page'>{content}</div>
}

export default AccountActivationPage
