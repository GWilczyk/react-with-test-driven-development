import React from 'react'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import AccountActivationPage from './pages/AccountActivationPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import UserPage from './pages/UserPage'

import LanguageSelector from './components/LanguageSelector'
import logo from './assets/hoaxify.png'

function App() {
	const { t } = useTranslation()

	return (
		<Router>
			<nav className='navbar navbar-expand navbar-light bg-light shadow-sm'>
				<div className='container'>
					<Link className='navbar-brand' to='/' title='Home'>
						<img src={logo} alt='Hoaxify' width='60' />
						Hoaxify
					</Link>

					<ul className='navbar-nav'>
						<li className='nav-item'>
							<Link className='nav-link' to='/signup'>
								{t('signUp')}
							</Link>
						</li>
						<li className='nav-item'>
							<Link className='nav-link' to='/login'>
								{t('login')}
							</Link>
						</li>
					</ul>
				</div>
			</nav>

			<div className='container'>
				<Route exact path='/' component={HomePage} />
				<Route path='/activate/:token' component={AccountActivationPage} />
				<Route path='/login' component={LoginPage} />
				<Route path='/signup' component={SignupPage} />
				<Route path='/user/:id' component={UserPage} />
				<LanguageSelector />
			</div>
		</Router>
	)
}

export default App
