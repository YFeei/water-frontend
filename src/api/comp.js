import request from '@/utils/request'

export function getCompList(page = 1, pageSize = 10, search) {
  const params = { page, pageSize }
  for (const key in search) {
    params[key] = search[key]
  }
  return request({
    url: 'sys/com',
    method: 'get',
    params: params
  })
}
