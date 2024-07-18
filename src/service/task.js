import {apiURL, get, put, del} from "./util";

export async function searchTask(keyword, pageSize, pageIndex, order, timeRange, priceRange) {
  let res = await get(`${apiURL}/task/search?keyword=${keyword}&pageSize=${pageSize}&pageIndex=${pageIndex}&order=${order}&timeBegin=${timeRange[0]}&timeEnd=${timeRange[1]}&priceLow=${priceRange[0]}&priceHigh=${priceRange[1]}`)
  for (let task of res.items) task.url = `/task/${task.taskId}`
  return res
}

export async function getTask(taskId) {
  let res = await get(`${apiURL}/task/${taskId}`)
  return res
}

export async function getTaskComment(taskId, pageSize, pageIndex, order) {
  let res = await get(`${apiURL}/task/${taskId}/comment?pageSize=${pageSize}&pageIndex=${pageIndex}&order=${order}`)
  for (let item of res.items) item.user = item.commenter
  return res
}

export async function getTaskMessage(taskId, pageSize, pageIndex, order) {
  let res = await get(`${apiURL}/task/${taskId}/message?pageSize=${pageSize}&pageIndex=${pageIndex}&order=${order}`)
  for (let item of res.items) item.user = item.messager
  return res
}

export async function accessTask(taskId) {
    let res = await put(`${apiURL}/task/${taskId}/access`)
    return res

}

export async function unaccessTask(taskId) {
  let res = await get(`${apiURL}/task/${taskId}/unaccess`)
  return res
}

// 收藏任务
export async function collectTask(taskId) {
  let res = await put(`${apiURL}/task/${taskId}/collect`)
  return res
}

// 取消收藏任务
export async function uncollectTask(taskId) {
  let res = await del(`${apiURL}/task/${taskId}/uncollect`)
  return res
}