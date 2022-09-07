/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { activate } from '../api/apiCalls'

const AccountActivationPage = ({ match }) => {
	const [result, setResult] = useState('')

	useEffect(() => {
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

	return (
		<div data-testid='activation-page'>
			{result === 'success' && (
				<div className='alert alert-success mt-3'>Account is activated</div>
			)}
			{result === 'failed' && (
				<div className='alert alert-danger mt-3'>Activation failure</div>
			)}
		</div>
	)
}

export default AccountActivationPage
