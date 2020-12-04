// pages/result/result.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current_tab: 'result',
    evaluations: [],
    aspectCanvas: {
      canvasWidth: 392,
      canvasHeight: 366,
      fontSize: 40,
      categories: ['1', '2', '3', '4', '5', '6'],
      MaxDimension:6
    },
    currentPetNumber: 'm000225',
    dimension: [0, 0, 0, 0, 0, 0],
    radarData: {},
    currentRadarImage: ""
  },
  handleTabChange(event) {
    if (event.detail.key === "homepage") {
      wx.redirectTo({
        url: '/pages/index/index',
      })
    }
  },
  returnRadarData(dimension) {
    const petNumber = this.data.currentPetNumber;
    return {
        gender: 1,
        id: petNumber,
        radarList: dimension
    };
  },
  radarUpdate(e) {
      //传回来雷达图片
      this.setData({currentRadarImage: e.detail});
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      const result = wx.getStorageSync('result')
      console.log('result', result);
      
      if (result) {
        let aspectCanvas = this.data.aspectCanvas;
        let dimension = this.data.dimension;
        let evaluations = result.group_level;

        aspectCanvas.categories = result.group.titles;
        aspectCanvas.MaxDimension = result.group.levels.length;
        dimension = result.group.levels;
        this.setData({aspectCanvas, dimension, evaluations});
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
    setTimeout(()=>{
      const radarData = this.returnRadarData(this.data.dimension);
      this.setData({radarData});
      const {gender, id, radarList} = this.data.radarData;
      console.log(gender, id, radarList);
    },500);
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