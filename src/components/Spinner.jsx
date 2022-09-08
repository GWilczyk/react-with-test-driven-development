import React from 'react'
import { string } from 'prop-types'

const Spinner = ({ size = 'big' }) => {
	const spanClass =
		size === 'small' ? 'spinner-border spinner-border-sm' : 'spinner-border'

	return <span className={spanClass} role='status' />
}

Spinner.propTypes = {
	size: string,
}

export default Spinner
