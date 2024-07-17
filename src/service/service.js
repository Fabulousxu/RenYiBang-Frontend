import {apiURL, get} from "./util";

export async function searchService(keyword, pageSize, pageIndex, order, timeRange, priceRange) {
  let res = await get(`${apiURL}/service/search?keyword=${keyword}&pageSize=${pageSize}&pageIndex=${pageIndex}&order=${order}&timeBegin=${timeRange[0]}&timeEnd=${timeRange[1]}&priceLow=${priceRange[0]}&priceHigh=${priceRange[1]}`)
  for (let service of res.items) service.url = `/service/${service.serviceId}`
  return res
}

export async function getService(serviceId) {
  // 模拟得到的信息
  let service = {
    taskId: 1,
    title: '服务',
    description: '服务内容',
    images: ['https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png', 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png', 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png', 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png', 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'],
    price: 2000,
    user: {
      userId: 1,
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=8',
      username: '用户',
      rating: 98
    }
  }

  let getResponse = {service}
  return getResponse.service
}

export async function getServiceComment(taskId, pageSize, pageIndex, order) {
  // 模拟得到的信息
  let item = {
    content: '评论内容', rating: 70, user: {
      userId: 1,
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=8',
      username: '用户',
      rating: 98
    }
  }, items = [], number = 0
  if (pageIndex === 0 || pageIndex === 1) number = 10; else if (pageIndex === 2) number = 2
  for (let i = 0; i < number; ++i) items.push(item)

  let getResponse = {total: 22, items}
  return getResponse
}

export async function getServiceMessage(taskId, pageSize, pageIndex, order) {
  // 模拟得到的信息
  let item = {
    content: '留言内容', rating: 70, user: {
      userId: 1,
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=8',
      username: '用户',
      rating: 98
    }
  }, items = [], number = 0
  if (pageIndex === 0 || pageIndex === 1 || pageIndex === 2) number = 10; else if (pageIndex === 3) number = 6
  for (let i = 0; i < number; ++i) items.push(item)

  let getResponse = {total: 36, items}
  return getResponse
}