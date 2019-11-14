import request from '@/utils/request'

const countAuthorities = () => request({
  url: '/api/admin/authorities/count',
  method: 'get'
})

const getAuthorities = () => request({
  url: '/api/admin/authorities',
  method: 'get'
})

const getAuthorityById = id => request({
  url: `/api/admin/authorities/${id}`,
  method: 'get'
})

const postAuthority = data => request({
  url: '/api/admin/authorities',
  method: 'post',
  data
})

const putAuthority = params => request({
  url: `/api/admin/authorities/${params.id}`,
  method: 'put',
  data: params.data
})

const deleteAuthority = id => request({
  url: `/api/admin/authorities/${id}`,
  method: 'delete'
})

export {
  countAuthorities,
  getAuthorities,
  getAuthorityById,
  postAuthority,
  putAuthority,
  deleteAuthority
}
