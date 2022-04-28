import { Component, Fragment } from 'react'
// import axios from 'axios'

class SignupPage extends Component {
	state = {
		username: '',
		email: '',
		password: '',
		passwordConfirm: '',
	}

	onChange = event => {
		const { id, value } = event.target
		this.setState({ [id]: value })
	}

	submit = event => {
		event.preventDefault()
		const { username, email, password } = this.state
		const body = { username, email, password }

		/* axios.post('/api/1.0/users', body) */
		fetch('/api/1.0/users', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		})
	}

	render() {
		let disabled = true
		const { password, passwordConfirm } = this.state

		if (password && passwordConfirm) {
			disabled = password !== passwordConfirm
		}

		return (
			<Fragment>
				<form>
					<h1>Sign Up</h1>
					<label htmlFor='username'>Username</label>
					<input id='username' onChange={this.onChange} />

					<label htmlFor='email'>Email</label>
					<input id='email' onChange={this.onChange} />

					<label htmlFor='password'>Password</label>
					<input id='password' type='password' onChange={this.onChange} />

					<label htmlFor='passwordConfirm'>Confirm Password</label>
					<input
						id='passwordConfirm'
						type='password'
						onChange={this.onChange}
					/>

					<button disabled={disabled} onClick={this.submit}>
						Sign Up
					</button>
				</form>
			</Fragment>
		)
	}
}

export default SignupPage
