// pages/shop/shop.js
import { behavior as computedBehavior } from 'miniprogram-computed';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
let app = getApp();



Page({

    /**
     * 页面的初始数据
     */
    data: {
        shop: {},
        jobs: [],
        showPrinterInfo: false,
        currentPrinterId: -1,
        showPrintSettings: false,
        uploadedFileInfo: null,
        currentPrintSetting: null,
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
            return data.jobs.reduce((sum, item) => sum + item.price, 0);
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
        },
        submitOrderDisabled(data) {
            return data.jobs == null || data.jobs.length <= 0;
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.request({
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

    /**
     * 等待文件转换
     */
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
                        fileInfo.ext = that.getFileExt(result.data.data.originalName);

                        that.setData({
                            uploadedFileInfo: {
                                name: fileInfo.name,
                                size: fileInfo.size,
                                pages: fileInfo.pages
                            },
                            currentPrintPagesArray: [Array.from(new Array(fileInfo.pages + 1).keys()).slice(1),
                                Array.from(new Array(fileInfo.pages + 1).keys()).slice(1)
                            ],
                            currentPrintPagesIndex: [0, fileInfo.pages - 1],
                            currentPrintSetting: {
                                fileId: fileInfo.id,
                                duplex: '0',
                                color: '0',
                                size: 'A4',
                                count: 1,
                                pagesStart: 1,
                                pagesEnd: fileInfo.pages,
                                price: -1,
                                fileInfo
                            },
                            showLoading: false
                        });
                        that.onChangeSettings();
                    }
                },
                fail: () => {},
                complete: () => {}
            });
        }, 2000);
    },

    /**
     * 获取文件名的后缀
     */
    getFileExt(fileName) {
        var index = fileName.lastIndexOf(".");
        return fileName.substr(index + 1);
    },

    /**
     * 设置打印纸张大小
     */
    onSizeChange(name) {
        this.setData({
            'currentPrintSetting.size': name.detail
        })
        this.onChangeSettings();
    },

    /**
     * 设置打印黑白或彩色
     * @param {*} name 
     */
    onSelectedColorChange(name) {
        this.setData({
            'currentPrintSetting.color': name.detail
        })
        this.onChangeSettings();
    },

    /**
     * 设置双面打印或单面打印
     * @param {*} name 
     */
    onDuplexChange(name) {
        this.setData({
            'currentPrintSetting.duplex': name.detail
        })
        this.onChangeSettings();
    },

    /**
     * 设置打印份数
     * @param {*} name 
     */
    onCountChange(name) {
        this.setData({
            'currentPrintSetting.count': name.detail
        })
        this.onChangeSettings();
    },

    /**
     * 设置打印页范围
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
            this.onChangeSettings();
        }
    },

    /**
     * 获取任务价格
     */
    onChangeSettings() {
        let that = this;
        wx.request({
            url: app.globalData.baseUrl + '/api/Order/Job/Calculate',
            data: {
                fileId: that.data.currentPrintSetting.fileId,
                printerId: that.data.shop.printers.find(printer => printer.id == that.data.currentPrinterId).id,
                size: that.data.currentPrintSetting.size,
                pagesStart: that.data.currentPrintSetting.pagesStart,
                pagesEnd: that.data.currentPrintSetting.pagesEnd,
                color: that.data.currentPrintSetting.color != "0",
                duplex: that.data.currentPrintSetting.duplex != "0",
                count: that.data.currentPrintSetting.count
            },
            method: 'POST',
            success: (result) => {
                if (result.data.statusCode == 200) {
                    that.setData({
                        "currentPrintSetting.price": result.data.data.totalPrice
                    })
                }
            },
            fail: () => {},
            complete: () => {}
        });

    },

    /**
     * 确认打印任务
     */
    onSubmitJob() {
        if (this.data.currentPrintSetting == null) {
            Dialog.alert({
                message: "还没有上传文件！"
            })
            return;
        }
        let jobs = this.data.jobs;
        jobs.push({
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
            ],
            jobs
        });
        this.onClosePrintSetting();
    },

    /**
     * 打开购物车
     */
    onOpenCart() {
        this.setData({
            showCart: true
        });
    },

    /**
     * 关闭购物车
     */
    onCloseCart() {
        this.setData({
            showCart: false
        });
    },

    /**
     * 购物车内修改数量
     */
    onChangeCartCount(event) {
        let jobs = this.data.jobs;
        let fileId = event.currentTarget.dataset.id;
        let newCount = event.detail;
        let index = jobs.findIndex(j => j.fileId == fileId);
        if (index == -1) {
            console.log("修改打印数量失败！");
            return;
        }
        jobs[index].price = (jobs[index].price / jobs[index].count) * newCount;
        jobs[index].count = newCount;
        this.setData({
            jobs
        });
    },

    /**
     * 删除购物车内物品
     */
    onDeleteCartItem(event) {
        let that = this;
        Dialog.confirm({
            message: "确认删除吗？"
        }).then(() => {
            let fileId = event.currentTarget.dataset.id;
            let jobs = that.data.jobs.filter(job => job.fileId != fileId);
            this.setData({
                jobs
            });
        }).catch(() => {})
    },

    /**
     * 提交订单
     */
    onSubmitOrder() {
        let that = this;
        if (this.data.jobs.length <= 0) {
            Dialog.alert({
                message: "当前购物车为空！"
            });
            return;
        }
        wx.request({
            url: app.globalData.baseUrl + '/api/Order',
            data: {
                "shopId": that.data.shop.id,
                "printTickets": that.data.jobs.map(j => {
                    j.color = j.color != "0";
                    j.duplex = j.duplex != "0";
                    return j;
                })
            },
            header: {
                'Authorization': 'Bearer ' + app.globalData.token
            },
            method: 'POST',
            success: (result) => {
                console.log(result.data);
                if (result.data.statusCode == 200) {
                    that.resetPage();
                    wx.navigateTo({
                        url: '/pages/order/order?id=' + result.data.data.order.id,
                        success: (result) => {

                        },
                        fail: () => {},
                        complete: () => {}
                    });
                }
            },
            fail: () => {},
            complete: () => {}
        });

    },

    /**
     * 重置页面数据
     */
    resetPage() {
        this.setData({
            jobs: [],
            showPrinterInfo: false,
            currentPrinterId: -1,
            showPrintSettings: false,
            uploadedFileInfo: null,
            currentPrintSetting: null,
            currentPrintPagesIndex: [0, 0],
            currentPrintPagesArray: [
                [],
                []
            ],
            showCart: false,
            showLoading: false
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