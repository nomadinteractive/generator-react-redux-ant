import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Formik } from 'formik'
import {
	PageHeader,
	Button,
} from 'antd'
import {
	Form,
	Input,
	DatePicker
} from '@jbuschke/formik-antd'
import * as Yup from 'yup'

import {
	getHoliday,
	clearHoliday,
	createOrUpdateHoliday
} from '../actions'
import PageLoading from './shared/page_loading'
import PageContent from './shared/page_content'

const schema = Yup.object().shape({
	name: Yup.string()
		.required('Name field is required'),
	date: Yup.date()
		.required('Date field is required')
})

class HolidayEdit extends Component {
	componentDidMount() {
		const {
			getHolidayAction,
			clearHolidayAction
		} = this.props

		const holidayId = this.getHolidayId()

		if (holidayId) {
			getHolidayAction(holidayId)
		}
		else {
			clearHolidayAction()
		}
	}

	getHolidayId() {
		const { match } = this.props
		if (match.params.holidayId && match.params.holidayId !== 'new') {
			return match.params.holidayId
		}
		return false
	}

	handleFormSubmission(values, formActions) {
		const {
			history,
			createOrUpdateHolidayAction
		} = this.props
		const holidayId = this.getHolidayId()
		createOrUpdateHolidayAction(holidayId, values)
			.then(() => {
				history.push('/holidays/')
			})
			.catch(() => {
				formActions.setSubmitting(false)
			})
	}

	render() {
		const { holiday } = this.props
		const holidayId = this.getHolidayId()

		if (typeof holiday === 'undefined') {
			return <PageLoading />
		}

		return (
			<PageContent className="holidays" type="narrow">
				<PageHeader title={(holidayId ? 'Edit' : 'Add') + ' Holiday'} />

				<Formik
					initialValues={{
						name: holiday.name,
						date: holiday.date
					}}
					enableReinitialize
					validationSchema={schema}
					onSubmit={this.handleFormSubmission.bind(this)}
					render={({
						isSubmitting,
						errors,
					}) => (
						<Form>
							<Form.Item
								label="Name"
								validateStatus={errors.name ? 'error' : ''}
								help={errors.name || ''}
							>
								<Input name="name" />
							</Form.Item>

							<Form.Item
								label="Date"
								validateStatus={errors.date ? 'error' : ''}
								help={errors.date || ''}
							>
								<DatePicker
									format="MM/DD/YYYY"
									name="date"
									allowClear={false}
								/>
							</Form.Item>

							<Form.Item style={{ marginTop: 30 }}>
								<Button
									htmlType="submit"
									type="primary"
									size="large"
									disabled={isSubmitting}
									block
								>
									Save Changes
								</Button>
								<Link to="/holidays">
									<Button type="link" block>
										Cancel all changes and go back
									</Button>
								</Link>
							</Form.Item>
						</Form>
					)}
				/>
			</PageContent>
		)
	}
}

HolidayEdit.propTypes = {
	history: PropTypes.shape({
		push: PropTypes.func.isRequired,
	}).isRequired,
	getHolidayAction: PropTypes.func.isRequired,
	clearHolidayAction: PropTypes.func.isRequired,
	createOrUpdateHolidayAction: PropTypes.func.isRequired,
	holiday: PropTypes.object, // eslint-disable-line react/forbid-prop-types
	match: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
}

HolidayEdit.defaultProps = {
	holiday: {},
}

const mapStateToProps = state => ({
	holiday: state.holidays.holiday,
})

const mapDispatchToProps = dispatch => ({
	getHolidayAction: getHoliday(dispatch),
	clearHolidayAction: clearHoliday(dispatch),
	createOrUpdateHolidayAction: createOrUpdateHoliday(dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(HolidayEdit)
