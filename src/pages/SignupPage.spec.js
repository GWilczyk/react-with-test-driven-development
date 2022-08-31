import React from 'react'
import {
	act,
	render,
	screen,
	waitFor,
	waitForElementToBeRemoved,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
// import axios from 'axios'
import { setupServer } from 'msw/node'
import { rest } from 'msw'

import SignupPage from './SignupPage'
import LanguageSelector from '../components/LanguageSelector'
import i18n from '../locales/i18n'
import en from '../locales/en.json'
import fr from '../locales/fr.json'

let acceptLanguageHeader
let counter = 0
let requestBody

const server = setupServer(
	rest.post('/api/1.0/users', (req, res, ctx) => {
		acceptLanguageHeader = req.headers.get('Accept-Language')
		counter += 1
		requestBody = req.body
		return res(ctx.status(200))
	})
)

beforeEach(() => {
	counter = 0
	server.resetHandlers()
})
beforeAll(() => server.listen())
afterAll(() => server.close())

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

	describe('Internationalization', () => {
		let englishToggle, frenchToggle, passwordInput, passwordConfirmInput

		const setup = () => {
			render(
				<>
					<SignupPage />
					<LanguageSelector />
				</>
			)

			frenchToggle = screen.getByTitle('Français')
			englishToggle = screen.getByTitle('English')
			passwordInput = screen.getByLabelText(en.password)
			passwordConfirmInput = screen.getByLabelText(en.passwordConfirm)
		}

		afterEach(() => {
			act(() => {
				i18n.changeLanguage('en')
			})
		})

		it('initially displays all text in English', () => {
			setup()

			expect(
				screen.getByRole('heading', { name: en.signUp })
			).toBeInTheDocument()
			expect(
				screen.getByRole('button', { name: en.signUp })
			).toBeInTheDocument()
			expect(screen.getByLabelText(en.username)).toBeInTheDocument()
			expect(screen.getByLabelText(en.email)).toBeInTheDocument()
			expect(screen.getByLabelText(en.password)).toBeInTheDocument()
			expect(screen.getByLabelText(en.passwordConfirm)).toBeInTheDocument()
		})

		it('displays all text in French after changing the language', () => {
			setup()
			userEvent.click(frenchToggle)

			expect(
				screen.getByRole('heading', { name: fr.signUp })
			).toBeInTheDocument()
			expect(
				screen.getByRole('button', { name: fr.signUp })
			).toBeInTheDocument()
			expect(screen.getByLabelText(fr.username)).toBeInTheDocument()
			expect(screen.getByLabelText(fr.email)).toBeInTheDocument()
			expect(screen.getByLabelText(fr.password)).toBeInTheDocument()
			expect(screen.getByLabelText(fr.passwordConfirm)).toBeInTheDocument()
		})

		it('displays all text in English after changing back from French', () => {
			setup()
			userEvent.click(frenchToggle)
			userEvent.click(englishToggle)

			expect(
				screen.getByRole('heading', { name: en.signUp })
			).toBeInTheDocument()
			expect(
				screen.getByRole('button', { name: en.signUp })
			).toBeInTheDocument()
			expect(screen.getByLabelText(en.username)).toBeInTheDocument()
			expect(screen.getByLabelText(en.email)).toBeInTheDocument()
			expect(screen.getByLabelText(en.password)).toBeInTheDocument()
			expect(screen.getByLabelText(en.passwordConfirm)).toBeInTheDocument()
		})

		it('displays password mismatch validation in French', () => {
			setup()
			userEvent.click(frenchToggle)
			userEvent.type(passwordInput, 'P4ss')
			const validationMessageInFrench = screen.queryByText(
				fr.passwordMismatchValidation
			)
			expect(validationMessageInFrench).toBeInTheDocument()
		})

		it('sends accept language header as "en" for outgoing request', async () => {
			setup()
			userEvent.type(passwordInput, 'P4ssword')
			userEvent.type(passwordConfirmInput, 'P4ssword')

			const button = screen.getByRole('button', { name: en.signUp })
			const form = screen.queryByTestId('form-signup')

			userEvent.click(button)
			await waitForElementToBeRemoved(form)

			expect(acceptLanguageHeader).toBe('en')
		})

		it('sends accept language header as "fr" for outgoing request after selecting that language', async () => {
			setup()
			userEvent.type(passwordInput, 'P4ssword')
			userEvent.type(passwordConfirmInput, 'P4ssword')

			const button = screen.getByRole('button', { name: en.signUp })
			const form = screen.queryByTestId('form-signup')

			userEvent.click(frenchToggle)
			userEvent.click(button)
			await waitForElementToBeRemoved(form)

			expect(acceptLanguageHeader).toBe('fr')
		})
	})
})
