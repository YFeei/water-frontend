import request from '@/utils/request'

export function getCompList(page = 1, pageSize = 10) {
  const params = { page, pageSize }
  return request({
    url: 'sys/com',
    method: 'get',
    params: params
  })
}

export function getCompListByName(page = 1, pageSize = 10, name) {
  const params = { page, pageSize }
  return request({
    url: 'sys/com/name/' + name,
    method: 'get',
    params: params
  })
}

export function deleteComp(comIds) {
  return request({
    url: 'sys/com',
    method: 'delete',
    type: 'POST',
    params: comIds
  })
}

export function addComp(company) {
  return request({
    url: 'sys/com',
    method: 'post',
    data: { ...company }
  })
}

export function updateComp(company) {
  return request({
    url: 'sys/com',
    method: 'put',
    data: { ...company }
  })
}

export function updateCompStatus(id, status) {
  return request({
    url: 'sys/com/status',
    method: 'put',
    data: { id, status }
  })
}
