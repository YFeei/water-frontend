import request from '@/utils/request'

export function getRoleList(page = 1, pageSize = 10) {
  return request({
    url: 'sys/role',
    method: 'get',
    params: { page, pageSize }
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

export function updateRole({ role }) {
  return request({
    url: '/sys/role',
    method: 'put',
    data: { role }
  })
}
