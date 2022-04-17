// pages/order.js
let app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        order: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        wx.request({
            url: app.globalData.baseUrl + '/api/Order/' + options.id,
            success: (result) => {
                console.log(result.data)
                let order = result.data.data.order;
                order.printJobs = order.printJobs.map(j => {
                    j.file.ext = that.getFileExt(j.file.ext.originalName)
                });
                that.setData({
                    order
                });
            },
            fail: () => {},
            complete: () => {}
        });

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