import { Component, Fragment } from 'react'

class SignupPage extends Component {
	state = {
		password: '',
		passwordConfirm: '',
	}

	onChangePassword = event => {
		const currentValue = event.target.value
		this.setState({ password: currentValue })
	}

	onChangePasswordConfirm = event => {
		const currentValue = event.target.value
		this.setState({ passwordConfirm: currentValue })
	}

	render() {
		let disabled = true
		const { password, passwordConfirm } = this.state

		if (password && passwordConfirm) {
			disabled = password !== passwordConfirm
		}

		return (
			<Fragment>
				<h1>Sign Up</h1>
				<label htmlFor='username'>Username</label>
				<input id='username' />

				<label htmlFor='email'>Email</label>
				<input id='email' />

				<label htmlFor='password'>Password</label>
				<input id='password' type='password' onChange={this.onChangePassword} />

				<label htmlFor='passwordConfirm'>Confirm Password</label>
				<input
					id='passwordConfirm'
					type='password'
					onChange={this.onChangePasswordConfirm}
				/>

				<button disabled={disabled}>Sign Up</button>
			</Fragment>
		)
	}
}

export default SignupPage
