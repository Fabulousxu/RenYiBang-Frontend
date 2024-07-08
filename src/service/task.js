import {apiURL, get} from "./util";

export async function searchTask(keyword, pageSize, pageIndex, order, timeRange, priceRange) {
  let res = await get(`${apiURL}/task/search?keyword=${keyword}&pageSize=${pageSize}&pageIndex=${pageIndex}&order=${order}&timeBegin=${timeRange[0]}&timeEnd=${timeRange[1]}&priceLow=${priceRange[0]}&priceHigh=${priceRange[1]}`)
  for (let task of res.items) task.url = `/task/${task.taskId}`
  return res
}

export async function getTask(taskId) {
  let res = await get(`${apiURL}/task/${taskId}`)
  res.proposer = [{
    userId: 2,
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=8',
    username: '提出者2',
    rating: 98
  },
    {
      userId: 3,
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=8',
      username: '提出者3',
      rating: 98
    },
    {
      userId: 4,
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=8',
      username: '提出者4',
      rating: 98
    }]
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

export async function unaccessTask(taskId) {
  let res = await get(`${apiURL}/task/${taskId}/unaccess`)
  return res
}