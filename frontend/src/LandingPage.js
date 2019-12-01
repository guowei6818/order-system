/*
 * @Author: your name
 * @Date: 2019-11-24 16:42:15
 * @LastEditTime: 2019-11-30 14:31:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \order-system\frontend\src\LandingPage.js
 */
import React, {useState, Suspense} from 'react';
import {withRouter} from 'react-router-dom';
import api from './api';
import createFetcher from './create-fetcher';
import './CSS/LandingPage.css';

import {Button} from 'element-react';

var fetcher = createFetcher((did) => {
    return api.get('/deskinfo?did=' + did)
})

function DeskInfo({did}){
    var info = fetcher.read(did)

    return (
        <div>
            <h2>欢迎光临：<span>{info.data.title}</span></h2>
            <strong>当前桌号：<span>{info.data.name}</span></strong>
        </div>
    )
}

export default withRouter(function(props){
    var [custom, setCustom] = useState(0);

    var rid = props.match.params.rid
    var did = props.match.params.did

    function startOrder(){
        if(custom <= 0){
            alert('请重新选择人数！');
        }else{
            props.history.push(`/r/${rid}/d/${did}/c/${custom}`)
        }
    }

    function changeCustom(e){
        setCustom(e.target.value);
    }
    return (
        <div className='LandingPage'>
            <header className='header-style'>
                <Suspense fallback={<div>Loading...</div>}>
                    <DeskInfo did={did} />
                </Suspense>
            </header>
            <main className='main-style'>
                <h3>请选择人数开始点餐</h3>
                <ul className='custom-count'>
                    <li className={custom === 1 ? 'active' : null} onClick={() => setCustom(1)}>1</li>
                    <li className={custom === 2 ? 'active' : null} onClick={() => setCustom(2)}>2</li>
                    <li className={custom === 3 ? 'active' : null} onClick={() => setCustom(3)}>3</li>
                    <li className={custom === 4 ? 'active' : null} onClick={() => setCustom(4)}>4</li>
                </ul>
                <div className='input-style'>
                    <label className="label-style" htmlFor='count'>其他人数：</label>
                    <input name='count' type='text' value={custom} onChange={changeCustom} />
                </div>
                <Button style={{width: '180px', height: '45px'}} type="primary" onClick={startOrder}>开始点餐</Button>
            </main>
        </div>
    )
})