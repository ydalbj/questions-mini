Page({

  /**
   * 页面的初始数据
   */
  data: {
    fruit: [{
      id: 1,
      name: '香蕉',
  }, {
      id: 2,
      name: '苹果'
  }, {
      id: 3,
      name: '西瓜'
  }, {
      id: 4,
      name: '葡萄',
  }],
  current: '苹果',
  position: 'left',
  animal: '熊猫',
  checked: false,
  disabled: false,
  },
  handleFruitChange({ detail = {} }) {
    this.setData({
        current: detail.value
    });
},
handleClick() {
    this.setData({
        position: this.data.position.indexOf('left') !== -1 ? 'right' : 'left',
    });
},
handleDisabled() {
    this.setData({
        disabled: !this.data.disabled
    });
},
handleAnimalChange({ detail = {} }) {
    this.setData({
        checked: detail.current
    });
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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