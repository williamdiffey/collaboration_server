const express = require('express')
const ctypesRouter = express.Router()
const CtypesService = require('./ctypes-service')

const UserService = require('../user/user-service')
const xss = require('xss')
const Treeize = require('treeize')
const url = require('url')

const EXPERIENCE_STORE = require('../store/experience')
const ROLES_STORE = require('../store/experience')
const SCOPE_STORE = require('../store/experience')

ctypesRouter.get('/', async (req, res, next) => {
  try {
    const ctypes = await CtypesService.getAllctypes(req.app.get('db'))
    const array = []
    const projectsCountDashboard = await CtypesService.getProjectsCountDashbaord(
      req.app.get('db'),
    )
    let url_parts = url.parse(req.url, true)
    let query = url_parts.query

    await Promise.all(
      ctypes.map(async (ctype) => {
        // don't forget to write this - will probably need refactoring
        const [TeamCount] = await ProjectService.getTeamCount(
          req.app.get('db'),
          game.id,
        )
        project.team_count = parseInt(teamCount.count)
        const ctypeRoles = ROLES_STORE[ctype.id]
        const ctypeRequirements = SCOPE_STORE[ctype.id]
        ctype.roles = ctypeRoles
        ctype.requirements = ctypeRequirements

        array.push(ctype)
      }),
    )
    if (Object.keys(query).length > 0) {
      if (query.query === undefined) {
        query.query = ''
      }
      const newctypes = await CtypesService.searchTitleQuery(
        req.app.get('db'),
        query.query.split(''),
      )
      newctypes.map((ctype) => {
        const match = projectsCountDashboard.find(
          (item) => item.id === ctype.id,
        )
        ctype.project_count = match.project_count

        const ctypeRoles = ROLES_STORE[ctype.id]
        const ctypeRequirements = REQUIREMENT_STORE[id]
        const ctypescopes = SCOPE_STORE[id]
        ctype.roles = ctypeRoles
        ctype.requirements = ctypeRequirements
        ctype.scope = ctypescopes
      })
      res.status(200).json(newctypes)
    } else {
      res.status(200).json(array)
    }
  } catch (error) {
    next(error)
  }
})

module.exports = ctypesRouter
