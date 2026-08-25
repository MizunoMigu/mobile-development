## 一、实验内容

### （一）实验目的

1.  创建属于自己的第一个小程序“Hello World！”。
2.  学习不使用模板创建小程序的方法。
3.  了解小程序开发者工具及基本框架。
4.  学习在“雨课堂”中提交作业。
5.  熟悉 Typora 和 Markdown 写作。



### （二）实验任务

根据视频教程，创建一个点击按钮，可以改变页面里的文字的 Hello World! 小程序。



### （三）实验步骤

1.  注册小程序获取 AppID 、下载开发者工具。
2.  创建小程序、配置小程序项目，选择不使用模板创建。
3.  编写`index.wxml`，添加文本、图片和按钮，通过插值语法读取替换目标文本。
4.  编写`index.wxss`，为文本添加效果。
5.  在`index.js`的`data`中定义文本数组和数组下标，用于文本切换。
6.  编写`onClick`文本改变函数，使用`setData`更新索引。

> 📌整个实验流程跟着视频讲解手敲代码即可，步骤简单，故省略。



### （四）核心代码

#### index.wxml

```
<view class="title">Hello {{wordings[index]}}</view>
<text class="txt">Mini Program</text>
<image mode="heightFix" src="../../img/bird.jpeg"></image>
<button bindtap="onClick">Click</button>
```

#### index.wxss

```
/**index.wxss**/
page {
  text-align: center;
}

.title{
  color: red;
  margin-top: 200rpx;
}

.txt{
  color: blue;
}
```

#### index.js

```
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
  }
})
```



### （五）实验结果

> 运行编译，默认index为0，显示文本`World!`。
>
> ![运行效果图](https://img2.tofaka.com/autoupload/f/9vwlj/20260824/jSPd/1875X1499/run01.png/webp)
>
> 点击`Click`按钮，index变更为1，文本内容改为`WWWWorld!`。
>
> ![运行效果图](https://img2.tofaka.com/autoupload/f/9vwlj/20260824/ckWz/1875X1499/run02.png/webp)
>
> 再次点击`Click`按钮，index变更为0，文本又切换回`World`。
>
> ![运行效果图](https://img2.tofaka.com/autoupload/f/9vwlj/20260824/7upz/1875X1499/run03.png/webp)



## 二、问题总结与体会

本次实验实现点击按钮切换页面文本的基础功能，跟着视频教程完成基础版本后，助教提出拓展思考：如何实现再次点击按钮，将文字切换回最初的内容。

拿到这个问题时，我的第一反应是定义一个布尔类型的标志变量`tag`，通过判断`tag`为`true`或`false`，控制页面展示不同的文字内容，以此完成两种文本之间的来回切换。在思考实现逻辑的过程中，经过提示，我了解到另一种更简洁的实现思路：把需要轮换展示的全部文本存放在`wordings`数组中，维护一个下标变量，利用取模运算对数组索引进行循环更新，通过索引读取数组内对应内容完成文本切换。对比布尔标记的写法，使用数组索引的方式代码更加精简、扩展性更强；如果后续需要增加更多待切换的文本，只需要往数组内新增元素，少量修改取模的除数即可，不需要额外增加大量条件判断逻辑。

> 这是我第一次接触微信小程序开发，在此之前我没有任何移动端应用、App 相关的开发经历。原本我主观认为移动端开发门槛高、流程复杂，但实际动手完成整个实验后，发现小程序的开发上手难度比我预想的要低。小程序基于类 HTML、CSS、JS 的技术体系，对有前端基础的同学十分友好，开发者工具提供编译、调试、控制台输出等完备功能，可以快速看到代码修改后的运行效果。

本次实验完整走完了小程序项目创建、页面编写、事件绑定、数据更新调试的完整流程，让我初步熟悉微信小程序的项目结构、数据驱动思想以及`setData`的数据更新机制，也真切激发了我对于移动软件开发的兴趣与探索欲望。后续我希望能够夯实 JavaScript 相关基础，持续学习移动端开发相关知识，争取可以独立完成一款属于自己的小应用。
