import React, {useState} from 'react';
import api from '../api';
import { Table, Button, Modal} from 'antd';

const showStatus = {
  'pending': '等待接单',
  'confirmed': '正在备餐',
  'completed': '已完成',
}
const orderItemStyle = {
  boxSizing: 'border-box',
  height: '260px',
  width: '296px',
  padding: '10px 30px',
  margin: '20px',
  position: 'relative',
  transition: '0.4s',
  border: '1px solid #d1dbe5',
  borderRadius: '4px',
  backgroundColor: '#fff',
  boxShadow: '0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04)',
}

const OrderDetail = (props) => {
  const columns = [
    {
      title: '菜品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '数量',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: '合计',
      dataIndex: 'total',
      key: 'total',
    }
  ]
  let list = [];
  const foodDetail = props.orderInfo.details;
  for(let key in foodDetail){
    let val = foodDetail[key]
    let total = val.amount * val.food.price;
    list.push({
      'key': val.food.id,
      'name': val.food.name,
      'amount': val.amount,
      'price':val.food.price,
      "total": total
    })
  }
  return (
    <Table columns={columns} dataSource={list}></Table>
  )
}

const OrderItem = ({order, onDelete}) => {
  const [orderInfo, setOrderInfo] = useState(order)
  const [state, setState] = useState({
    modalVisible: false,
  })
  const { modalVisible } = state;
  const setModalState = () => {
    setState({
      modalVisible: !modalVisible,
    })
  }

  const setConfirm = () => {
    api.put(`/restaurant/1/order/${order.id}/status`,{
      status: 'confirmed'
    }).then(() => {
      setOrderInfo({
        ...orderInfo,
        status: 'confirmed'
      })
    })
  }
  const setComplited = () => {
    api.put(`/restaurant/1/order/${order.id}/status`,{
      status: 'completed'
    }).then(() => {
      setOrderInfo({
        ...orderInfo,
        status: 'completed'
      })
    })
  }
  const deleteOrder = () => {
    api.delete(`/restaurant/1/order/${order.id}`).then(() => {
      onDelete(order);
    });
  }
  return (
    <>
      <div style={orderItemStyle}>
        <h2 style={{marginTop: '5px'}}>桌号：{order.deskName}</h2>
        <h3>总价格：{order.totalPrice}元</h3>
        <h3>人数：{order.customCount}人</h3>
        <h3>订单详情：<a onClick={setModalState}>查看详单</a></h3>
        <h3>订单状态：{showStatus[order.status]}</h3>
        <div>
          <Button size='small' style={{backgroundColor: '#8492A6', color: '#fff'}} onClick={setConfirm}>确认</Button>
          <Button size='small' style={{backgroundColor: '#8492A6', color: '#fff'}} onClick={setComplited}>完成</Button>
          <Button size='small' style={{backgroundColor: '#8492A6', color: '#fff'}} onClick={deleteOrder}>删除</Button>
          <Button size='small' style={{backgroundColor: '#8492A6', color: '#fff'}}>打印</Button>
        </div>
      </div>
      {
        modalVisible && 
        <Modal
          title="菜单详情"
          visible={modalVisible}
          okText="确定"
          cancelText="取消"
          onOk={setModalState}
          onCancel={setModalState}
        >
          <OrderDetail orderInfo={order}></OrderDetail>
        </Modal>
      }
    </>
  )
}
export default OrderItem;