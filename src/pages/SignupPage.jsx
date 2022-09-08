/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { signup } from '../api/apiCalls'

import Alert from '../components/Alert'
import Input from '../components/Input'
import Spinner from '../components/Spinner'

class SignupPage extends Component {
	state = {
		apiInProgress: false,
		email: '',
		errors: {},
		password: '',
		passwordConfirm: '',
		signupSuccess: false,
		username: '',
	}

	onChange = event => {
		const { id, value } = event.target

		const errorsCopy = { ...this.state.errors }
		delete errorsCopy[id]

		this.setState({
			[id]: value,
			errors: errorsCopy,
		})
	}

	submit = async event => {
		event.preventDefault()
		const { username, email, password } = this.state
		const body = { username, email, password }

		this.setState({ apiInProgress: true })

		try {
			const response = await signup(body)

			if (response.ok) {
				this.setState({ apiInProgress: false, signupSuccess: true })
			} else {
				const data = await response.json()
				this.setState({ errors: data.validationErrors })
				throw new Error('Submit failed')
			}
		} catch (error) {
			this.setState({ apiInProgress: false })
		}
	}

	render() {
		const { t } = this.props
		const { apiInProgress, errors, password, passwordConfirm, signupSuccess } =
			this.state

		let disabled = true
		if (password && passwordConfirm) {
			disabled = password !== passwordConfirm
		}

		const passwordMismatch =
			password !== passwordConfirm ? t('passwordMismatchValidation') : ''

		return (
			<div
				className='col-md-8 offset-md-2 col-lg-6 offset-lg-3'
				data-testid='signup-page'>
				{signupSuccess ? (
					<Alert>Please check your email to activate your account!</Alert>
				) : (
					<form className='card' data-testid='form-signup'>
						<div className='card-header'>
							<h1 className='text-center my-3'>{t('signUp')}</h1>
						</div>
						<div className='card-body'>
							<Input
								help={errors.username}
								id='username'
								label={t('username')}
								onChange={this.onChange}
							/>

							<Input
								help={errors.email}
								id='email'
								label={t('email')}
								onChange={this.onChange}
							/>

							<Input
								help={errors.password}
								id='password'
								label={t('password')}
								onChange={this.onChange}
								type='password'
							/>

							<Input
								help={passwordMismatch}
								id='passwordConfirm'
								label={t('passwordConfirm')}
								onChange={this.onChange}
								type='password'
							/>

							<div className='text-center'>
								<button
									className='btn btn-primary'
									disabled={disabled || apiInProgress}
									onClick={this.submit}>
									{apiInProgress && <Spinner size='small' />}
									{t('signUp')}
								</button>
							</div>
						</div>
					</form>
				)}
			</div>
		)
	}
}

export default withTranslation()(SignupPage)
