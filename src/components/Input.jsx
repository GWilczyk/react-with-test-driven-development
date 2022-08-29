/* eslint-disable react/prop-types */
import React from 'react'

const Input = ({ help, id, label, onChange }) => (
	<div className='mb-3'>
		<label className='form-label' htmlFor={id}>
			{label}
		</label>
		<input className='form-control' id={id} onChange={onChange} />
		<span>{help}</span>
	</div>
)

export default Input
