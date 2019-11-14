import request from '@/utils/request'

const countUsers = () => request({
  url: '/api/admin/users/count',
  method: 'get'
})

const getUsers = () => request({
  url: '/api/admin/users',
  method: 'get'
})

const getUserById = id => request({
  url: `/api/admin/users/${id}`,
  method: 'get'
})

const putUser = params => request({
  url: `/api/admin/users/${params.id}`,
  method: 'put',
  data: params.data
})

const patchUser = params => request({
  url: `/api/admin/users/${params.id}`,
  method: 'patch',
  data: params.data
})

const deleteUser = id => request({
  url: `/api/admin/users/${id}`,
  method: 'delete'
})

const signIn = data => request({
  url: '/api/admin/users/signin',
  method: 'post',
  data
})

const signUp = data => request({
  url: '/api/admin/users/signup',
  method: 'post',
  data
})

export {
  countUsers,
  getUsers,
  getUserById,
  putUser,
  patchUser,
  deleteUser,
  signIn,
  signUp
}
