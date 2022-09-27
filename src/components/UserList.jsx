import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { loadUsers } from '../api/apiCalls'

import UserListItem from './UserListItem'

const UserList = () => {
	const { t } = useTranslation()
	const [state, setState] = useState({
		content: [],
		page: 0,
		size: 0,
		totalPages: 0,
	})
	const { content, page, totalPages } = state

	const loadData = async pageIndex => {
		try {
			const resp = await loadUsers(pageIndex)
			if (resp.status === 200) {
				const data = await resp.json()
				setState(data)
			} else {
				throw 'Error fetching users list'
			}
		} catch (error) {
			console.error(error)
			setState({
				content: [],
				page: 0,
				size: 0,
				totalPages: 0,
			})
		}
	}

	useEffect(() => {
		loadData()
	}, [])

	return (
		<div className='card'>
			<div className='card-header text-center'>
				<h3>{t('users')}</h3>
			</div>

			<ul className='list-group list-group-flush'>
				{content.map(user => (
					<UserListItem key={user.id} user={user} />
				))}
			</ul>

			<div className='card-footer'>
				{page > 0 && (
					<button
						className='btn btn-outline-secondary btn-sm me-2'
						onClick={() => loadData(page - 1)}>
						{t('previousPage')}
					</button>
				)}

				{page + 1 < totalPages && (
					<button
						className='btn btn-outline-secondary btn-sm'
						onClick={() => loadData(page + 1)}>
						{t('nextPage')}
					</button>
				)}
			</div>
		</div>
	)
}

export default UserList
