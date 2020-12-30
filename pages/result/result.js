// pages/result/result.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current_tab: 'result',
    evaluations: []
  },
  handleTabChange(event) {
    if (event.detail.key === "homepage") {
      wx.redirectTo({
        url: '/pages/index/index',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      const result = wx.getStorageSync('result')
      console.log('result', result);
      
      if (result) {
        let evaluations = JSON.parse(result.group_evaluations);

        this.setData({evaluations});
      }
    } catch (e) {
      // Do something when catch error
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})