const express = require('express')
const ctypesRouter = express.Router()
const CtypesService = require('./ctypes-service')

const UserService = require('../user/user-service')
const xss = require('xss')
const Treeize = require('treeize')
const url = require('url')

const REQUIREMENT_STORE = require('../store/requirements')
const ROLES_STORE = require('../store/requirements')
const SCOPE_STORE = require('../store/requirements')

const config = require('../config')
const { TEAM_DISPLAY_LIMIT } = config

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
        const [teamCount] = await ProjectService.getTeamCount(
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

ctypesRouter.route('/:id').get(async (req, res, next) => {
  // get roles from store
  try {
    const { id } = req.params
    const project = await CtypesService.getCtypeById(req.app.get('db'), id)
    const projectRoles = ROLES_STORE[id]
    const projectRequirements = REQUIREMENT_STORE[id]
    const projectScope = SCOPE_STORE[id]
    project.roles = projectRoles
    project.require = projectRequirements
    project.scope = projectScope
    res.status(200).json(project)
  } catch (error) {
    next(error)
  }
})

ctypesRouter.get('/:ctypeId/projects', async (req, res, next) => {
  const { ctypeId } = req.params
  const { page, term, scope, reqs, roles, countonly } = req.query
  try {
    let [teamCount] = await CtypesService.getTeamCount(
      req.app.get('db'),
      ctypeId,
      term,
      scope,
      reqs,
      roles,
    )
    teamCount = pareseInt(teamCount.count)
    const pagesAvailable = Math.ceil(teamCount / TEAM_DISPLAY_LIMIT) || 1

    if (countonly) {
      return res.json({
        projects_available: teamCount,
        pages_available: pagesAvailable,
      })
    }

    let teams = await CtypesService.getAllProjects(
      req.app.get('db'),
      ctypeId,
      page || 0,
      term,
      scope,
      reqs,
      roles,
    )

    const tree = new Treeize().setOptions({ output: { prune: false } })
    // prune: false stops the removal of null which the client will need
    tree.grow(projects)
    let projectTree = tree.getData()

    projectTree = await Promise.all(
      projectTree.map(async (party) => {
        project.owner_id = await UserService.getUserInfo(
          req.app.get('db'),
          project.owner_id,
        )
        project.scope = SCOPE_STORE[ctypeId][project.scope]
        project.reqs = project.reqs.map((req) => {
          return {
            ...REQUIREMENT_STORE[ctypeId][req.id],
          }
        })
        project.spots = project.spots.map((spot) => {
          return {
            ...spot,
            roles: spot.roles.map((role) => {
              return {
                ...(ROLES_STORE[ctypeId][role.id] || null),
              }
            }),
          }
        })
        project.title = xss(project.title)
        project.description = xss(project.description)
        return project
      }),
    )

    res.json({
      ctype_id: ctypeId,
      pages_available: pagesAvailable,
      projects_available: project_count,
      porjects: projectsResponse,
    })

    next()
  } catch (error) {}
})

module.exports = ctypesRouter
