// pages/shop-list/shop-list.js
import { behavior as computedBehavior } from 'miniprogram-computed';
const app = getApp();


Page({

    /**
     * 页面的初始数据
     */
    data: {
        area: "",
        areaCode: "",
        areaList: {},
        showAreaSelector: false,
        showLoading: false,
        shopList: []
    },

    behaviors: [computedBehavior],

    computed: {
        isEmpty(data) {
            return (!data.showLoading) && (data.shopList.length == 0 || data.shopList == undefined);
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        var reqTask = wx.request({
            url: app.globalData.baseUrl + '/api/Area/SplitList',
            method: 'GET',
            success: (result) => {
                that.setData({
                    areaList: {
                        province_list: result.data.data.provinceList,
                        city_list: result.data.data.cityList,
                        county_list: result.data.data.countryList
                    }
                })
            },
            fail: () => {},
            complete: () => {}
        });

    },

    /**
     * 返回上一页
     */
    onClickLeft() {
        wx.navigateBack({
            delta: 1
        });
    },

    onOpenAreaSelector() {
        this.setData({
            showAreaSelector: true
        });
    },

    onCloseAreaSelector() {
        this.setData({
            showAreaSelector: false
        });
    },

    onConfirmArea(event) {
        console.log(event);
        this.setData({
            area: event.detail.values.reduce((total, item) => total + item.name, ""),
            areaCode: event.detail.values[event.detail.values.length - 1].code
        })
        this.onCloseAreaSelector();
        this.onChangeArea();
    },

    onChangeArea() {
        this.setData({
            showLoading: true,
            shopList: []
        })
        let that = this;
        var reqTask = wx.request({
            url: app.globalData.baseUrl + '/api/Shop/Area/' + that.data.areaCode,
            header: { 'content-type': 'application/json' },
            method: 'GET',
            success: (result) => {
                that.setData({
                    shopList: result.data.shopList
                });
            },
            fail: () => {
                console.log('fail');
            },
            complete: () => {
                that.setData({
                    showLoading: false
                })
            }
        });
    },

    onCallShop(event) {
        wx.makePhoneCall({
            phoneNumber: event.currentTarget.dataset.phone
        })
    },

    onClickShop(event) {
        wx.navigateTo({
            url: '/pages/shop/shop?id=' + event.currentTarget.dataset.id,
            success: (result) => {

            },
            fail: () => {},
            complete: () => {}
        });

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