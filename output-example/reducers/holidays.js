import {
	GET_HOLIDAYS_LIST_SUCCESS,
	GET_HOLIDAY_SUCCESS,
} from '../constants/action_types'

const INITIAL_STATE = {
	holidays: [],
	holiday: {}
}

// eslint-disable-next-line import/prefer-default-export
export const HolidaysReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
	case GET_HOLIDAYS_LIST_SUCCESS:
		return {
			...state,
			loaded: true,
			holidays: action.holidays
		}
	case GET_HOLIDAY_SUCCESS:
		return {
			...state,
			holiday: action.holiday
		}
	default:
		return state
	}
}
