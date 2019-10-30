import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
	PageHeader,
	Table,
	Button,
	Popconfirm
} from 'antd'

import {
	getHolidaysList,
	deleteHoliday
} from '../actions'
import PageLoading from './shared/page_loading'
import PageContent from './shared/page_content'

class Holidays extends Component {
	componentDidMount() {
		// eslint-disable-next-line no-shadow
		const { getHolidaysListAction } = this.props
		getHolidaysListAction()
	}

	handleDeleteHolidayButtonClick(id) {
		const {
			deleteHolidayAction,
			getHolidaysListAction
		} = this.props
		deleteHolidayAction(id)
			.then(() => {
				getHolidaysListAction()
			})
	}

	render() {
		const {
			holidays
		} = this.props

		if (typeof holidays === 'undefined') {
			return <PageLoading />
		}

		return (
			<PageContent className="holidays">
				<PageHeader
					title="Holidays"
					extra={(
						<Link to="/holiday/new">
							<Button type="primary">
								Add Holiday
							</Button>
						</Link>
					)}
				/>

				<Table
					dataSource={holidays}
					rowKey="id"
					columns={[
						{
							title: 'Date',
							dataIndex: 'date',
							key: 'date',
						},
						{
							title: 'Name',
							dataIndex: 'name',
							key: 'name',
							render: (text, record) => (
								<Link to={'/holiday/' + record.id}>
									{text}
								</Link>
							)
						},
						{
							title: 'Actions',
							key: 'actions',
							render: (text, record) => (
								<Button.Group size="small">
									<Button>
										<Link to={'/holiday/' + record.id}>
											Edit
										</Link>
									</Button>
									<Popconfirm
										title="Are you sure delete this holiday?"
										onConfirm={() => {
											this.handleDeleteHolidayButtonClick(record.id)
										}}
										okText="Yes"
										cancelText="No"
									>
										<Button type="danger" icon="delete" />
									</Popconfirm>
								</Button.Group>
							)
						}
					]}
					pagination={false}
				/>
			</PageContent>
		)
	}
}

Holidays.propTypes = {
	getHolidaysListAction: PropTypes.func.isRequired,
	holidays: PropTypes.array, // eslint-disable-line react/forbid-prop-types
}

Holidays.defaultProps = {
	holidays: [],
}

const mapStateToProps = state => ({
	users: state.user.users,
	holidays: state.holidays.holidays,
})

const mapDispatchToProps = dispatch => ({
	getHolidaysListAction: getHolidaysList(dispatch),
	deleteHolidayAction: deleteHoliday(dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Holidays)
