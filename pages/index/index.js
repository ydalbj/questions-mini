Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionIndex: 0,
    total: 1, // 初始化为1，onload后设置为问题长度+1的值
    showCards: [
      true,
      true
    ],
    questions : [],
    results: [],
  },
  handleRadioChange(event) {
    let questions = this.data.questions;
    let question_id = event.target.id;
    questions[question_id]['current'] = event.detail.value;
    this.setData({
      questions: questions
    });
  },
  handleCheckboxChange(event) {
    let questions = this.data.questions;
    let question_id = event.target.id;
    let question = questions[question_id];
    let current = [];
    if (question.current) {
      current = question.current;
    }
    const index = current.indexOf(event.detail.value);
    index === -1 ? current.push(event.detail.value) : current.splice(index, 1);
    questions[question_id]['current'] = current;
    this.setData({
      questions: questions
    });
    console.log(questions)
  },
  handleNumberChange(event) {
    let questions = this.data.questions;
    let question_id = event.target.id;
    questions[question_id]['current'] = event.detail.value;
    this.setData({
      questions: questions
    });
  },
  handlePrevClick(event) {
    this.startTest(event, false);
  },
  handleNextClick(event) {
    this.startTest(event, true);
  },
  startTest(event, is_next=true)  {
    let showCards = this.data.showCards;

    // 首先需要确认，必选项是否已经填写或选择
  
    showCards[this.data.questionIndex] = false;
    if (is_next) {
      this.data.questionIndex++;
    } else {
      this.data.questionIndex--;
    }
    this.setData({
      questionIndex: this.data.questionIndex
    });
    showCards[this.data.questionIndex] = true;
    this.setData({
      showCards: showCards
    });
    console.log(this.data.showCards);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: 'http://hz.hahahoho.top/api/subject/1',
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        console.log(res.data)
        let questions = res.data;
        let showCards = this.data.showCards;
        let total = questions.length + 1;
        questions.map(function (value, index) {
          showCards[index+1] = false;
        });

        showCards[total] = false;
        
        this.setData({
          showCards: showCards,
          questions: questions,
          total: total,
        });
        
      }
    });
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