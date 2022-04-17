// pages/order-list/order-list.js
let app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        orders: []
    },

    onClickOrderShop(event) {
        let orderId = event.currentTarget.dataset.id;
        let targetOrder = this.data.orders.find(o => o.id == orderId);
        wx.navigateTo({
            url: '/pages/shop/shop?id=' + targetOrder.shopId,
        });
    },

    onClcikOrder(event) {
        let orderId = event.currentTarget.dataset.id;
        let targetOrder = this.data.orders.find(o => o.id == orderId);
        wx.navigateTo({
            url: '/pages/order/order?id=' + targetOrder.id,
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        let that = this;
        app.hasLogin()
            .then(() => {
                wx.request({
                    url: app.globalData.baseUrl + '/api/Order/User',
                    header: {
                        'Authorization': 'Bearer ' + app.globalData.token
                    },
                    success: (result) => {
                        console.log(result.data);
                        if (result.data.statusCode == 200) {
                            let orders = result.data.data.orders;
                            orders.sort((a, b) => {
                                if (a.createTime > b.createTime) {
                                    return -1;
                                } else if (a.createTime == b.createTime) {
                                    return 0;
                                } else {
                                    return 1;
                                }
                            });
                            that.setData({
                                orders
                            })
                        }
                    },
                    fail: () => {},
                    complete: () => {}
                });
            })
            .catch(() => {
                wx.navigateTo({
                    url: '/pages/login/login',
                    success: (result) => {

                    },
                    fail: () => {},
                    complete: () => {}
                });
            })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})