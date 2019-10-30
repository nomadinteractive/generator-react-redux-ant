import axios from 'axios'

import storage from '../persistent-data-managers/storage'

const baseUrl = process.env.API_URL

// HTTP helper methods

const apiCall = (method, path, data, headers) => new Promise((resolve, reject) => {
	storage.getToken()
		.then((token) => {
			axios({
				method,
				url: `${baseUrl}/api${path}`,
				data,
				headers: (token ? { Authorization: `Bearer ${token}`, ...headers } : { ...headers }),
			})
				.then(resolve)
				.catch(reject)
		})
		.catch(reject)
})

const getCall = (path, headers) => apiCall('GET', path, null, headers)

const postCall = (path, data, headers) => apiCall('POST', path, data, headers)

const deleteCall = (path, data, headers) => apiCall('DELETE', path, data, headers)

// Actual API methods

const getHolidaysList = () => getCall('/v1/holidays')

const getHoliday = id => getCall(`/v1/holidays/${id}`)

const createHoliday = values => postCall('/v1/holidays/', values)

const updateHoliday = (id, values) => postCall(`/v1/holidays/${id}`, values)

const deleteHoliday = id => deleteCall(`/v1/holidays/${id}`)

// $Generator: New API Methods Here

// Export all api methods
export default {
	getHolidaysList,
	getHoliday,
	createHoliday,
	updateHoliday,
	deleteHoliday,
	// $Generator: New API Method Exports Here
}
