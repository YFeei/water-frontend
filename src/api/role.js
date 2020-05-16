import request from '@/utils/request'

export function getRoleList(page = 1, pageSize = 10, search) {
  const params = { page, pageSize }
  for (const key in search) {
    params[key] = search[key]
  }
  return request({
    url: 'sys/role',
    method: 'get',
    params: params
  })
}

export function updateRoleStatus(id, status) {
  return request({
    url: '/sys/role/status',
    method: 'put',
    data: { id, status }
  })
}

export function getRoleById(id) {
  return request({
    url: '/sys/role/id/' + id,
    method: 'get'
  })
}

export function getRoleByName(name) {
  return request({
    url: '/sys/role/name/' + name,
    method: 'get'
  })
}

export function updateRole(role) {
  return request({
    url: '/sys/role',
    method: 'put',
    data: { ...role }
  })
}

export function addRole(role) {
  return request({
    url: '/sys/role',
    method: 'post',
    data: { ...role }
  })
}

export function deleteRole(roleIds) {
  return request({
    url: '/sys/role',
    method: 'delete',
    type: 'POST',
    params: roleIds
  })
}
