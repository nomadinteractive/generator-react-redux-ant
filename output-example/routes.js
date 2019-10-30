import React, { useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'

import PrivateRoute from './screens/shared/private_route'

import Login from './screens/login'
import Logout from './screens/logout'
import Settings from './screens/settings'
import Profiles from './screens/profiles'
import Holidays from './screens/holidays'
import HolidayEdit from './screens/holiday_edit'
// $Generator: New Screens Imports Here

const Routes = () => {
	useEffect(() => {
		let title = window.location.pathname.split('/')[1]
		title = title.substr(0, 1).toUpperCase() + title.substr(1)
		title = 'Nomad Team Portal' + (title ? ' - ' + title : '')
		document.title = title
	})

	return (
		<Switch>
			<Route path="/login" component={Login} />
			<Route path="/logout" component={Logout} />
			<PrivateRoute exact path="/" component={Settings} />
			<PrivateRoute path="/settings" component={Settings} />
			<PrivateRoute path="/profiles" component={Profiles} />
			<PrivateRoute path="/holidays" component={Holidays} />
			<PrivateRoute path="/holiday/:holidayId" component={HolidayEdit} />
			{/* $Generator: New Screens Routes Here */}
			<Route component={Page404} />
		</Switch>
	)
}

export default Routes
