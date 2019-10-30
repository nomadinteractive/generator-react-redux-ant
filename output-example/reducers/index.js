import { combineReducers } from 'redux'
import { AuthReducer } from './auth'
import { ProfilesReducer } from './profiles'
import { ProjectReducer } from './projects'
import { MilestoneReducer } from './milestones'
import { DailyUpdatesReducer } from './daily_updates'
import { DashboardReducer } from './dashboard'
import { OOONoticesReducer } from './ooo_notices'
import { UserReducer } from './user'
import { HolidaysReducer } from './holidays'
// $Generator: New Reducer Import Here

export default combineReducers({
	auth: AuthReducer,
	profiles: ProfilesReducer,
	daily_updates: DailyUpdatesReducer,
	projects: ProjectReducer,
	milestones: MilestoneReducer,
	dashboard: DashboardReducer,
	ooo_notices: OOONoticesReducer,
	user: UserReducer,
	holidays: HolidaysReducer,
	// $Generator: New Combined Reducer Export Here
})
