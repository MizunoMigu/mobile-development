// index.js
Page({
  data:{
    wordings: ["World!", "WWWWorld!"],
    index: 0 
  },

  onClick: function() {
    let newIndex = (this.data.index + 1) % 2
    this.setData({
      index: newIndex
    })
    console.log("新下标:", this.data.index)
  }
})
