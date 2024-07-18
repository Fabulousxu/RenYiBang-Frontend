import {apiURL, get, put, del} from "./util";

export async function searchService(keyword, pageSize, pageIndex, order, timeRange, priceRange) {
  let res = await get(`${apiURL}/service/search?keyword=${keyword}&pageSize=${pageSize}&pageIndex=${pageIndex}&order=${order}&timeBegin=${timeRange[0]}&timeEnd=${timeRange[1]}&priceLow=${priceRange[0]}&priceHigh=${priceRange[1]}`)
  for (let service of res.items) service.url = `/service/${service.serviceId}`
  return res
}

export async function getService(serviceId) {
  return await get(`${apiURL}/service/${serviceId}`)
}

export async function getServiceComment(serviceId, pageSize, pageIndex, order) {
  let res = await get(`${apiURL}/service/${serviceId}/comment?pageSize=${pageSize}&pageIndex=${pageIndex}&order=${order}`)
  for (let item of res.items) item.user = item.commenter
  return res
}

export async function getServiceMessage(serviceId, pageSize, pageIndex, order) {
  let res = await get(`${apiURL}/task/${serviceId}/message?pageSize=${pageSize}&pageIndex=${pageIndex}&order=${order}`)
  for (let item of res.items) item.user = item.messager
  return res
}

export async function collectService(serviceId) {
  return await put(`${apiURL}/task/${serviceId}/collect`)
}

export async function uncollectService(serviceId) {
  return await del(`${apiURL}/task/${serviceId}/uncollect`)
}