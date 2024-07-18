import {apiURL, get, put, del} from "./util";

export async function searchService(keyword, pageSize, pageIndex, order, timeRange, priceRange) {
  let res = await get(`${apiURL}/service/search?keyword=${keyword}&pageSize=${pageSize}&pageIndex=${pageIndex}&order=${order}&timeBegin=${timeRange[0]}&timeEnd=${timeRange[1]}&priceLow=${priceRange[0]}&priceHigh=${priceRange[1]}`)
  for (let service of res.items) service.url = `/service/${service.serviceId}`
  return res
}

export async function getService(serviceId) {
  let res = await get(`${apiURL}/service/${serviceId}`)
  return res
}

export async function getServiceComment(serviceId, pageSize, pageIndex, order) {
  let res = await get(`${apiURL}/service/${serviceId}/comment?pageSize=${pageSize}&pageIndex=${pageIndex}&order=${order}`)
  for (let item of res.items) item.user = item.commenter
  return res
}

export async function getServiceMessage(serviceId, pageSize, pageIndex, order) {
  let res = await get(`${apiURL}/service/${serviceId}/message?pageSize=${pageSize}&pageIndex=${pageIndex}&order=${order}`)
  for (let item of res.items) item.user = item.messager
  return res
}

export async function accessService(serviceId) {
  let res = await put(`${apiURL}/service/${serviceId}/access`)
  return res

}

export async function unaccessService(serviceId) {
  let res = await get(`${apiURL}/service/${serviceId}/unaccess`)
  return res
}

// 收藏服务
export async function collectService(serviceId) {
  let res = await put(`${apiURL}/service/${serviceId}/collect`)
  return res
}

// 取消收藏服务
export async function uncollectService(serviceId) {
  let res = await del(`${apiURL}/service/${serviceId}/uncollect`)
  return res
}