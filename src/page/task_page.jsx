import ItemList from "../component/item_list";
import BasicLayout from "../component/basic_layout";
import {searchTask} from "../service/task";
import {useEffect, useState} from "react";
import {totalEntry} from "../component/item_list";
import {message} from "antd";

export default function TaskPage() {
  const [total, setTotal] = useState(0)
  const [taskList, setTaskList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [priceRange, setPriceRange] = useState([0, -1])
  const [timeRange, setTimeRange] = useState(['', ''])
  const [orderValue, setOrderValue] = useState('time')
  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    searchTask(keyword, totalEntry, 0, 'time', ['', ''], [0, -1]).then(res => {
      setTotal(res.total)
      setTaskList(res.items)
    }).catch(err => messageApi.open({type: 'error', content: err}))
  }, [])
  return (<BasicLayout page='task'>
    <ItemList
      title={`任务 ${total}条`}
      ratingTitle='任务评分: '
      placeholder='请输入任务关键词或用户关键词来搜索相关任务'
      value={keyword}
      onSearch={value => {
        setKeyword(value)
        searchTask(value, totalEntry, 0, orderValue, timeRange, priceRange).then(res => {
          setTotal(res.total)
          setTaskList(res.items)
          setCurrentPage(1)
        }).catch(err => messageApi.open({type: 'error', content: err}))
      }}
      onChangePriceRange={value => setPriceRange(value)}
      onChangeTimeRange={value => setTimeRange(value)}
      onChangeOrder={value => setOrderValue(value)}
      list={taskList}
      total={total}
      currentPage={currentPage}
      onChange={(page, pageSize) => {
        searchTask(keyword, totalEntry, page - 1, orderValue, timeRange, priceRange).then(res => {
          setTotal(res.total)
          setTaskList(res.items)
          setCurrentPage(page)
        }).catch(err => messageApi.open({type: 'error', content: err}))
      }}
      onCollect={index => {
      }}
    />
  </BasicLayout>)
}