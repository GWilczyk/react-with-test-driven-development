import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from './App'

describe('Routing', () => {
	const setup = path => {
		window.history.pushState({}, '', path)
		render(<App />)
	}

	it.each`
		path         | pageTestId
		${'/'}       | ${'home-page'}
		${'/signup'} | ${'signup-page'}
		${'/login'}  | ${'login-page'}
		${'/user/1'} | ${'user-page'}
		${'/user/2'} | ${'user-page'}
	`('displays $pageTestId when path is $path', ({ path, pageTestId }) => {
		setup(path)
		const page = screen.queryByTestId(pageTestId)
		expect(page).toBeInTheDocument()
	})

	it.each`
		path         | pageTestId
		${'/'}       | ${'login-page'}
		${'/'}       | ${'signup-page'}
		${'/'}       | ${'user-page'}
		${'/login'}  | ${'home-page'}
		${'/login'}  | ${'signup-page'}
		${'/login'}  | ${'user-page'}
		${'/signup'} | ${'home-page'}
		${'/signup'} | ${'login-page'}
		${'/signup'} | ${'user-page'}
		${'/user/1'} | ${'home-page'}
		${'/user/1'} | ${'login-page'}
		${'/user/1'} | ${'signup-page'}
	`(
		'does not display $pageTestId when path is $path',
		({ path, pageTestId }) => {
			setup(path)
			const page = screen.queryByTestId(pageTestId)
			expect(page).not.toBeInTheDocument()
		}
	)

	it.each`
		targetPage
		${'Home'}
		${'Sign Up'}
		${'Login'}
	`('has link to $targetPage on NavBar', ({ targetPage }) => {
		setup('/')
		const link = screen.getByRole('link', { name: targetPage })
		expect(link).toBeInTheDocument()
	})

	it.each`
		initialPath  | clickingTo   | visiblePage
		${'/'}       | ${'Sign Up'} | ${'signup-page'}
		${'/signup'} | ${'Home'}    | ${'home-page'}
		${'/'}       | ${'Login'}   | ${'login-page'}
	`(
		'displays $visiblePage after clicking $clickingTo link',
		({ initialPath, clickingTo, visiblePage }) => {
			setup(initialPath)
			const link = screen.getByRole('link', { name: clickingTo })
			userEvent.click(link)
			expect(screen.getByTestId(visiblePage)).toBeInTheDocument()
		}
	)

	it('displays homepage when clicking brand logo', () => {
		setup('/login')
		const logo = screen.queryByAltText('Hoaxify')
		userEvent.click(logo)
		expect(screen.getByTestId('home-page')).toBeInTheDocument()
	})
})
