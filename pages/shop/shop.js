// pages/shop/shop.js
import { behavior as computedBehavior } from 'miniprogram-computed';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
let app = getApp();



Page({

    /**
     * 页面的初始数据
     */
    data: {
        shop: {
            id: 1,
            name: "飞跃打印",
            location: "龙海区厦门大学嘉庚学院北区商城211店",
            openingHours: "09:30-22:00",
            opening: true,
            tel: '17624550219',
            notice: '本店开业大酬宾啦！！！！！进店有优惠！！！！千万不要错过！！！！',
            printers: []
        },
        jobs: [{
                printerId: 2,
                duplex: true,
                color: true,
                price: 0.15
            },
            {
                printerId: 4,
                duplex: false,
                color: false,
                price: 0.4
            },
            {
                printerId: 1,
                duplex: false,
                color: false,
                price: 10.6
            }
        ],
        showPrinterInfo: false,
        currentPrinterId: -1,
        showPrintSettings: false,
        uploadedFileInfo: null,
        currentPrintSetting: {
            duplex: '0',
            color: '0',
            size: 'A4',
            count: 1,
            pagesStart: 1,
            pagesEnd: 1,
            price: 0
        },
        currentPrintPagesIndex: [0, 0],
        currentPrintPagesArray: [
            [],
            []
        ],
        showCart: false,
        showLoading: false
    },

    behaviors: [computedBehavior],

    computed: {
        totalPrice(data) {
            return data.jobs.reduce((sum, item) => sum + item.price * 100, 0);
        },
        currentPrinter(data) {
            return data.shop.printers.find(printer => printer.id == data.currentPrinterId);
        },
        uploadedFileDescription(data) {
            if (data.uploadedFileInfo == null) {
                return "";
            } else {
                return data.uploadedFileInfo.name + ' ' + data.uploadedFileInfo.size + 'MiB ' + data.uploadedFileInfo.pages + '页'
            }
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var reqTask = wx.request({
            url: app.globalData.baseUrl + '/api/Shop/' + options.id,
            method: 'GET',
            success: (result) => {
                console.log(result.data);
                this.setData({
                    shop: result.data.shop
                })
            },
            fail: () => {},
            complete: () => {}
        });

    },

    /**
     * 返回按钮
     */
    onClickLeft() {
        wx.navigateBack({
            delta: 1
        });
    },

    /**
     * 选择打印机
     * @param {*} event 
     */
    onClickPrinter(event) {
        this.setData({
            showPrinterInfo: true,
            currentPrinterId: event.currentTarget.dataset.id
        })
    },

    /**
     * 关闭打印机信息
     */
    onClosePrinterInfo() {
        this.setData({
            showPrinterInfo: false
        });
    },

    /**
     * 选中打印机打印
     */
    onClickPrintNow() {
        app.hasLogin()
            .then(() => {
                this.setData({
                    showPrinterInfo: false,
                    showPrintSettings: true
                })
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
     * 关闭打印机打印设置
     */
    onClosePrintSetting() {
        this.setData({
            showPrintSettings: false
        })
    },

    /**
     * 上传文件
     */
    onUploadFile() {
        let fileInfo = {};
        let that = this;
        wx.chooseMessageFile({
            count: 1,
            type: 'file',
            extension: ['doc', 'docx']
        }).then(files => {
            console.log(files);
            that.setData({
                showLoading: true
            });
            wx.uploadFile({
                url: app.globalData.baseUrl + '/api/File/Upload',
                filePath: files.tempFiles[0].path,
                name: 'file',
                formData: {
                    'fileName': files.tempFiles[0].name
                },
                header: {
                    'Authorization': 'Bearer ' + app.globalData.token
                },
                success(res) {
                    let response = JSON.parse(res.data);
                    that.waitFileConvert(response.data.id);
                },
                fail(res) {
                    that.setData({
                        showLoading: false
                    });
                }
            })
        })
    },

    waitFileConvert(fileId) {
        console.log("开始等待转换");
        let that = this;
        let timerId = setInterval(() => {
            wx.request({
                url: app.globalData.baseUrl + '/api/File/Info/' + fileId,
                method: 'GET',
                success: (result) => {
                    console.log(result);
                    if (result.data.data.isConverted) {
                        clearInterval(timerId);
                        let fileInfo = {};
                        fileInfo.name = result.data.data.originalName;
                        fileInfo.size = result.data.data.size;
                        fileInfo.pages = result.data.data.pageCount;
                        fileInfo.id = result.data.data.id;

                        that.setData({
                            uploadedFileInfo: {
                                name: fileInfo.name,
                                size: fileInfo.size,
                                pages: fileInfo.pages
                            },
                            currentPrintPagesArray: [Array.from(new Array(fileInfo.pages + 1).keys()).slice(1),
                                Array.from(new Array(fileInfo.pages + 1).keys()).slice(1)
                            ],
                            currentPrintSetting: {
                                fileId: fileInfo.id,
                                duplex: '0',
                                color: '0',
                                size: 'A4',
                                count: 1,
                                pagesStart: 1,
                                pagesEnd: fileInfo.pages,
                                price: -1
                            },
                            showLoading: false
                        })
                    }
                },
                fail: () => {},
                complete: () => {}
            });

        }, 2000);

    },

    /**
     * 设置打印纸张大小
     * @param {*} name 
     */
    onSizeChange(name) {
        this.setData({
            'currentPrintSetting.size': name.detail
        })
    },

    /**
     * 设置打印黑白或彩色
     * @param {*} name 
     */
    onSelectedColorChange(name) {
        this.setData({
            'currentPrintSetting.color': name.detail
        })
    },

    /**
     * 设置双面打印或单面打印
     * @param {*} name 
     */
    onDuplexChange(name) {
        this.setData({
            'currentPrintSetting.duplex': name.detail
        })
    },

    /**
     * 设置打印份数
     * @param {*} name 
     */
    onCountChange(name) {
        this.setData({
            'currentPrintSetting.count': name.detail
        })
    },

    /**
     * 设置打印页范围
     * @param {*} event 
     */
    onPagesChange(event) {
        let selectedIndex = event.detail.value;
        if (this.data.currentPrintPagesArray[0][selectedIndex[0]] > this.data.currentPrintPagesArray[1][selectedIndex[1]]) {
            Dialog.alert({
                title: '错误',
                message: '打印结束页面应该在开始页面之后！',
            });
        } else {
            this.setData({
                currentPrintPagesIndex: selectedIndex,
                'currentPrintSetting.pagesStart': this.data.currentPrintPagesArray[0][selectedIndex[0]],
                'currentPrintSetting.pagesEnd': this.data.currentPrintPagesArray[1][selectedIndex[1]],
            })
        }
    },

    onSubmitJob() {
        this.data.jobs.push({
            ...this.data.currentPrintSetting,
            printerId: this.data.currentPrinterId
        });
        this.setData({
            printerId: -1,
            currentPrintSetting: null,
            uploadedFileInfo: null,
            currentPrintPagesArray: [
                [],
                []
            ]
        });
        this.onClosePrintSetting();
    },

    onOpenCart() {
        this.setData({
            showCart: true
        });
    },

    onCloseCart() {
        this.setData({
            showCart: false
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