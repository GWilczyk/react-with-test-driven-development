import React, { Component } from 'react'
import { loadUsers } from '../api/apiCalls'

class UserList extends Component {
	state = {
		page: {
			content: [],
			page: 0,
			size: 0,
			totalPages: 0,
		},
	}

	componentDidMount() {
		loadUsers()
			.then(response => {
				if (response.ok) {
					return response.json()
				} else {
					throw 'Error getting users list'
				}
			})
			.then(data => {
				this.setState({ page: data })
			})
			.catch(error => {
				console.error(error)
				this.setState({ page: {} })
			})
	}

	render() {
		return (
			<div className='card'>
				<div className='card-header text-center'>
					<h3>Users</h3>
				</div>

				<ul className='list-group list-group-flush'>
					{this.state.page.content.map(({ id, username }) => {
						return (
							<li className='list-group-item list-group-item-action' key={id}>
								{username}
							</li>
						)
					})}
				</ul>
			</div>
		)
	}
}

export default UserList
