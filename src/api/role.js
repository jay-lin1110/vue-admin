import request from '@/utils/request'

const countRoles = () => request({
  url: '/api/admin/roles/count',
  method: 'get'
})

const getRoles = () => request({
  url: '/api/admin/roles',
  method: 'get'
})

const getRoleById = id => request({
  url: `/api/admin/roles/${id}`,
  method: 'get'
})

const postRole = data => request({
  url: '/api/admin/roles',
  method: 'post',
  data
})

const putRole = params => request({
  url: `/api/admin/roles/${params.id}`,
  method: 'put',
  data: params.data
})

const deleteRole = id => request({
  url: `/api/admin/roles/${id}`,
  method: 'delete'
})

export {
  countRoles,
  getRoles,
  getRoleById,
  postRole,
  putRole,
  deleteRole
}
