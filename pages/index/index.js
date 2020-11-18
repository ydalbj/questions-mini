const { $Toast } = require('../../components/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
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

    // 选中后，自动下一页
    this.handleNextClick(null, question_id);
  },
  handleCheckboxChange(event) {
    let questions = this.data.questions;
    let question_id = event.target.id;
    let question = questions[question_id];
    let current = [];
    if ('current' in question) {
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
  handleSubmit() {
    let questions = this.data.questions;
    let results = {};
    
    questions.forEach((question, i) => {
      let current;
      if (!question.current) {
        return;
      }

      current = question.current;
      switch (question.type) {
        case 0:
          question.answers.forEach(value => {
            if (value.title === current) {
              results[value.id] = true;
            }
          });
          break;

        case 1:
          question.answers.forEach(value => {
            if (current.indexOf(value.title) > -1) {
              results[value.id] = true;
            }
          });
          break;

        case 2:
        case 3:
          results[question.answers[0].id] = current;
          break;
      }
    });
    console.log(results);
    wx.request({
      url: 'http://hz.hahahoho.top/api/subject/1/answer',
      method: 'post',
      data: {
        results: JSON.stringify(results),
      },
      success: res => {
        console.log(res);
        wx.redirectTo({
          url: '/pages/result/result'
        });
      }
    })
  },
  handlePrevClick(event) {
    this.startTest(event, false);
  },
  handleNextClick(event, i=undefined) {
    let index = i;
    if (index === undefined) {
      index = event.target.dataset.index;
    }
    let questions = this.data.questions;
    let question = questions[index];

    if (question.is_required && (!question.current || question.current.length === 0)) {
      $Toast({
        content: '此为必选项',
        type: 'warning'
      });
      return;
    }

    this.startTest(event, true);
  },
  handlePageChange(event) {
    const type = event.detail.type;
    if (type === 'next') {
        this.handleNextClick(event);
    } else if (type === 'prev') {
        this.handlePrevClick(event);
    }
  },
  startTest(event, is_next=true)  {
    let showCards = this.data.showCards;

    // 首先需要确认，必选项是否已经填写或选择
  
    showCards[this.data.questionIndex] = false;
    if (is_next) {
      // this.data.questionIndex++;
      this.setData({
        current: this.data.current + 1,
        questionIndex: this.data.questionIndex + 1
      });
    } else {
      // this.data.questionIndex--;
      this.setData({
        current: this.data.current - 1,
        questionIndex: this.data.questionIndex - 1
      });
    }
    // this.setData({
    //   questionIndex: this.data.questionIndex
    // });
    showCards[this.data.questionIndex] = true;
    this.setData({
      showCards: showCards
    });
    
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
          // 设置数字输入默认为3(年龄)
          if (value.type == 3 && !('current' in value)) {
            questions[index]['current'] = 3;
          }
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