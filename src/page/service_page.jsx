import ItemList from "../component/item_list";
import BasicLayout from "../component/basic_layout";
import {useEffect, useState} from "react";
import {totalEntry} from "../component/item_list";
import {message} from "antd";
import {searchService} from "../service/service";

export default function TaskPage() {
  const [total, setTotal] = useState(0)
  const [serviceList, setServiceList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [priceRange, setPriceRange] = useState([0, -1])
  const [timeRange, setTimeRange] = useState(['', ''])
  const [orderValue, setOrderValue] = useState('time')
  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    searchService(keyword, totalEntry, 0, 'time', ['', ''], [0, -1]).then(res => {
      setTotal(res.total)
      setServiceList(res.items)
    }).catch(err => messageApi.open({type: 'error', content: err}))
  }, [])
  return (<BasicLayout page='service'>
    <ItemList
      title={`服务 ${total}条`}
      ratingTitle='服务评分: '
      placeholder='请输入服务关键词或用户关键词来搜索相关服务'
      value={keyword}
      onSearch={value => {
        setKeyword(value)
        searchService(value, totalEntry, 0, orderValue, timeRange, priceRange).then(res => {
          setTotal(res.total)
          setServiceList(res.items)
          setCurrentPage(1)
        }).catch(err => messageApi.open({type: 'error', content: err}))
      }}
      onChangePriceRange={value => setPriceRange(value)}
      onChangeTimeRange={value => setTimeRange(value)}
      onChangeOrder={value => setOrderValue(value)}
      list={serviceList}
      total={total}
      currentPage={currentPage}
      onChange={(page, pageSize) => {
        searchService(keyword, totalEntry, page - 1, orderValue, timeRange, priceRange).then(res => {
          setTotal(res.total)
          setServiceList(res.items)
          setCurrentPage(page)
        }).catch(err => messageApi.open({type: 'error', content: err}))
      }}
      onCollect={index => {
      }}
    />
  </BasicLayout>)
}