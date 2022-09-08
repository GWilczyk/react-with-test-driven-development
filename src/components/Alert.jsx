import React from 'react'
import { bool, node, string } from 'prop-types'

const Alert = ({ center = false, children, type = 'success' }) => {
	return (
		<div className={`alert alert-${type} ${center ? 'text-center' : ''}`}>
			{children}
		</div>
	)
}

Alert.propTypes = {
	center: bool,
	children: node,
	type: string,
}

export default Alert
