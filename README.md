<!--
 * @Author: your name
 * @Date: 2019-12-01 11:15:11
 * @LastEditTime : 2020-02-14 16:19:21
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \order-system\README.md
 -->

# 点餐系统实现

## 实现方式

* 后端：使用nodejs + express + sqlite3 + socket.io
* 前端：使用React + antd

### 主要功能

* 分为用户侧点餐界面，和商户侧餐厅管理页面
* 用户侧：
    1. 可根据桌面二维码进入人数选择页面快速选择用餐人数进入菜品页面。
    2. 菜品页面支持同一桌面多人进行同步点餐，当其中一人增加或删除某个菜品时，其他人的页面订单也会随着改变，当其中一人点击下单后所有用户统一跳转至下单成功页面，下单成功后商户侧后台能够同步更新订单
* 商户侧：
    1. 可进行登录注册，对不同餐厅进行管理，商户登录后进入餐厅管理后台，商户后台分为订单管理、菜品管理、桌面管理
    2. 订单管理，当用户下单后实时接收到pending状态的订单，商户可进行接单将状态转换为confirmed确认订单，客户用餐完毕后切换为completed完成此订单，每个订单可点击查看具体的用户下单详情，对每个订单的菜品数量和单价等进行核实。
    3. 菜品管理，商户可在后台进行实时添加、删除和修改菜品，当菜品修改后，客户也可实时更新菜单，支持菜品上架下架一键切换。
    4. 桌面管理，此功能和订单管理，菜品管理功能相似，故为深化实现，不过后端接口设计完善，等之后再行增加功能。

### 实现方法

* 服务器使用express中间件处理各种相关的数据
    1. 配置cors支持跨域访问数据
    2. 使用session存储用户登录的缓存信息，实现持久化操作
    3. 使用multer处理菜品图片
    4. 中间件太多就不细说了
    5. 实现商户侧对密码进行邮箱找回修改操作
* 数据库使用sqlite3进行存储
    1. 数据库表分为：users(商户个人信息)，orders(客户订单)，foods(餐厅菜品),desks(餐厅桌面)
    2. 可对每个表进行增删改查操作，返回接口都已完善。

* 前端页面使用React组件，antd组件实现
    1. 页面整体采用flex伸缩布局，可根据内容自动调整页面宽高
    2. 因个组件之间传递参数较为简单，故未使用redux，直接采用props传递简单的参数
    3. 页面跳转使用history.push实现，使用前端路由切换。
