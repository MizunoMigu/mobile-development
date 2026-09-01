//模拟新闻数据
const news = [
  {id: '264698',
  title: '中国海洋大学迎来2026级本科生',
  poster: 'https://news.ouc.edu.cn/_upload/article/images/83/47/75d4ca9c44458941226f24393cd8/ccfd7413-d262-4f43-8b62-c6eaee2ffe5b.jpg',
  content: ' 8月30日，中国海洋大学2026级本科生从五湖四海奔赴海大园，正式开启探索深蓝的逐梦之旅。学校党委书记李明，校长张峻峰，副校长林旭升、王雪鹏现场检查指导各项迎新工作部署落实情况，看望来校报到的本科新生及家长，慰问参与迎新工作的师生员工。',
  add_date: '2026-08-31'},
  {id: '305670',
  title: '2026“蓝梦同航”联合海洋调查实习航次在青岛启航',
  poster: 'https://news.ouc.edu.cn/_upload/article/images/e8/57/7cae799545599c76f8e15a5427af/2dd5293f-4ade-4978-a9dc-e5e17d94a054.jpg',
  content: '同舟共济扬帆起，逐梦深蓝启新程。8月29日，由中国海洋大学牵头的2026“蓝梦同航”联合海洋调查实习航次启航仪式在青岛举行。中国海洋大学党委常委、副校长王厚杰出席仪式。来自中国海洋大学、北京大学、清华大学、厦门大学、天津大学、国防科技大学、南方科技大学和浙江海洋大学等8所高校的83名学生齐聚“东方红2”海洋综合科学考察实习船，共赴深蓝，开启知行合一的崭新征程。',
  add_date: '2026-08-30'},
  {id: '304083',
  title: '李隽院士、赵斌教授做客“实学讲堂”',
  poster: 'https://news.ouc.edu.cn/_upload/article/images/bb/cf/f529d7134218a15c5aec0b2098b2/d6ed02be-25d1-416a-9940-f168e17e2b06.jpg',
  content: '8月24日上午，由中国海洋大学化学化工学院、海洋化学理论与工程技术教育部重点实验室主办的“实学讲堂”第十八期、第十九期活动在化学化工学院三楼学术报告厅举行。活动特邀中国科学院院士、清华大学化学系教授李隽和南开大学化学院教授赵斌作专题学术报告。化学化工学院院长李先国主持报告会，学校和学院60余位师生参加活动。',
  add_date: '2026-08-29'},
  {id: '114514',
  title: '中国海洋大学在俯冲带火山活动的深部驱动机制研究方面取得新进展',
  poster: 'https://news.ouc.edu.cn/_upload/article/images/74/d6/b14f185544daadfce33d3cee6d26/911fbee7-1cae-4d91-a975-0e6294859d29.jpg',
  content: '近日，中国海洋大学海洋地球科学学院在国际权威学术期刊Nature Communications（《自然-通讯》）在线发表了题为“Slab thermal transitions in the Aeolian arc driven by sub-slab mantle upwelling in the early Pleistocene”（早更新世板下地幔上涌驱动的伊奥利亚俯冲板块热状态转变）的研究论文。该研究首次揭示了地中海伊奥利亚岛弧火山活动记录的一次俯冲板块热状态快速转变，建立了板块撕裂诱发的热地幔上涌与弧岩浆成分演化之间的关联。',
  add_date: '2026-08-28'}
];

//获取新闻列表
function getNewsList() {
  let list = [];
  for (var i = 0; i < news.length; i++) {
    let obj = {};
    obj.id = news[i].id;
    obj.poster = news[i].poster;
    obj.add_date = news[i].add_date;
    obj.title = news[i].title;
    list.push(obj);
  }
  return list; //返回新闻列表
}

//获取新闻内容
function getNewsDetail(newsID) {
  let msg = {
    code: '404', //没有对应的新闻
    news: {}
  };
  for (var i = 0; i < news.length; i++) {
    if (newsID == news[i].id) { //匹配新闻id编号
      msg.code = '200'; //成功
      msg.news = news[i]; //更新当前新闻内容
      break;
    }
  }
  return msg; //返回查找结果
}

// 对外暴露接口
module.exports = {
  getNewsList: getNewsList,
  getNewsDetail: getNewsDetail
}