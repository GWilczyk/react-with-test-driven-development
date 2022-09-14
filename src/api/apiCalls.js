// import axios from 'axios'
import i18n from '../locales/i18n'

export const signup = body => {
	return fetch('/api/1.0/users', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept-Language': i18n.language,
		},
		body: JSON.stringify(body),
	})
}

// export const activate = token => axios.post(`/api/1.0/users/token/${token}`)
export const activate = token => {
	return fetch(`/api/1.0/users/token/${token}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	})
}

export const loadUsers = async () => {
	return fetch('/api/1.0/users')
}
