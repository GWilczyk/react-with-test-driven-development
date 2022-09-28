import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { loadUsers } from '../api/apiCalls'

import Spinner from './Spinner'
import UserListItem from './UserListItem'

const UserList = () => {
	const { t } = useTranslation()
	const [loading, setLoading] = useState(true)
	const [state, setState] = useState({
		content: [],
		page: 0,
		size: 0,
		totalPages: 0,
	})
	const { content, page, totalPages } = state

	const loadData = async pageIndex => {
		setLoading(true)

		try {
			const resp = await loadUsers(pageIndex)
			if (resp.status === 200) {
				const data = await resp.json()
				setState(data)
				setLoading(false)
			} else {
				throw 'Error fetching users list'
			}
		} catch (error) {
			setLoading(false)
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

			<div className='card-footer text-center'>
				{page > 0 && !loading && (
					<button
						className='btn btn-outline-secondary btn-sm float-start'
						onClick={() => loadData(page - 1)}>
						{t('previousPage')}
					</button>
				)}

				{page + 1 < totalPages && !loading && (
					<button
						className='btn btn-outline-secondary btn-sm float-end'
						onClick={() => loadData(page + 1)}>
						{t('nextPage')}
					</button>
				)}

				{loading && <Spinner size='small' />}
			</div>
		</div>
	)
}

export default UserList
