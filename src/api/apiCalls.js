import i18n from '../locales/i18n'

export const activate = token => {
	return fetch(`/api/1.0/users/token/${token}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	})
}

export const getUserById = id => {
	return fetch(`/api/1.0/users/${id}`, {
		headers: {
			'Content-Type': 'application/json',
		},
		method: 'GET',
	})
}

export const loadUsers = (page = 0) => {
	return fetch(
		'/api/1.0/users?' +
			new URLSearchParams({
				page,
				size: 3,
			}),
		{
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'GET',
		}
	)
}

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
