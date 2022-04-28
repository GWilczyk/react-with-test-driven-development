import SignupPage from './SignupPage'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
// import axios from 'axios'
import { setupServer } from 'msw/node'
import { rest } from 'msw'

describe('Signup Page', () => {
	describe('Layout', () => {
		it('has header', () => {
			render(<SignupPage />)
			const header = screen.queryByRole('heading', { name: 'Sign Up' })
			expect(header).toBeInTheDocument()
		})
		it('has username input', () => {
			render(<SignupPage />)
			const input = screen.getByLabelText('Username')
			expect(input).toBeInTheDocument()
		})
		it('has email input', () => {
			render(<SignupPage />)
			const input = screen.getByLabelText('Email')
			expect(input).toBeInTheDocument()
		})
		it('has password input', () => {
			render(<SignupPage />)
			const input = screen.getByLabelText('Password')
			expect(input).toBeInTheDocument()
		})
		it('has password type for password input', () => {
			render(<SignupPage />)
			const input = screen.getByLabelText('Password')
			expect(input.type).toBe('password')
		})
		it('has password confirm input', () => {
			render(<SignupPage />)
			const input = screen.getByLabelText('Confirm Password')
			expect(input).toBeInTheDocument()
		})
		it('has password type for password confirm input', () => {
			render(<SignupPage />)
			const input = screen.getByLabelText('Confirm Password')
			expect(input.type).toBe('password')
		})
		it('has Signup button', () => {
			render(<SignupPage />)
			const button = screen.queryByRole('button', { name: 'Sign Up' })
			expect(button).toBeInTheDocument()
		})
		it('disables the button initially', () => {
			render(<SignupPage />)
			const button = screen.queryByRole('button', { name: 'Sign Up' })
			expect(button).toBeDisabled()
		})
	})
	describe('Interactions', () => {
		it('enables the button when password and confirm password have same value', () => {
			render(<SignupPage />)
			const passwordInput = screen.getByLabelText('Password')
			const passwordConfirmInput = screen.getByLabelText('Confirm Password')
			userEvent.type(passwordInput, 'P4ssw0rd')
			userEvent.type(passwordConfirmInput, 'P4ssw0rd')
			const button = screen.queryByRole('button', { name: 'Sign Up' })
			expect(button).toBeEnabled()
		})
		it('sends username, email and password to backend after clicking the button', async () => {
			let requestBody
			const server = setupServer(
				rest.post('/api/1.0/users', (req, res, ctx) => {
					requestBody = req.body
					return res(ctx.status(200))
				})
			)
			server.listen()
			render(<SignupPage />)
			const usernameInput = screen.getByLabelText('Username')
			const emailInput = screen.getByLabelText('Email')
			const passwordInput = screen.getByLabelText('Password')
			const passwordConfirmInput = screen.getByLabelText('Confirm Password')
			const button = screen.queryByRole('button', { name: 'Sign Up' })

			userEvent.type(usernameInput, 'user1')
			userEvent.type(emailInput, 'user1@mail.com')
			userEvent.type(passwordInput, 'P4ssword')
			userEvent.type(passwordConfirmInput, 'P4ssword')

			userEvent.click(button)
			await new Promise(resolve => setTimeout(resolve, 500))

			expect(requestBody).toEqual({
				username: 'user1',
				email: 'user1@mail.com',
				password: 'P4ssword',
			})
		})
	})
})
