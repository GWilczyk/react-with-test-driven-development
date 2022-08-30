import React from 'react'
import {
	render,
	screen,
	waitFor,
	// waitForElementToBeRemoved,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
// import axios from 'axios'
import { setupServer } from 'msw/node'
import { rest } from 'msw'

import SignupPage from './SignupPage'

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
			const input = screen.getByLabelText('E-mail')
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
		let button, emailInput, passwordInput, passwordConfirmInput, usernameInput
		let counter = 0
		let requestBody

		const server = setupServer(
			rest.post('/api/1.0/users', (req, res, ctx) => {
				counter += 1
				requestBody = req.body
				return res(ctx.status(200))
			})
		)

		const setup = () => {
			render(<SignupPage />)

			usernameInput = screen.getByLabelText('Username')
			emailInput = screen.getByLabelText('E-mail')
			passwordInput = screen.getByLabelText('Password')
			passwordConfirmInput = screen.getByLabelText('Confirm Password')
			button = screen.queryByRole('button', { name: 'Sign Up' })

			userEvent.type(usernameInput, 'user1')
			userEvent.type(emailInput, 'user1@mail.com')
			userEvent.type(passwordInput, 'P4ssword')
			userEvent.type(passwordConfirmInput, 'P4ssword')
		}

		beforeEach(() => {
			counter = 0
			server.resetHandlers()
		})
		beforeAll(() => server.listen())
		afterAll(() => server.close())

		it('enables the button when password and confirm password have same value', () => {
			setup()

			expect(button).toBeEnabled()
		})

		it('sends username, email and password to backend after clicking the button', async () => {
			setup()

			userEvent.click(button)

			await screen.findByText(
				'Please check your email to activate your account!'
			)
			expect(requestBody).toEqual({
				username: 'user1',
				email: 'user1@mail.com',
				password: 'P4ssword',
			})
		})

		it('disables button when there is an ongoing api call', async () => {
			setup()

			userEvent.click(button)
			userEvent.click(button)

			await screen.findByText(
				'Please check your email to activate your account!'
			)
			expect(counter).toBe(1)
		})

		it('displays spinner after clicking the submit', async () => {
			setup()

			expect(screen.queryByRole('status')).not.toBeInTheDocument()
			userEvent.click(button)
			const spinner = screen.getByRole('status')
			expect(spinner).toBeInTheDocument()
			await screen.findByText(
				'Please check your email to activate your account!'
			)
		})

		it('displays account activation notification after successful sign up request', async () => {
			setup()

			const message = 'Please check your email to activate your account!'
			expect(screen.queryByText(message)).not.toBeInTheDocument()
			userEvent.click(button)
			expect(await screen.findByText(message)).toBeInTheDocument()
		})

		it('hides sign up form after successful sign up request', async () => {
			setup()

			const form = screen.getByTestId('form-signup')
			userEvent.click(button)
			await waitFor(() => {
				expect(form).not.toBeInTheDocument()
			})
			// await waitForElementToBeRemoved(form)
		})

		const generateValidationError = (field, message) => {
			return rest.post('/api/1.0/users', (req, res, ctx) => {
				return res(
					ctx.status(400),
					ctx.json({
						validationErrors: { [field]: message },
					})
				)
			})
		}

		it.each`
			field         | message
			${'username'} | ${'Username cannot be null'}
			${'email'}    | ${'E-mail cannot be null'}
			${'password'} | ${'Password cannot be null'}
		`('displays $message for $field', async ({ field, message }) => {
			server.use(generateValidationError(field, message))
			setup()
			userEvent.click(button)
			const validationError = await screen.findByText(message)
			expect(validationError).toBeInTheDocument()
		})

		it('hides spinner and enables button after response received', async () => {
			server.use(generateValidationError('username', 'Username cannot be null'))
			setup()
			userEvent.click(button)
			await screen.findByText('Username cannot be null')

			expect(screen.queryByRole('status')).not.toBeInTheDocument()
			expect(button).toBeEnabled()
		})

		it('displays mismatch message for password confirm input', () => {
			setup()
			userEvent.type(passwordInput, 'P4ssword')
			userEvent.type(passwordConfirmInput, 'anotherOne')
			const validationError = screen.queryByText('Password mismatch')
			expect(validationError).toBeInTheDocument()
		})

		it.each`
			field         | message                      | label
			${'username'} | ${'Username cannot be null'} | ${'Username'}
			${'email'}    | ${'E-mail cannot be null'}   | ${'E-mail'}
			${'password'} | ${'Password cannot be null'} | ${'Password'}
		`(
			'clears validation error after $field field is updated',
			async ({ field, message, label }) => {
				server.use(generateValidationError(field, message))
				setup()
				userEvent.click(button)
				const validationError = await screen.findByText(message)
				userEvent.type(screen.getByLabelText(label), 'field-updated')
				expect(validationError).not.toBeInTheDocument()
			}
		)
	})
})
