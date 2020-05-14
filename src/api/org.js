import request from '@/utils/request'

export function getOrgList(page = 1, pageSize = 10, search) {
  const params = { page, pageSize }
  for (const key in search) {
    params[key] = search[key]
  }
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
