import React, { Component } from 'react'
import Input from '../components/Input'
// import axios from 'axios'

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
			const response = await fetch('/api/1.0/users', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			})

			if (response.status === 200) {
				this.setState({ signupSuccess: true })
			} else if (response.status === 400) {
				const data = await response.json()

				this.setState({ apiInProgress: false, errors: data.validationErrors })

				throw new Error(data.message)
			}
		} catch (error) {
			// console.error(error)
		}
	}

	render() {
		const { apiInProgress, errors, password, passwordConfirm, signupSuccess } =
			this.state

		let disabled = true
		if (password && passwordConfirm) {
			disabled = password !== passwordConfirm
		}

		const passwordMismatch =
			password !== passwordConfirm ? 'Password mismatch' : ''

		return (
			<div className='col-md-8 offset-md-2 col-lg-6 offset-lg-3'>
				{signupSuccess ? (
					<div className='alert alert-success mt-3'>
						Please check your email to activate your account!
					</div>
				) : (
					<form className='card mt-5' data-testid='form-signup'>
						<div className='card-header'>
							<h1 className='text-center my-3'>Sign Up</h1>
						</div>
						<div className='card-body'>
							<Input
								help={errors.username}
								id='username'
								label='Username'
								onChange={this.onChange}
							/>

							<Input
								help={errors.email}
								id='email'
								label='E-mail'
								onChange={this.onChange}
							/>

							<Input
								help={errors.password}
								id='password'
								label='Password'
								onChange={this.onChange}
								type='password'
							/>

							<Input
								help={passwordMismatch}
								id='passwordConfirm'
								label='Confirm Password'
								onChange={this.onChange}
								type='password'
							/>

							<div className='text-center'>
								<button
									className='btn btn-primary'
									disabled={disabled || apiInProgress}
									onClick={this.submit}>
									{apiInProgress && (
										<span
											className='spinner-border spinner-border-sm'
											role='status'></span>
									)}
									Sign Up
								</button>
							</div>
						</div>
					</form>
				)}
			</div>
		)
	}
}

export default SignupPage
