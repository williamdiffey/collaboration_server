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
}

module.exports = CtypesService
