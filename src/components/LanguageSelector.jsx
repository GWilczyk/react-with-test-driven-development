/* eslint-disable react/prop-types */
import React from 'react'
import { useTranslation } from 'react-i18next'

const LanguageSelector = () => {
	const { i18n } = useTranslation()

	return (
		<>
			<img
				alt='French Flag'
				src='https://countryflagsapi.com/png/fr'
				onClick={() => i18n.changeLanguage('fr')}
				title='Français'
				width={36}
				height={24}
			/>

			<img
				alt='Great Britain Flag'
				src='https://countryflagsapi.com/png/gb'
				onClick={() => i18n.changeLanguage('en')}
				title='English'
				width={36}
				height={24}
			/>
		</>
	)
}

export default LanguageSelector
