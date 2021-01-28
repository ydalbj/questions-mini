const { $Toast } = require('../../components/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // percent: 0, // 问题进度百分比
    show_cover: true,
    showCards: [
      false,
      false
    ],
    
    questions : [], // 问题数组
    questionIndex: -1, // 当前问题索引
    index: 0,
    total: 1, // 初始化为1，onload后设置为问题长度+1的值

    availableQuestionIndices: [], // 可用问题索引数组
    availableTotal: 1,
    
    results: [],
    current_tab: 'homepage',

    sexItems: [
      {name: 'boy', value: '男孩&nbsp;', checked: true},
      {name: 'girl', value: '女孩', checked: false},
    ],
    birthInfoItems: [
      {name: 'sc', value: "顺产&nbsp;", checked: true},
      {name: 'zc', value: "早产&nbsp;"},
      {name: 'pfc', value: "剖腹产&nbsp;"},
      {name: 'dt', value: "多胎"}
    ],
    birthOrderItems: [
      {name: '1tai', value: '一胎&nbsp;', checked: true},
      {name: '2tai', value: '二胎&nbsp;'},
      {name: '3tai', value: '三胎&nbsp;'},
      {name: '4tai', value: '四胎'},
    ],
    whoTakeCareItems: [
      {name: 'mama', value: '妈妈&nbsp;', checked: true},
      {name: 'baba', value: '爸爸&nbsp;'},
      {name: 'laoren', value: '老人&nbsp;'},
      {name: 'baomu', value: '保姆'},
    ],
    birthSituationItems: [
      {value: '孕期情绪异常'},
      {value: '妊娠高血压，妊娠高血糖'},
      {value: '贫血，孕吐厉害'},
      {value: '孕妇压力过大，情绪不稳，过于劳累等'},
      {value: '大龄产妇'},
      {value: '分娩时产伤，窒息、缺氧、颅内出血'},
    ],
    month_age: -1,
    region: ['山东省', '济南市', '历下区'],
    basic: {
      birthday: "2018-06-15",
      sex: '男孩',
      region: ['山东省', '济南市', '历下区'],
      birth_info: '顺产',
      birth_order: '一胎',
      who_take_care: '妈妈',
      occupation: '', //职业
      telephone: '',
      wechat_name: '',
      birth_situations: []
    }
  },
  bindBirthSituationChange({detail}) {
    let basic = this.data.basic;
    basic.birth_situations = detail.value;
    this.setData({basic});
  },
  bindSexChange({detail}) {
    let basic = this.data.basic;
    basic.sex = detail.value.replace('&nbsp;');
    this.setData({basic});
  },
  bindRegionChange: function ({detail}) {
    let basic = this.data.basic;
    basic.region = detail.value;
    this.setData({basic});
  },
  bindWhoTakeCareChange: function ({detail}) {
    let basic = this.data.basic;
    basic.who_take_care = detail.value;
    this.setData({basic});
  },
  bindBirthInfoChange({detail}) {
    let basic = this.data.basic;
    basic.birth_info = detail.value.replace('&nbsp;');
    this.setData({basic});
  },
  bindBirthOrderChange({detail}) {
    let basic = this.data.basic;
    basic.birth_order = detail.value.replace('&nbsp;');
    this.setData({basic});
  },
  bindOccupationChange({detail}) {
    let basic = this.data.basic;
    basic.occupation = detail.value.replace('&nbsp;');
    this.setData({basic});
  },
  bindTelephoneChange({detail}) {
    let basic = this.data.basic;
    basic.telephone = detail.value.replace('&nbsp;');
    this.setData({basic});
  },
  bindWechatNameChange({detail}) {
    let basic = this.data.basic;
    basic.wechat_name = detail.value.replace('&nbsp;');
    this.setData({basic});
  },
  // 根据生日获取月龄
  setMonthAgeByBirthday(birthday) {
    let today = new Date();
    let day2 = today.getDay();
    let month2 = today.getMonth();
    let year2 = today.getFullYear();

    let day1 = birthday.getDay();
    let month1  = birthday.getMonth();
    let year1 = birthday.getFullYear();

    let month_age = this.data.month_age;

    month_age = (year2 - year1) * 12 + (month2 - month1) + (((day2 - day1) < 0) ? -1 : 0);

    this.setData({month_age});
    this.setAvailableQuestions();
  },
  bindDateChange({detail}) {
    let today = new Date();
    let birthday = new Date(detail.value)
    let basic = this.data.basic;

    if (birthday > today) {
      $Toast({
        content: '日期选择不正确',
        type: 'warning'
      });
      return;
    }

    basic.birthday = detail.value;
    this.setData({basic});

    this.setMonthAgeByBirthday(birthday);
  },
  // 显示基础问题页面
  showBasicQuestions() {
    let showCards = this.data.showCards;
    let show_cover = false;
    showCards[0] = true;
    this.setData({show_cover, showCards});
  },
  setAvailableQuestions() {
    const month_age = this.data.month_age;
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
        is_show = is_show && (this.data.sex === question.for_sex);
      }

      if (question.base_age > -1) {
        // 这里没有小于等于，因为base_age是适合改题的最小年龄，如果是包含等于，任选一项都会超过month_age
        is_show = is_show && (month_age > question.base_age);
      }

      if (question.is_hide) {
        is_show = false;
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
    
    this.setData({ questions });

    // 选中后，自动下一页
    this.handleNextClick(null, question_id);
  },
  handleCheckboxChange(event) {
    let questions = this.data.questions;
    let question_id = event.target.id;

    questions[question_id]['current'] = event.detail.value;
    this.setData({questions});
    console.log(questions)
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
        case 1:
          results[question.id] = current;
          break;

        case 2:
        case 3:
          results[question.id] = current;
          break;
      }
    });
    console.log(results);
    console.log(this.data.basic);
    
    wx.request({
      url: 'https://hz.hahahoho.top/api/subject/1/answer',
      method: 'post',
      data: {
        results: results,
        basic: this.data.basic
      },
      success: res => {
        console.log(res);
        wx.setStorageSync('result', res.data)
        wx.redirectTo({
          url: '/pages/result/result'
        });
      }
    });
    wx.setStorageSync('basic', this.data.basic);
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

    if (this.data.is_age_changed) {
      this.setAvailableQuestions();
      this.setData({
        is_age_changed: false
      });
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
  // 不支持前一页，is_next参数废弃，为兼容起见，暂时保留
  startTest(event, is_next=true)  {
    let showCards = this.data.showCards;
    let questionIndex = this.data.questionIndex;

    // 首先需要确认，必选项是否已经填写或选择
    showCards[questionIndex+1] = false;

    questionIndex = this.getNextQuestionIndex();
    showCards[questionIndex+1] = true;
    this.setData({
      questionIndex,
      showCards
      // percent: Math.round((index_for_available) * 100 / this.data.availableTotal)
    });
  },
  getNextQuestionIndex() {
    const availableQuestionIndices = this.data.availableQuestionIndices;
    let lastQuestionIndex = this.data.questionIndex;
    let lastQuestion = null;
    let lastAnswers = null;
    let nextQuestionIndex = null;
    let nextQuestion = null;
    let index_for_available = availableQuestionIndices.indexOf(lastQuestionIndex);
    let is_selected_pass = null;
    
    if (lastQuestionIndex > -1) {
      lastQuestion = this.data.questions[lastQuestionIndex];
    }
    
    do {
      if (index_for_available === -1) {
        index_for_available = 0;
      } else {
        index_for_available++;
      }

      nextQuestionIndex = this.data.availableQuestionIndices[index_for_available];
      if (nextQuestionIndex === undefined) {
        nextQuestionIndex = this.data.questions.length;
        nextQuestion = null;
      } else {
        nextQuestion = this.data.questions[nextQuestionIndex];
      }

      // 前一道题和后一道题的group_id 不一致就直接退出
      if (!lastQuestion || !nextQuestion || lastQuestion.group_id !== nextQuestion.group_id) {
        break;
      }

      // 计算选中选项中的 is_selected_pass
      if (is_selected_pass === null) {
        is_selected_pass = 0;
        lastAnswers = lastQuestion['current'] || [];

        lastQuestion.answers.forEach(value => {
          if (lastAnswers.indexOf(value.id.toString()) > -1) {
            is_selected_pass += value.is_selected_pass;
            console.log('is_selected_pass:' + is_selected_pass);
          }
        })
      }

      // 如果前一道题选择的选项包含 is_selected_pass 也退出，否则继续循环跳到下一个分组
      if (is_selected_pass > 0) {
        break;
      }
    } while(nextQuestion);

    return nextQuestionIndex;
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
    let birthday = new Date(this.data.basic.birthday);
    this.setMonthAgeByBirthday(birthday);
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