/*
 * @Author: your name
 * @Date: 2019-11-24 09:41:57
 * @LastEditTime : 2020-02-12 21:15:22
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \order-system\backend\restaurant.js
 */
const express = require('express')
const multer = require('multer')
const path = require('path')
const io = require('./io-server')

const app = express.Router()

var deskCartMap = new Map()
//socket.io实时连接
io.restaurant.on('connection', socket => {
    console.log('restaurant client in')

    var restaurant = socket.handshake.query.restaurant
    socket.join(restaurant)
})
  
io.desk.on('connection', socket => {
    console.log(socket.handshake.query)
    //判断是否有房间，无则关闭连接
    var desk = socket.handshake.query.desk
    if (!desk) {
        socket.close()
        return
    }
    //加入房间
    socket.join(desk)
    //判断是否有已点的订单，无则创建新订单
    var cartFood = deskCartMap.get(desk)
    if (!cartFood) {
        cartFood = [] 
        deskCartMap.set(desk, cartFood)
    }
    //给同一个桌面的所有用户返回订单信息
    socket.emit('cart food', cartFood)
    //用户新添加菜时更新订单
    socket.on('new food', info => {
        console.log(info);
        //检查是否为已点菜品
        console.log(deskCartMap);
        var foodAry = deskCartMap.get(info.desk)
        var idx = foodAry.findIndex(it => it.food.id === info.food.id)
        //是新菜则添加一个菜品对象，是已点菜则修改数量，数量为0则删除
        if (idx >= 0) {
            if (info.amount === 0) {
                foodAry.splice(idx, 1)
            } else {
                foodAry[idx].amount = info.amount
            }
        } else {
            foodAry.push({
                food: info.food,
                amount: info.amount,
            })
        }
        //将当前桌面更新后的数据返回用户
        io.desk.in(desk).emit('new food', info)
    })
})

//处理上传的菜品图片
var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './upload')
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const uploader = multer({storage: storage});

let db
(async function(){
    db = await require('./db')
})()

//获取桌面信息如餐厅名称，桌面名称
//在landing页面请求并展示
//deskinfo?rid=5&did=8
app.get('/deskinfo', async (req, res, next) => {
    var desk = await db.get('SELECT desks.id as did, users.id as uid,desks.name, users.title FROM desks JOIN users ON desks.rid=users.id WHERE desks.id=?', req.query.did)
    res.json(desk)
})

//获取某餐厅的菜单----------------------------------------------------------------
app.get('/menu/restaurant/:rid', async (req, res, next) => {
    var menu = await db.all(`SELECT * FROM foods where rid=? AND status='on'`, req.params.rid);
    res.json(menu)
})

//用户下单------------------------------------------------------------------------
app.post('/restaurant/:rid/desk/:did/order', async (req, res, next) => {
    var rid = req.params.rid;
    var did = req.params.did;
    var deskName = req.body.deskName;
    var totalPrice = req.body.totalPrice;
    var customCount = req.body.customCount;
    var details = JSON.stringify(req.body.foods);
    var status = 'pending' //confirmed/completed
    var timestamp = new Date().toISOString()

    await db.run(`
        INSERT INTO orders (rid, did, deskName,totalPrice, customCount, details, status, timestamp) VALUES (?,?,?,?,?,?,?,?)
    `, rid, did, deskName, totalPrice, customCount, details, status, timestamp);

    var order = await db.get('SELECT * FROM orders ORDER BY id DESC LIMIT 1')
    order.details = JSON.parse(order.details);
    res.json(order)

    //用户下单后
    var desk = 'desk:' + did
    deskCartMap.set(desk, [])//清空当前桌已点菜数据

    io.desk.in(desk).emit('placeorder success', order)//通知其它人下单成功
    io.restaurant.in('restaurant:' + rid).emit('new order', order)//通知餐厅新订单
})


//订单管理--------------------------------------------------------------------
app.route('/restaurant/:rid/order')
    .get(async (req, res, next) => {
        //获取某个餐厅的所有订单
        var orders = await db.all('SELECT * FROM orders  WHERE rid=?', req.cookies.userid);
        orders.forEach(order => {
            order.details = JSON.parse(order.details);
        })
        res.json(orders);
    })


//管理某个订单
app.route('/restaurant/:rid/order/:oid')
    .delete(async (req, res, next) => {
        var order = await db.get('SELECT * FROM orders WHERE rid=? AND id=?', req.cookies.userid, req.params.oid)
        if(order){
            await db.run('DELETE FROM orders  WHERE rid=? AND id=?', req.cookies.userid, req.params.oid);
            delete order.id
            res.json({order})
        }else{
            res.status(401).json({
                code: -1,
                msg: '不存在此订单或您无权限删除'
            })
        }
    })

//修改订单状态
app.put('/restaurant/:rid/order/:oid/status', async (req, res, next) => {
    await db.run('UPDATE orders SET status=? WHERE id=? AND rid=?', req.body.status, req.params.oid, req.cookies.userid);
    var newOrder = await db.get('SELECT * FROM orders WHERE id=? AND rid=?', req.params.oid, req.cookies.userid);
    res.json(newOrder);
})

//菜品管理----------------------------------------------------------------------------
app.route('/restaurant/:rid/food')
    .get(async (req, res, next) => {
        //获取某餐厅的所有菜单用于页面展示
        //   id integer primary key,
        //   rid integer not null,
        //   name string not null,
        //   desc string,
        //   price integer not null,
        //   img string,
        //   category string,
        //   status string not null
        var foodList = await db.all('SELECT * FROM foods where rid=?', req.cookies.userid);
        res.json(foodList);
    })
    .post(uploader.single('img'), async (req, res, next) => {
        //增加菜品
        await db.run(`INSERT INTO foods (rid, name, price, status, desc, category, img) VALUES (?, ?, ?, ?, ?, ?, ?)`, req.cookies.userid, req.body.name, req.body.price, req.body.status, req.body.desc, req.body.category, req.file.path)

        var food = await db.get('SELECT * FROM foods ORDER BY id DESC LIMIT 1')

        res.json(food);
    })


//对某个餐厅的某个菜品进行管理
app.route('/restaurant/:rid/food/:fid')
    .get(async (req, res, next) => {
        //获取某个菜品详情
        const fid = req.params.fid;
        const userid = req.cookies.userid;
        const currentFood = await db.get('SELETE * FROM foods WHERE id=? AND rid=?', fid, userid);
        if(currentFood){
            res.json(currentFood);
        }
    })
    .delete(async (req, res, next) => {
        //删除某个菜品
        var fid = req.params.fid;
        var userid = req.cookies.userid;
        var food = await db.get('SELECT * FROM foods WHERE id=? AND rid=?',fid, userid)
        if(food){
            await db.run('DELETE FROM foods WHERE id=? AND rid=?', fid, userid);
            delete food.id;
            res.json({
                code: 0,
                msg: '删除菜品成功'
            })
        }else{
            res.status(401).json({
                code: -1,
                msg: '不存在此菜品或您无删除权限'
            })
        }
    })
    .put(uploader.single('img'), async (req, res, next) => {
        //修改某个菜品
        var fid = req.params.fid;
        var userid = req.cookies.userid;
        var body = req.body;
        var food = await db.get('SELECT * FROM foods WHERE id=? AND rid=?',fid, userid)
        var newFoodInfo = {
            name: body.name === "" ? food.name : body.name,
            price: body.price === "" ? food.price : body.price,
            status: body.status === "" ? food.status : body.status,
            desc: body.desc === "" ? food.desc : body.desc,
            category: body.category === "" ? food.category : body.category,
            img: req.file === undefined ?  food.img : req.file.path,
        }
        console.log(req.file)
        if(food){
            await db.run(`UPDATE foods SET name=?, price=?, status=?, desc=?, category=?, img=? WHERE id=? AND rid=?`, 
            newFoodInfo.name, 
            newFoodInfo.price, 
            newFoodInfo.status, 
            newFoodInfo.desc, 
            newFoodInfo.category, 
            newFoodInfo.img, 
            fid, userid);
            food = await db.get('SELECT * FROM foods WHERE id=? AND rid=?',fid, userid);
            res.json(food)
        }else{
            res.status(401).json({
                code: -1,
                msg: '不存在此菜品或您无修改权限'
            })
        }
    })


//桌面管理------------------------------------------------------------------------------------
app.route('/restaurant/:rid/desk')
    .get(async (req, res, next) => {
        //获取某餐厅的所有桌面列表用于页面展示
        var deskList = await db.all('SELECT * FROM desks where rid=?', req.cookies.userid);
        res.json(deskList);
    })
    .post(async (req, res, next) => {
        //增加桌面
        await db.run(`INSERT INTO desks (rid, name, capacity) VALUES (?, ?, ?)`, req.cookies.userid, req.body.name, req.body.capacity)

        var desk = await db.get('SELECT * FROM desks ORDER BY id DESC LIMIT 1')

        res.json(desk);
    })

//对某个餐厅的某个桌面进行管理
app.route('/restaurant/:rid/desk/:did')
    .delete(async (req, res, next) => {
        //删除某个桌面
        var did = req.params.did;
        var userid = req.cookies.userid;
        var desk = await db.get('SELECT * FROM desks WHERE id=? AND rid=?',did, userid)
        if(desk){
            await db.run('DELETE FROM desks WHERE id=? AND rid=?', did, userid);
            delete desk.id;
            res.json({
                code: 0,
                msg: '删除桌面成功'
            })
        }else{
            res.status(401).json({
                code: -1,
                msg: '不存在此桌面或您无删除权限'
            })
        }
    })
    .put(async (req, res, next) => {
        //修改某个桌面
        var did = req.params.did;
        var userid = req.cookies.userid;
        var body = req.body;
        var desk = await db.get('SELECT * FROM desks WHERE id=? AND rid=?', did, userid)
        if(desk){
            await db.run(`UPDATE desks SET name=?, capacity=? WHERE id=? AND rid=?`, body.name, body.capacity, did, userid);
        }else{
            res.status(401).json({
                code: -1,
                msg: '不存在此桌面或您无修改权限'
            })
        }
    })

module.exports = app
