import request from '@/utils/request'

export function getBuildList(page = 1, pageSize = 10) {
  const params = { page, pageSize }
  return request({
    url: 'sys/building',
    method: 'get',
    params: params
  })
}

export function getBuildListByName(page = 1, pageSize = 10, name) {
  const params = { page, pageSize }
  return request({
    url: 'sys/building/getByName/' + name,
    method: 'get',
    params: params
  })
}

export function deleteBuild(buildingIds) {
  return request({
    url: 'sys/building',
    method: 'delete',
    type: 'POST',
    params: buildingIds
  })
}

export function updateBuildStatus(id, status) {
  return request({
    url: 'sys/building/status',
    method: 'put',
    data: { id, status }
  })
}

export function addBuild(build) {
  return request({
    url: 'sys/building',
    method: 'post',
    data: { ...build }
  })
}

export function updateBuild(build) {
  return request({
    url: 'sys/building',
    method: 'put',
    data: { ...build }
  })
}
