
import { notification } from 'antd'

import {
	GET_HOLIDAYS_LIST_SUCCESS,
	GET_HOLIDAYS_LIST_FAILED,
	GET_HOLIDAY_SUCCESS,
	GET_HOLIDAY_FAILED,
	CREATE_HOLIDAY_SUCCESS,
	CREATE_HOLIDAY_FAILED,
	UPDATE_HOLIDAY_SUCCESS,
	UPDATE_HOLIDAY_FAILED,
	DELETE_HOLIDAY_SUCCESS,
	DELETE_HOLIDAY_FAILED,
} from '../constants/action_types'
import API from '../network-managers/api'

// eslint-disable-next-line import/prefer-default-export
export const getHolidaysList = dispatch => () => {
	API.getHolidaysList()
		.then(response => response.data)
		.then((data) => {
			// console.log('data', data)
			getHolidaysListSuccess(dispatch, data.holidays)
		})
		.catch(() => {
			// console.log(error)
			getHolidaysListFailed(dispatch)
		})
}

const getHolidaysListSuccess = (dispatch, holidays) => {
	dispatch({
		type: GET_HOLIDAYS_LIST_SUCCESS,
		holidays
	})
}

const getHolidaysListFailed = (dispatch) => {
	dispatch({
		type: GET_HOLIDAYS_LIST_FAILED
	})
}

// eslint-disable-next-line import/prefer-default-export
export const clearHoliday = dispatch => () => {
	dispatch({
		type: GET_HOLIDAY_SUCCESS,
		holiday: {}
	})
}

// eslint-disable-next-line import/prefer-default-export
export const getHoliday = dispatch => (id) => {
	API.getHoliday(id)
		.then(response => response.data)
		.then((data) => {
			getHolidaySuccess(dispatch, data.holiday)
		})
		.catch(() => {
			// console.log(error)
			getHolidayFailed(dispatch)
		})
}

const getHolidaySuccess = (dispatch, holiday) => {
	dispatch({
		type: GET_HOLIDAY_SUCCESS,
		holiday
	})
}

const getHolidayFailed = (dispatch) => {
	dispatch({
		type: GET_HOLIDAY_FAILED
	})
}

export const createOrUpdateHoliday = dispatch => (id, values) => (id
	? updateHoliday(dispatch)(id, values)
	: createHoliday(dispatch)(values)
)

export const createHoliday = dispatch => values => API.createHoliday(values)
	.then(response => response.data)
	.then((/* data */) => {
		// console.log('data', data)
		createHolidaySuccess(dispatch)
	})
	.catch(() => {
		// console.log(error)
		createHolidayFailed(dispatch)
	})

const createHolidaySuccess = (dispatch) => {
	notification.success({
		message: 'Done!',
		description: 'Holiday created successfully'
	})

	dispatch({
		type: CREATE_HOLIDAY_SUCCESS
	})
}

const createHolidayFailed = (dispatch) => {
	notification.error({
		message: 'Error!',
		description: 'Holiday create failed!'
	})

	dispatch({
		type: CREATE_HOLIDAY_FAILED
	})
}

export const updateHoliday = dispatch => (id, values) => API.updateHoliday(id, values)
	.then(response => response.data)
	.then((/* data */) => {
		// console.log('data', data)
		updateHolidaySuccess(dispatch)
	})
	.catch(() => {
		updateHolidayFailed(dispatch)
	})

const updateHolidaySuccess = (dispatch) => {
	notification.success({
		message: 'Done!',
		description: 'Holiday updated successfully'
	})

	dispatch({
		type: UPDATE_HOLIDAY_SUCCESS
	})
}

const updateHolidayFailed = (dispatch) => {
	notification.error({
		message: 'Error!',
		description: 'Holiday update failed!'
	})

	dispatch({
		type: UPDATE_HOLIDAY_FAILED
	})
}

export const deleteHoliday = dispatch => id => API.deleteHoliday(id)
	.then(response => response.data)
	.then((/* data */) => {
		// console.log('data', data)
		deleteHolidaySuccess(dispatch)
	})
	.catch(() => {
		deleteHolidayFailed(dispatch)
	})

const deleteHolidaySuccess = (dispatch) => {
	notification.success({
		message: 'Done!',
		description: 'Holiday deleted successfully'
	})

	dispatch({
		type: DELETE_HOLIDAY_SUCCESS
	})
}

const deleteHolidayFailed = (dispatch) => {
	notification.error({
		message: 'Error!',
		description: 'Holiday delete failed!'
	})

	dispatch({
		type: DELETE_HOLIDAY_FAILED
	})
}
