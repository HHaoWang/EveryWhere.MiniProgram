// pages/order.js
let app = getApp();
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        order: null,
        orderId: -1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        this.setData({
            orderId: options.id
        });
        wx.request({
            url: app.globalData.baseUrl + '/api/Order/' + options.id,
            success: (result) => {
                that.setOrder(result.data.data.order);
            },
            fail: () => {},
            complete: () => {}
        });
    },

    /**
     * 使用服务器的订单格式设置页面订单数据
     */
    setOrder(order) {
        let that = this;
        order.printJobs = order.printJobs.map(j => {
            j.file.ext = that.getFileExt(j.file.originalName)
            return j;
        });
        this.setData({
            order
        });
    },

    /**
     * 返回上一页
     */
    onClickLeft() {
        let pages = getCurrentPages();
        if (pages.length == 1) {
            wx.switchTab({
                url: "/pages/index/index"
            })
        } else {
            wx.navigateBack({
                delta: 1
            });
        }
    },

    /**
     * 支付订单
     */
    onPay() {
        let that = this;
        wx.request({
            url: app.globalData.baseUrl + '/api/Order/' + that.data.order.id + "/Pay",
            header: {
                'Authorization': 'Bearer ' + app.globalData.token
            },
            method: 'POST',
            success: (result) => {
                if (result.data.statusCode == 200) {
                    that.requireSubscribe();
                    that.onLoad({
                        id: that.data.orderId
                    })
                } else {
                    Dialog.alert({
                        message: "支付失败！" + result.data.message
                    });
                }
            },
            fail: () => {},
            complete: () => {}
        });

    },

    /**
     * 订阅订单消息
     */
    requireSubscribe() {
        wx.requestSubscribeMessage({
            tmplIds: [
                'f_qfrBzThpIfK8WwdSHymrz0YBiL13htL_dG1R3zQkE'
            ],
            success(res) {
                console.log(res);
            },
            fail(err) {
                console.log(err);
            }
        })
    },

    /**
     * 获取文件名的后缀
     */
    getFileExt(fileName) {
        var index = fileName.lastIndexOf(".");
        return fileName.substr(index + 1);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})