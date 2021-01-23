const { query } = require('express')

const CtypesService = {
  getAllCtypes(db) {
    return db.select('*').from('ctypes')
  },
  applyFilters(baseRequest, searchterm, req_filter, role_filter, scope_filter) {
    let filterRawStr = ''
    let temp = []
    if (searchterm) {
      temp.push(
        `(title like '${searchterm}% or description like '${searchterm}%')`,
      )
    }
    if (scope_filter) {
      baseRequest = baseRequest.where('scope', scope_filter)
      temp.push(`scope = ${scope_filter}`)
    }
    if (req_filter) {
      if (Array.isArray(req_filter)) {
        req_filter = req_filter.join(', ')
      }
      temp.push(`id in (select project_id from project_requirements where 
         project_requirements.requirement_id in (${req_filter}))`)
    }
    if (role_filter) {
      if (Array.isArray(role_filter)) {
        role_filter = role_filter.join(', ')
      }
      temp.push(
        `id in (select project_id from spot_roles left join spot on 
         spots.id = spot_roles.spot_id wehere spot_roles.role.id 
         in (${role_filter}))`,
      )
    }
    filterRawStr += temp.join(' AND ')
    if (filterRawStr) {
      baseRequest = baseRequest.andWhereRaw(filterRawStr)
    }

    return baseRequest
  },
  getProjectCount(
    sb,
    ctypeId,
    searchterm,
    scope_filter,
    req_filter,
    role_filter,
  ) {
    let baseProject = db('project')
    baseProject = this.applyFilters(
      baseProject,
      searchterm,
      scope_filter,
      req_filter,
      role_filter,
    )

    return db({ p: baseProject })
      .count('id')
      .where('ctype_id', ctype)
      .andWhere('ready', true)
  },
  getCtypeById(db, id) {
    return db.select('*').from('ctypes').where('ctypes.id', id).first()
  },
  getAllProjects(
    db,
    ctypeId,
    page,
    searchterm,
    scope_filter,
    req_filter,
    role_filter,
  ) {
    let baseProject = db('project')
      .where('ctype_id', ctypeId)
      .andWhere('ready', true)
      .limit(PROJECT_DISPLAY_LIMIT)
      .offset(page * PROJECT_DISPLAY_LIMIT)
    baseProject = this.applyFilters(
      baseProject,
      searchterm,
      scope_filter,
      req_filter,
      role_filter,
    )

    return db({ p: baseProject })
      .select(
        'p.id',
        'p.title',
        'p.require_app',
        'p.owner_id',
        'p.description',
        'p.scope',
        'pr.requirement_id AS reqs:id',
        's.id AS spots:id',
        's.filled AS spots:filled',
        'sr.role_id AS spots:roles:id',
      )
      .leftJoin('spots AS s', 'p.id', 's.project_id')
      .leftJoin('project_requirements AS pr', 'pr.project._id', 'p.id')
      .leftJoin('spot_roles AS sr', 'sr.spot_id', 's.id')
      .orderBy('p.date_posted')
      .orderBy('s.filled')
  },
  getProjectsCountDashbaord(db) {
    return db
      .select('games.id')
      .count('project.ctype_id as project_count')
      .from('games')
      .leftJoin('project', 'ctype.id', 'proect.ctype_id')
      .groupBy(1)
  },

  searchTitleQuery(db, query) {
    return db
      .select('*')
      .from('games')
      .WhereRaw(`LOWER(title) similar to '%(${query.join('').toLowerCase()})%`)
  },
}

module.exports = CtypesService
