const { $Toast } = require('../../components/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    percent: 0, // 问题进度百分比
    
    
    showCards: [
      true,
      true
    ],
    
    questions : [], // 问题数组
    questionIndex: -1, // 当前问题索引
    total: 1, // 初始化为1，onload后设置为问题长度+1的值

    availableQuestionIndices: [], // 可用问题索引数组
    availableTotal: 1,
    
    results: [],
    current_tab: 'homepage',
    age: {
      year: 3, // 默认3
      month: 0,
    },
    sex: -1, // 未设置
  },
  setAvailableQuestions() {
    const month_age = this.getMonthAge();
    let availableQuestionIndices = [];
    for (const [i, question] of this.data.questions.entries()) {
      let is_show = true;
      if (question.min_age > -1) {
        is_show = is_show && month_age >= question.min_age;
      }

      if (question.max_age > -1) {
        is_show = is_show && month_age <= question.max_age;
      }

      if (question.for_sex > -1) {
        is_show = (this.data.sex === question.for_sex);
      }
      
      if (is_show) {
        availableQuestionIndices.push(i);
      }
    }

    const availableTotal = availableQuestionIndices.length;
    console.log('availableQuestionIndices:', availableQuestionIndices)
    this.setData({
      availableQuestionIndices,
      availableTotal,
    });
  },
  handleTabChange(event) {
    if (event.detail.key !== "result") {
      return;
    }

    let result = wx.getStorageSync('result');
    if (result) {
      wx.redirectTo({
        url: '/pages/result/result'
      });
    } else {
      $Toast({
        content: '您还没有测试，请先测试！',
        type: 'warning'
      });
    }
  },
  handleRadioChange(event) {
    let questions = this.data.questions;
    let question_id = event.target.id;
    questions[question_id]['current'] = event.detail.value;
    let sex = this.data.sex;
    if (questions[question_id]['name'] === 'sex') {
      if (event.detail.value === '女孩') {
        sex = 0;
      } else {
        sex = 1;
      }

      this.setData({ sex });
      this.setAvailableQuestions();
    }
    this.setData({ questions });

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
  handleAgeYearChange(event) {
    let questions = this.data.questions;
    let question_id = event.target.id;
    let year = event.detail.value;
    let month = this.data.age.month;

    let month_age = year * 12 + month;
    questions[question_id]['current'] = month_age;
    this.setData({
      questions: questions,
      age: {
        year: year,
        month: month
      }
    });

    this.setAvailableQuestions();
  },
  handleAgeMonthChange(event) {
    let questions = this.data.questions;
    let question_id = event.target.id;
    let month = event.detail.value;
    let year = this.data.age.year;

    let month_age = year * 12 + month;
    questions[question_id]['current'] = month_age;
    this.setData({
      questions: questions,
      age: {
        year: year,
        month: month
      }
    });

    this.setAvailableQuestions();
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
      url: 'https://hz.hahahoho.top/api/subject/1/answer',
      method: 'post',
      data: {
        results: JSON.stringify(results),
      },
      success: res => {
        console.log(res);
        wx.setStorageSync('result', res.data)
        wx.redirectTo({
          url: '/pages/result/result'
        });
      }
    })
  },
  getMonthAge() {
    let year = this.data.age.year;
    let month = this.data.age.month;
    let month_age = null;

    if (year) {
      month_age = year * 12;
    }

    if (month) {
      month_age += month;
    }
    return month_age;
  },
  handlePrevClick(event) {
    this.startTest(event, false);
  },
  handleNextClick(event, i=undefined) {
    let index = i;
    if (index === undefined) {
      index = event.target.dataset.index;
    }

    let month_age = this.getMonthAge();
    if (!month_age) {
      $Toast({
        content: '必须输入年龄',
        type: 'warning'
      });
      index = 0;
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
    const availableQuestionIndices = this.data.availableQuestionIndices;
    let questionIndex = this.data.questionIndex;

    let index_for_available = availableQuestionIndices.indexOf(questionIndex)
    
    // 首先需要确认，必选项是否已经填写或选择
    showCards[questionIndex+1] = false;
    if (is_next) {
      if (index_for_available === -1) {
        index_for_available = 0;
      } else {
        index_for_available++;
      }
    } else {
      if (index_for_available === -1) {
        index_for_available = availableQuestionIndices.length - 1;
      } else {
        index_for_available--;
      }
    }
    questionIndex = this.data.availableQuestionIndices[index_for_available];
    if (questionIndex === undefined) {
      questionIndex = this.data.questions.length;
    }
    this.setData({
      questionIndex
    });

    showCards[this.data.questionIndex+1] = true;
    this.setData({
      showCards: showCards,
      percent: Math.round((index_for_available) * 100 / this.data.availableTotal)
    });
  },
  getQuestions() {
    wx.request({
      url: 'https://hz.hahahoho.top/api/subject/1',
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        let questions = res.data;
        let showCards = this.data.showCards;
        let total = questions.length + 1;
        let that = this;
        
        questions.map(function (value, index) {
          // 设置数字输入默认为3(年龄)
          if (value.type == 3 && !('current' in value)) {
            questions[index]['current'] = that.getMonthAge();
          }
          showCards[index+1] = false;
        });

        // 多一个结果页面
        showCards[total] = false;
        
        this.setData({
          showCards,
          questions,
          total,
        });

        console.log('questions:', questions)
        this.setAvailableQuestions();
      }
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
    this.getQuestions();
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