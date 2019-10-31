const path = require('path')
const fs = require('fs')
const YAML = require('yaml')
const helpers = require('handlebars-helpers')()

const projectDir = process.cwd()
const projectDirGeneratorConfigFilePath = path.join(projectDir, '.nomad-generators-config')
const nodeModuleDir = __dirname

const getGeneratorsConfig = (configFilePath) => {
	const configFileStr = fs.readFileSync(path.resolve(configFilePath), 'utf8')
	const config = JSON.parse(configFileStr)
	if (typeof config['react-redux-ant'] !== 'object') return
	return config['react-redux-ant']
}

const validateConfig = (config) => {
	if (!config) return false
	if (typeof config.actions_directory !== 'string') return 1
	if (typeof config.reducers_directory !== 'string') return 2
	if (typeof config.screens_directory !== 'string') return 3
	if (typeof config.actions_index_file !== 'string') return 4
	if (typeof config.actions_index_new_imports_prepend_pattern !== 'string') return 5
	if (typeof config.action_types_file !== 'string') return 6
	if (typeof config.action_types_new_constants_prepend_pattern !== 'string') return 7
	if (typeof config.api_file !== 'string') return 8
	if (typeof config.api_new_methods_prepend_pattern !== 'string') return 9
	if (typeof config.api_methods_exports_prepend_pattern !== 'string') return 10
	if (typeof config.reducers_index_file !== 'string') return 11
	if (typeof config.reducers_import_prepend_pattern !== 'string') return 12
	if (typeof config.reducers_export_prepend_pattern !== 'string') return 13
	if (typeof config.navigation_file !== 'string') return 14
	if (typeof config.navigation_links_prepend_pattern !== 'string') return 15
	if (typeof config.routes_file !== 'string') return 16
	if (typeof config.routes_screen_imports_prepend_pattern !== 'string') return 17
	if (typeof config.routes_screen_routes_prepend_pattern !== 'string') return 18
	return true
}

const getYmlField = (ymlFile, fieldName) => {
	const yamlFileStr = fs.readFileSync(path.resolve(ymlFile), 'utf8')
	const parsedYml = YAML.parse(yamlFileStr)
	return parsedYml[fieldName]
}

const getPluralName = (ymlFile) => {
	return getYmlField(ymlFile, 'name').plural
}

const getSingularName = (ymlFile) => {
	return getYmlField(ymlFile, 'name').singular
}

const getPKey = (ymlFile) => {
	const fields = getFields(ymlFile)
	let pKeyFieldName = ''
	const fieldsKeys = Object.keys(fields)
	for (let i = 0; i < fieldsKeys.length; i += 1) {
		const val = fields[fieldsKeys[i]]
		if (typeof val.primaryKey !== 'undefined' && val.primaryKey) {
			pKeyFieldName = fieldsKeys[i]
		}
	}
	return pKeyFieldName
}

const getFields = (ymlFile) => {
	const fields = getYmlField(ymlFile, 'fields')
	const fieldsKeys = Object.keys(fields)
	for (let i = 0; i < fieldsKeys.length; i += 1) {
		let val = fields[fieldsKeys[i]]
		// Plain inline data types to object + type field format
		if (typeof val !== 'object') {
			const newFieldScheme = {}
			if (val.indexOf('+') !== -1) {
				newFieldScheme.allowNull = false
				val = val.replace(/\+/g, '')
			}
			if (val.indexOf('*') !== -1) {
				newFieldScheme.required = true
				val = val.replace(/\*/g, '')
			}
			if (val.indexOf('#') !== -1) { // pkey
				newFieldScheme.primaryKey = true
				newFieldScheme.required = true
				val = val.replace(/\#/g, '')
			}
			newFieldScheme.type = val
			fields[fieldsKeys[i]] = newFieldScheme
		}
		// Convert inline enum data type to type and values fields
		if (fields[fieldsKeys[i]].type.substr(0, 4) === 'enum'
			&& fields[fieldsKeys[i]].type.indexOf('(') !== -1) {
				const typeVal = fields[fieldsKeys[i]].type
				fields[fieldsKeys[i]].type = 'enum'
				fields[fieldsKeys[i]].values = typeVal
					.split('(')[1].split(')')[0]
					.split(',')
					.map(v => v.trim())
		}
	}
	return fields
}

const getFieldsExceptPKey = (ymlFile) => {
	const fields = getFields(ymlFile)
	const pKey = getPKey(ymlFile)
	delete fields[pKey]
	return fields
}

const getRequiredFields = (ymlFile) => {
	const fields = getFields(ymlFile)
	const pKey = getPKey(ymlFile)
	const fieldsToReturn = {}
	const fieldsKeys = Object.keys(fields)
	for (let i = 0; i < fieldsKeys.length; i += 1) {
		const val = fields[fieldsKeys[i]]
		if (typeof val.required !== 'undefined' && val.required) {
			fieldsToReturn[fieldsKeys[i]] = val
		}
	}
	return fieldsToReturn
}

const getRequiredFieldsExceptPKey = (ymlFile) => {
	const fields = getRequiredFields(ymlFile)
	const pKey = getPKey(ymlFile)
	delete fields[pKey]
	return fields
}

const getPatternRegex = (str) => {
	return new RegExp('(' + str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + ')')
}

const config = getGeneratorsConfig(projectDirGeneratorConfigFilePath)
const validationResult = validateConfig(config)
if (validationResult !== true) {
	console.log("Generator configuration file (.nomad-generators-config) is not defined or not valid! (" + validationResult + ")")
	process.exit(-1)
}

module.exports = (plop) => {
	// Extended Handlebar Helpers
	plop.addHelper('eq', helpers.eq)
	plop.addHelper('not', helpers.not)
	plop.addHelper('isFalsey', helpers.isFalsey)
	plop.addHelper('typeOf', helpers.typeOf)
	plop.addHelper('join', helpers.join)

	// Custom Helpers
	plop.addHelper('getPluralName', getPluralName)
	plop.addHelper('getSingularName', getSingularName)
	plop.addHelper('getPKey', getPKey)
	plop.addHelper('getFields', getFields)
	plop.addHelper('getFieldsExceptPKey', getFieldsExceptPKey)
	plop.addHelper('getRequiredFields', getRequiredFields)
	plop.addHelper('getRequiredFieldsExceptPKey', getRequiredFieldsExceptPKey)
	plop.addHelper('curly', (object, open) => (open ? '{' : '}'))

	const previewAction = (answers) => {
		const tpl = fs.readFileSync(path.resolve('templates/screen-listing.hbs'), 'utf8')
		const renderedTempalte = plop.renderString(tpl, answers)
		console.log('====> RenderedTempalte\n\n', renderedTempalte)
	}

	// config variables to be used in the generator configuration object below
	const actionsDirectoryPath = path.resolve(config.actions_directory)
	const reducersDirectoryPath = path.resolve(config.reducers_directory)
	const screensDirectoryPath = path.resolve(config.screens_directory)
	const actionsIndexFilePath = path.resolve(config.actions_index_file)
	const actionsIndexNewImportsPrependPattern = config.actions_index_new_imports_prepend_pattern
	const actionTypesFilePath = path.resolve(config.action_types_file)
	const actionsTypesNewConstantsPrependPattern = config.action_types_new_constants_prepend_pattern
	const apiFilePath = path.resolve(config.api_file)
	const apiNewMethodsPrependPattern = config.api_new_methods_prepend_pattern
	const apiMethodExportsPrependPattern = config.api_methods_exports_prepend_pattern
	const reducersIndexFilePath = path.resolve(config.reducers_index_file)
	const reducersIndexImportPrependPattern = config.reducers_import_prepend_pattern
	const reducersIndexExportPrependPattern = config.reducers_export_prepend_pattern
	const navigationFilePath = path.resolve(config.navigation_file)
	const navigationLinksPrependPattern = config.navigation_links_prepend_pattern
	const routesFilePath = path.resolve(config.routes_file)
	const routesScreenImportsPrependPattern = config.routes_screen_imports_prepend_pattern
	const routesScreenRoutesPrependPattern = config.routes_screen_routes_prepend_pattern

	// Plop generator configuration
    plop.setGenerator('crud', {
		description: 'Create React Redux Ant App CRUD UI',
        prompts: [
			{
				type: 'input',
				name: 'yml',
				message: 'Enter the model yml file path',
				validate: function (value) {
					if (fs.existsSync(path.resolve(value))) { return true }
					return 'Yml path is not valid';
				}
			}
		],
        actions: [
			// previewAction,

			// Generate actions file
			{
				type: 'add',
				path: actionsDirectoryPath + '/{{ snakeCase (getPluralName yml) }}.js',
				templateFile: 'templates/action.hbs',
				force: true,
			},

			// Generate reducer file
			{
				type: 'add',
				path: reducersDirectoryPath + '/{{ snakeCase (getPluralName yml) }}.js',
				templateFile: 'templates/reducer.hbs',
				force: true,
			},


			// Generate listing screen file
			{
				type: 'add',
				path: screensDirectoryPath + '/{{ snakeCase (getPluralName yml) }}.js',
				templateFile: 'templates/screen-listing.hbs',
				force: true,
			},
			
			
			// // Generate edit screen file
			{
				type: 'add',
				path: screensDirectoryPath + '/{{ snakeCase (getSingularName yml) }}_edit.js',
				templateFile: 'templates/screen-edit.hbs',
				force: true,
			},


			// Append actions import in actions/index.js
			{
				type: 'modify',
				path: actionsIndexFilePath,
				pattern: getPatternRegex(actionsIndexNewImportsPrependPattern),
				template: "export * from './{{ snakeCase (getPluralName yml) }}'\n$1"
			},


			// Create & append action constants in constants/action_types.js
			{
				type: 'modify',
				path: actionTypesFilePath,
				pattern: getPatternRegex(actionsTypesNewConstantsPrependPattern),
				templateFile: 'templates/action-types-constants.hbs'
			},


			// Create & append API methods in network-managers/api.js
			{
				type: 'modify',
				path: apiFilePath,
				pattern: getPatternRegex(apiNewMethodsPrependPattern),
				templateFile: 'templates/api-methods.hbs'
			},
			{
				type: 'modify',
				path: apiFilePath,
				pattern: getPatternRegex(apiMethodExportsPrependPattern),
				templateFile: 'templates/api-exports.hbs'
			},

			// Append reducer import in reducer/index.js
			{
				type: 'modify',
				path: reducersIndexFilePath,
				pattern: getPatternRegex(reducersIndexImportPrependPattern),
				template: "import { {{ pascalCase (getPluralName yml) }}Reducer } from './{{ snakeCase (getPluralName yml) }}'\n$1"
			},
			{
				type: 'modify',
				path: reducersIndexFilePath,
				pattern: getPatternRegex(reducersIndexExportPrependPattern),
				template: "\t{{ camelCase (getPluralName yml) }}: {{ pascalCase (getPluralName yml) }}Reducer,\n$1"
			},

			// Append navigation menu with new page links in screens/shared/header.js
			{
				type: 'modify',
				path: navigationFilePath,
				pattern: getPatternRegex(navigationLinksPrependPattern),
				templateFile: 'templates/navigation-link.hbs'
			},
			
			// Append new routes in router.js
			{
				type: 'modify',
				path: routesFilePath,
				pattern: getPatternRegex(routesScreenImportsPrependPattern),
				templateFile: 'templates/routes-import.hbs'
			},
			{
				type: 'modify',
				path: routesFilePath,
				pattern: getPatternRegex(routesScreenRoutesPrependPattern),
				templateFile: 'templates/routes-route-tags.hbs'
			},


		]
    })
}
