import React, { Component } from 'react'
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
		this.setState({ [id]: value })
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

				this.setState({ errors: data.validationErrors })
				throw `il y a eu une p'tite erreur…`
			}
		} catch (error) {
			console.log(
				'🚀 ~ file: SignupPage.jsx ~ line 43 ~ SignupPage ~ error',
				error
			)
		}
	}

	render() {
		let disabled = true
		const { apiInProgress, errors, password, passwordConfirm, signupSuccess } =
			this.state

		if (password && passwordConfirm) {
			disabled = password !== passwordConfirm
		}

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
							<div className='mb-3'>
								<label className='form-label' htmlFor='username'>
									Username
								</label>
								<input
									className='form-control'
									id='username'
									onChange={this.onChange}
								/>
								<span>{errors.username}</span>
							</div>

							<div className='mb-3'>
								<label className='form-label' htmlFor='email'>
									Email
								</label>
								<input
									className='form-control'
									id='email'
									onChange={this.onChange}
								/>
							</div>

							<div className='mb-3'>
								<label className='form-label' htmlFor='password'>
									Password
								</label>
								<input
									className='form-control'
									id='password'
									type='password'
									onChange={this.onChange}
								/>
							</div>

							<div className='mb-4'>
								<label className='form-label' htmlFor='passwordConfirm'>
									Confirm Password
								</label>
								<input
									className='form-control'
									id='passwordConfirm'
									type='password'
									onChange={this.onChange}
								/>
							</div>

							<div className='text-center'>
								<button
									className='btn btn-primary'
									disabled={disabled || apiInProgress}
									onClick={this.submit}
									type='submit'>
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
