/*
 * @Author: your name
 * @Date: 2019-11-24 16:52:45
 * @LastEditTime: 2019-11-28 21:06:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \order-system\frontend\src\DeskManage.js
 */
import React from 'react';
import api from './api';

function DeskItem({desk}){
    var deskStyle = {
        width: '300px',
        height: '200px',
        border: '1px solid #d1dbe5',
        borderRadius: '6px',
        margin: '20px',
    }
    return (
        <div style={deskStyle}>
            <h3 style={{textAlign: "center", lineHeight: '80px', fontSize: '30px'}}>桌号：{desk.name}</h3>
            <p style={{textAlign: "center", lineHeight: '40px', fontSize: '20px'}}>最多容纳：{desk.capacity}人</p>
        </div>
    )
}

export default class DeskInfo extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            deskInfo: []
        }
    }
    componentDidMount(){
        api.get(`/restaurant/${this.props.match.params.rid}/desk`).then(res => {
            this.setState({
                deskInfo: res.data
            })
        })
    }
    render() {
        return (
            <div style={{display: 'flex', flexWrap: 'wrap',}}>
                {
                    this.state.deskInfo.map(desk => {
                        return <DeskItem key={desk.id} desk={desk} />
                    })
                }
            </div>
        )
    }
}