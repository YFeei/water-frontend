import request from '@/utils/request'

export function getPermList() {
  return request({
    url: 'sys/perm',
    method: 'get'
  })
}

export function updatePermStatus(id, status) {
  return request({
    url: '/sys/perm/status',
    method: 'put',
    data: { id, status }
  })
}

export function getPermById(id) {
  return request({
    url: '/sys/perm/' + id,
    method: 'get'
  })
}

export function updatePerm(perm) {
  return request({
    url: '/sys/perm',
    method: 'put',
    data: { ...perm }
  })
}

export function addPerm(perm) {
  return request({
    url: '/sys/perm',
    method: 'post',
    data: { ...perm }
  })
}

export function deletePerms(permIds) {
  return request({
    url: '/sys/perm',
    method: 'delete',
    type: 'POST',
    params: permIds
  })
}
