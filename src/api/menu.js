import request from '@/utils/request'

const countMenus = () => request({
  url: '/api/admin/menus/count',
  method: 'get'
})

const getMenus = () => request({
  url: '/api/admin/menus',
  method: 'get'
})

const getMenuById = id => request({
  url: `/api/admin/menus/${id}`,
  method: 'get'
})

const postMenu = data => request({
  url: '/api/admin/menus',
  method: 'post',
  data
})

const putMenu = params => request({
  url: `/api/admin/menus/${params.id}`,
  method: 'put',
  data: params.data
})

const deleteMenu = id => request({
  url: `/api/admin/menus/${id}`,
  method: 'delete'
})

export {
  countMenus,
  getMenus,
  getMenuById,
  postMenu,
  putMenu,
  deleteMenu
}
