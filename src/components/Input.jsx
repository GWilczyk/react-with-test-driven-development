/* eslint-disable react/prop-types */
import React from 'react'

const Input = ({ help, id, label, onChange, type = 'text' }) => {
	let inputClass = 'form-control'
	if (help) {
		inputClass += ' is-invalid'
	}

	return (
		<div className='mb-3'>
			<label className='form-label' htmlFor={id}>
				{label}
			</label>
			<input className={inputClass} id={id} onChange={onChange} type={type} />
			<span className='invalid-feedback'>{help}</span>
		</div>
	)
}

export default Input
