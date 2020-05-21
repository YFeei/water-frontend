import request from '@/utils/request'

export function getOrgList(page = 1, pageSize = 10) {
  const params = { page, pageSize }
  return request({
    url: 'sys/org',
    method: 'get',
    params: params
  })
}

export function getOrgListByCompName(page = 1, pageSize = 10, compName) {
  return request({
    url: '/sys/org/compName/' + compName,
    method: 'get'
  })
}

export function getOrgListByCompId(page = 1, pageSize = 10, compId) {
  return request({
    url: '/sys/org/compId/' + compId,
    method: 'get'
  })
}

export function getOrgListByName(page = 1, pageSize = 10, name) {
  const params = { page, pageSize }
  return request({
    url: 'sys/org/name/' + name,
    method: 'get',
    params: params
  })
}

export function deleteOrg(orgIds) {
  return request({
    url: 'sys/org',
    method: 'delete',
    type: 'POST',
    params: orgIds
  })
}

export function updateOrgStatus(id, status) {
  return request({
    url: 'sys/org/status',
    method: 'put',
    data: { id, status }
  })
}

export function addOrg(org) {
  return request({
    url: 'sys/org',
    method: 'post',
    data: { ...org }
  })
}

export function updateOrg(org) {
  return request({
    url: 'sys/org',
    method: 'put',
    type: 'POST',
    data: { ...org }
  })
}
