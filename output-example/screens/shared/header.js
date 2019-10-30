import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import {
	Layout,
	Row,
	Menu,
	Avatar,
	Icon
} from 'antd'

import { logoutUser } from '../../actions/auth'

class Header extends Component {
	render() {
		const {
			isLoggedIn,
			logout,
			me
		} = this.props

		return (
			<Layout.Header>
				<Row className="site-main-menu">
					<div className="home">
						<Link to="/">
							<span className="logo" />
							<span className="brand">Nomad Interactive</span>
						</Link>
					</div>

					{/* Large Screen Menus */}

					{isLoggedIn && (
						<Menu
							className="desktopMenu center"
							mode="horizontal"
							selectable={false}
						>
							<Menu.Item key="this-week">
								<Link to="/">This Week</Link>
							</Menu.Item>
							<Menu.Item key="milestones">
								<Link to="/milestones">Milestones</Link>
							</Menu.Item>
							<Menu.Item key="ooonotices">
								<Link to="/ooonotices">OOO</Link>
							</Menu.Item>
							<Menu.Item key="holidays">
								<Link to="/holidays">Holidays</Link>
							</Menu.Item>
							{/* $Generator: New Navigation Menu Link Here */}
						</Menu>
					)}
					{isLoggedIn && (
						<Menu
							className="desktopMenu right"
							mode="horizontal"
							selectable={false}
						>
							<Menu.SubMenu
								title={(
									<div>
										<Avatar src={me.avatar_url}>
											{me.name.substring(0, 1)}
										</Avatar>
										<span className="username">
											{me.name.split(' ')[0]}
										</span>
										<Icon
											type="caret-down"
											style={{
												marginLeft: 5,
												fontSize: 12,
												color: '#ccc'
											}}
										/>
									</div>
								)}
								placement="bottomRight"
							>
								<Menu.Item key="settings">
									<Link to="/settings" className="">Settings</Link>
								</Menu.Item>
								<Menu.Item key="logout">
									<a
										onClick={() => { logout() }}
										href="#logout"
									>
										Logout
									</a>
								</Menu.Item>
							</Menu.SubMenu>
						</Menu>
					)}
				</Row>
			</Layout.Header>
		)
	}
}

Header.propTypes = {
	isLoggedIn: PropTypes.bool.isRequired,
	logout: PropTypes.func.isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	me: PropTypes.object
}

Header.defaultProps = {
	me: {}
}

const mapStateToProps = state => ({
	isLoggedIn: state.auth.isLoggedIn,
	me: state.auth.user,
})

const mapDispatchToProps = dispatch => ({
	logout: logoutUser(dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
