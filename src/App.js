import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import UserPage from './pages/UserPage'

import LanguageSelector from './components/LanguageSelector'
import logo from './assets/hoaxify.png'

function App() {
	const { t } = useTranslation()
	const [path, setPath] = useState(window.location.pathname)

	const onClickLink = event => {
		event.preventDefault()
		const _path = event.currentTarget.attributes.href.value
		window.history.pushState({}, '', _path)
		setPath(_path)
	}

	return (
		<>
			<nav className='navbar navbar-expand navbar-light bg-light shadow-sm'>
				<div className='container'>
					<a
						className='navbar-brand'
						href='/'
						title='Home'
						onClick={onClickLink}>
						<img src={logo} alt='Hoaxify' width='60' />
						Hoaxify
					</a>

					<ul className='navbar-nav'>
						<li className='nav-item'>
							<a className='nav-link' href='/signup' onClick={onClickLink}>
								{t('signUp')}
							</a>
						</li>
						<li className='nav-item'>
							<a className='nav-link' href='/login' onClick={onClickLink}>
								{t('login')}
							</a>
						</li>
					</ul>
				</div>
			</nav>

			<div className='container'>
				{path === '/' && <HomePage />}
				{path === '/login' && <LoginPage />}
				{path === '/signup' && <SignupPage />}
				{path.startsWith('/user/') && <UserPage />}
				<LanguageSelector />
			</div>
		</>
	)
}

export default App
