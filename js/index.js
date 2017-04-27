(function(){
  //Ajax get函数
  function get (url,options,callback){
    $.get(url,$.param(options),function(data){
      callback(JSON.parse(data))
    })
  }
	// 赋值属性
	// extend({a:1}, {b:1, a:2}) -> {a:1, b:1}
	function extend(o1, o2){
	  for(var i in o2) if(typeof o1[i] === 'undefined'){
	    o1[i] = o2[i]
	  } 
	  return o1
	}

	// 关注模块
	var templateFo = 
  "<div class='u-follow'>\
    <div id='follow' class='icn'>关注</div>\
    <div class='followed'>\
      <div class='icn'></div>已关注<span class='cancel'>| <span class='unfollow'>取消</span></span>\
    </div>\
    <span>粉丝 </span><span class='fancount'>45</span>\
  </div>";

  function Follow(){
  	this.container = $(templateFo);

  	this.follow = this.container.find('#follow')

  	this.followed = this.container.find('.followed')
    // 取消关注按钮
    this.unfollow = this.container.find('.unfollow')
    // 关注人数
    this.fcount = this.container.find('.fancount')

  	this._initEvent();
  }

  extend(Follow.prototype,{
  	status_switch:function(){
      var f_val = Number(this.fcount.text());

      this.follow.is(':hidden')? this.fcount.text(f_val - 1) : this.fcount.text(f_val + 1)

  		this.follow.toggle();
  		this.followed.toggle();
  	},
  	_initEvent:function(){
  		this.container.insertAfter(".title")
  		//判断是否登录以及关注,若都满足,设置成'已关注'状态
  		 if(document.cookie.indexOf("loginSuc=") != -1){
        if(document.cookie.indexOf("followSuc=") != -1){
          this.status_switch();
        }
      }
      //取关
      this.unfollow.click(function(){
      	document.cookie = "followSuc=1; max-age=0;"
      	this.status_switch();
      }.bind(this))
      //关注
      this.follow.click(function(){
      if(document.cookie.indexOf("loginSuc=")==-1){
          login = new Login();
        }else{
          var url = "http://study.163.com/webDev/attention.htm";
          get(url,"",function(data){
            try{
              if(data==1){
                document.cookie = "followSuc=1";
                this.status_switch();
              }
            }catch(ex){
              //
            }
          }.bind(this));
        }
      }.bind(this))
  	}
  })
  //登录Modal
  var templateL = 
    "<div class='m-modal'>\
      <div class='align'></div>\
      <div class='login'>\
        <form class='form' name='loginForm'>\
          <legend class='u-ttl'>登录网易云课堂</legend>\
          <fieldset>\
            <div class='icn'></div>\
            <input id='account' name='name' type='text' placeholder='账号' required>\
            <input id = 'password' name='password' type='password' placeholder='密码' required>\
            <div class='msg'></div>\
            <button class='loginbtn'>登录</button>\
          </fieldset>\
         </form>\
       </div>\
     </div>";

  function Login(){
    this.container = $(templateL)

    this.form = this.container.find('.form')

    this.cls = this.form.find('.icn')

    this.msg = this.form.find('.msg')

    this.suc = $('<div class=\'j-suc\'>登录成功</div>')

    this.mask = $('<div class=\'f-mask\'></div>')

    this._initEvent();
  }

  extend(Login.prototype,{

    show:function(){

      this.mask.appendTo('body')
      this.container.appendTo('body')
      
    },

    hide:function(){
      this.mask.remove()
      this.container.remove()
    },

    success:function(){

     this.suc.appendTo('body')
     
    },

    suchide:function(){
      
      this.suc.remove()
    },
    _initEvent:function(){
      this.show();
      // 登录事件
      this.form.on("submit",function(e){
        e.preventDefault();
        // 加密
        var account = hex_md5(this.form[0].account.value),
            pswd = hex_md5(this.form[0].password.value),
            url = "http://study.163.com/webDev/login.htm",
            data = {userName:account,password:pswd};

        $.get(url,$.param(data),function(num){
          try{
            if(num==1){
              this.hide();
              document.cookie = "loginSuc=1";
              document.cookie = "followSuc=1";
              follow.status_switch();
              this.success();
              setTimeout(this.suchide.bind(this),1500)
            }else if(num==0){
              this.msg.text("账号/密码错误")
            }
          }catch(ex){
            //
          }
        }.bind(this))
      }.bind(this));
      // 关闭
      this.cls.bind("click",this.hide.bind(this));
    },

  })

   // slider 轮播图
  // 
  var templateS = "<div class='m-slider'>\
                    <a href='' target='_blank'><img class='slide'></a>\
                    <div class='pointer'>\
                      <i class='u-p' data-index='1'></i>\
                      <i class='u-p' data-index='2'></i>\
                      <i class='u-p' data-index='3'></i>\
                    </div>\
                  </div>";

  function Slider(options){
    extend(this,options);

    options = options || {};

    this.container = this.container || document.body;

    this.slider = $(templateS);

    this.slides = this.slider.find('.slide');

    this.link = this.slides.parent()

    this.pointer = this.slider.find('.pointer');

    this.pointes = this.slider.find('.u-p');

    this.pageNum = this.images.length;
    // 判断pageindex是否合法/输入,默认为1
    this.pageindex = (0<this.pageindex && this.pageindex<this.pageNum +1)? this.pageindex : 1;

    this._initEvent();
  }

  extend(Slider.prototype,{
    // 轮播动作
    change:function(){
      index = this.pageindex;
      index ++;
      index >3?index = 1:index = index;
      // 当前"圆点"添加"z-crt"类名
      this.pointes.removeClass('z-crt')
                  .eq(index-1).addClass('z-crt');
      
      // 改变src,实现轮播
      this.slides.attr('src',this.images[index-1]);
      // 改变url
      this.link.attr('href' , this.urls[index-1]);
      //淡入
      if(!this.slides.is(':animated')){
        this.slides.fadeOut(0).fadeIn(500)
      }
      this.pageindex = index ;
    },
    // 执行轮播,5s一次
    start:function(){
      this.timer = setInterval(this.change.bind(this),5000)
    },
    // 停止轮播
    stop:function(){
      clearInterval(this.timer);
    },
    // 初始化,设置'首页'图片,对应"圆点"样式以及链接,开始轮播
    _initEvent:function(){

      this.container.append(this.slider);

      this.link.attr('href',this.urls[this.pageindex-1]) 

      this.slides.attr('src',this.images[this.pageindex-1])

      this.pointes.eq(this.pageindex-1).addClass('z-crt');
      // 添加'圆点'点击事件,采用事件代理
      this.pointer.on("click",'i',function(e){
        // if(e.target.tagName=="I"){
          this.stop();
          this.pageindex = e.target.dataset.index - 1;
          this.change();
          this.start();
        // }
      }.bind(this));

      // 鼠标移入,停止轮播.
      this.slides.bind("mouseover",function(){
        this.stop();
      }.bind(this));
      // 鼠标移出,重新开始轮播
      this.slides.bind("mouseout",function(){
        this.start();
      }.bind(this));
      // 开始轮播
      this.start();
    }
  })

  // course课程模块
  // ----
     
  var templateC = 
    "<li class='u-course'>\
      <a class='img'>\
        <img width = '223px' height = '124px'>\
        <div class='detail'>\
         <div class='top f-cb'>\
            <img class='dimg' width = '223px' height = '124px'>\
            <div class='content'>\
              <div class='dttl'></div>\
              <div class='dlcount icn'></div>\
              <div class='dprv'></div>\
              <div class='dcategory'></div>\
            </div>\
          </div>\
          <div class='descr'></div>\
        </div>\
      </a>\
    <div class='ttl'></div>\
    <div class='prv'></div>\
    <div class='lcount icn'></div>\
    <div class='price'></div>\
    </li>";

  function Course(options){

    options = options || {};
    // 主容器
    this.container = $(".m-courselist");
    // 当前页课程数
    this.coursecount = this.container[0].getElementsByClassName('u-course')
    // 页码器
    this.pager = $('.m-page')
    // 页数,jQuery选择器不是动态的,所以这里用原生
    this.pagecount = document.getElementsByClassName('pageindex')

    this.msg = this.pager.find(".msg");

    extend(this,options);

    this._initEvent();

  }



  extend(Course.prototype,{
    // 增加课程
    addcourse:function(i){

      this.container.append($(templateC));
      this.setcourse(i);

    },
    // 设置课程样式
    setcourse:function(i){
      var $u_c = this.container.children().eq(i),
          l = this.list[i];
      $u_c.find('img').attr('src',l.middlePhotoUrl);
      $u_c.find(".dttl").text(l.name)
      $u_c.find(".dlcount").text(l.learnerCount + "人在学")
      $u_c.find(".dprv").text("发布者:" + l.provider);
      $u_c.find(".dcategory").text ( "分类:" + (l.categoryName?l.categoryName:"无"));
      $u_c.find(".descr").text ( l.description)
      $u_c.find('.ttl').text( l.name )
      $u_c.find('.prv').text( l.provider )
      $u_c.find('.lcount').text( l.learnerCount)
      $u_c.find('.price').text( l.price == 0? "免费" : '￥'+ l.price)
    },
    // 页码点击执行函数
    pmove:function(event){
      this.msg.text('');
        var index = $(event.target).data('index')
            pageNo = data.pageNo;

        // -1为上一页,0为下一页
        switch(index){
          case -1:
            if(pageNo>1){
              data.pageNo = data.pageNo - 1;
              get(url,data,function(obj){
                course = new Course(obj)
              })
            }else{
              this.msg.text("已经是第一页啦,别浪费力气了~")
            }
          
          break;
          case 0:
            // 这里不用totalPage的原因是'this'会一直指向页面第一次加载时new出来的Course
            // 如果是大屏,那么this.totalPage就是3,会造成变成小屏后点击下一页无法到达第四页的情况
            // 改为每次重新注册监听
            // 引申出的问题--> [我重复进行course = new Course的做法,是不是很不好?]
            if(pageNo<this.totalPage){
              data.pageNo += 1;
              get(url,data,function(obj){
                course = new Course(obj);
              })
            }else{
              this.msg.text("已经是最后页啦,别浪费力气了~")
            }

          
          break;
          default:
            if(index>0 && index != pageNo){
              data.pageNo = index;

              get(url,data,function(obj){
                course = new Course(obj);
              })
            }
        }
      // }
    },

    // 初始化事件,根据现有的课程数和获取到的课程数来增删/设置课程
    _initEvent:function(){
      // 对页码器进行事件代理,执行跳转,因为每次翻页都会重新new一个Course
      // 会重复监听注册,故先取消,这样的pmove中的this.totalPage才会指向当前的this
      this.pager.unbind('click')
      this.pager.on('click','li',this.pmove.bind(this))
      // 判断请求的页码数是否大于服务器返回的总页数.
      // 若大于总页数,自动返回最后一页数据
      // 经测试,'错误'的页码数还是会返回totalPage和totalCount
      if(data.pageNo > this.totalPage){
          data.pageNo = this.totalPage;
          get(url,data,function(obj){
            course = new Course(obj)
          })
      }else{
        var clength = this.coursecount.length,//当前页面的课程数量
            llength = this.list.length;//从服务器获取到的指定页面课程数量
        if(clength == 0){

          for(var i = 0,length=llength;i<length;i++){
            this.addcourse(i);
          }
        }else if(clength == llength){
          for(var i = 0,length=llength;i<length;i++){
            this.setcourse(i)
          }
        }else if(clength>llength){
          for(var i = 0,length=clength - llength;i<length;i++){
            this.container.children().eq(i).remove()
          }
          for(var i=0,length=llength;i<length;i++){
            this.setcourse(i)
          }
        }else{
          for(var i = 0;i<clength;i++){
            this.setcourse(i)
          }
          for(var i=clength;i<llength;i++){
            this.addcourse(i);
          }
        }
        // 设置页码数
        if(this.pagecount.length == 0){ //无页码时,即第一次加载页面时
          for(var i=0 ,length = this.totalPage;i<length;i++){
            // 创建元素
            var $pageindex = $('<li class=\'pageindex\'></li>');
            // 设置类名
            (i+1) == data.pageNo ? $pageindex.addClass('z-sel') : i=i

            $pageindex.data('index',i+1);

            $pageindex.text(i+1);

            $pageindex.insertBefore($('.icn.right'));
          }
         
          // 注册tab的点击事件,采用事件代理
          var $coursetab = $('.u-tab');
          $coursetab.on("click",'li',function(e){

            // if(e.target.tagName == "LI"){
              switch(e.target.dataset.type){
                case '10':
                data.type = 10;
                data.pageNo = 1;
                break;

                case '20':
                data.type = 20;
                data.pageNo = 1;
                break;
              }
          
              // 2个tab在'z-sel'和''切换
              if(!$(e.target).hasClass('z-sel')){
                $coursetab.children().toggleClass('z-sel')
              }
              get(url,data,function(obj){
                course = new Course(obj)
              })
            // }
          })
        }else if (this.pagecount.length < this.totalPage){ // 页面总页码数小于从服务器获取的总页码数时
          for(var i = this.pagecount.length ; i<this.totalPage;i++){

            var $pageindex = $('<li class=\'pageindex\'></li>');

            $pageindex.addClass("pageindex");

            $pageindex.data("index",i+1);

            $pageindex.text(i+1) ;

            $pageindex.insertBefore(this.pager.children().eq(i+2))
          }
        }else if(this.pagecount.length > this.totalPage){ //页面总页码数大于从服务器获取的总页码数时
          for(var i = this.totalPage;i<this.pagecount.length;i++){

            this.pager.children().eq(i+2).remove();
            
          }
        }

        // 设置页码状态
        for(i=0;i<this.totalPage;i++){
        (i+1) == data.pageNo ? this.pagecount[i].className = "pageindex z-sel" : this.pagecount[i].className = "pageindex";
        } 
      }      
    }
  })
  
  // 热门课程模块
  var templateHotC = "<li class='u-hot f-cb'>\
                      <img width='50px' height='50px'>\
                      <div>\
                        <div class='cttl'></div>\
                        <div class='lcount icn'></div>\
                      </div>\
                    </li>";

  function Hotcourse(options){
    options = options || {};
    // 将返回的数组放入list中,再放入Hotcourse
    this.list = [];

    extend(this.list,options);

    this.container = $('.hot').children()

    this.supcontainer = this.container.parent();

    this._mt = 0;

    this._initEvent();

  }

  extend(Hotcourse.prototype,{
    //增加课程
    addcourse:function(i){

    this.container.append($(templateHotC));

    this.setcourse(i);

    },
    // 设置课程样式
    setcourse:function(i){

      this.container.children().eq(i).find('img').attr('src',this.list[i].smallPhotoUrl)

      this.container.children().eq(i).find('.cttl').text(this.list[i].name)

      this.container.children().eq(i).find('.lcount').text(this.list[i].learnerCount)
    },
    // 滚动排行榜
    scroll:function(){

      if(this.container.css('marginTop') == '-1400px'){

        this.container.css('marginTop','0px')
      }

      this.container.animate({marginTop:'-=70px'},1000)
    },
    // 滚动
    start:function(){
      this.timer = setInterval(this.scroll.bind(this),5000)
    },
    // 停止
    stop:function(){
      clearInterval(this.timer);
    },
    // 初始化事件
    _initEvent:function(){
      // 调用Course的addcourse函数
      for(var i = 0,length=this.list.length;i<length;i++){
        this.addcourse(i)
      }
      // 克隆一个节点,用于后期滚动
      this.supcontainer.append(this.container.clone(true));
      // 开始滚动
      this.start();

      this.supcontainer.on("mouseover",this.stop.bind(this))

      this.supcontainer.on("mouseout",this.start.bind(this))
    }

  })

  // video Modal 视频弹窗
  var templateVModal = 
  "<div class='m-modal'>\
    <div class='align'></div>\
    <div class='vct'>\
      <div class='zttl'>遇见更好的自己</div>\
      <div class='zcls icn'></div>\
      <div class='u-playbtn'></div>\
      <video src='http://mov.bn.netease.com/open-movie/nos/mp4/2014/12/30/SADQ86F5S_shd.mp4'  width='960px'></video>\
      <div>\
  </div>";

  function VModal(){

    this.container = $(templateVModal)

    this.mask = $('<div class=\'f-mask\'></div>')

    this.cls = this.container.find(".zcls");

    this.playbtn = this.container.find(".u-playbtn");
    // video本体
    this.vcontent = this.container[0].getElementsByTagName("video")[0];

    this._initEvent();
  }

  extend(VModal.prototype,{

    show:function(){
      $('body').append(this.container);

      $('body').append(this.mask);
    },

    hide:function(){
      this.container.remove()

      this.mask.remove()
    },

    play:function(){
      this.vcontent.play();
      this.playbtn.toggle()
    },

    pause:function(){
      this.vcontent.pause();
      this.playbtn.toggle()
    },

    judge:function(){
      if(this.vcontent.paused){
        this.play()
      }else {this.pause()}
    },

    _initEvent:function(){

      this.cls.on("click",this.hide.bind(this));
      // 点击视频外,关闭视频
      this.container.on("click",function(e){
        if(e.target.className == "m-modal"){
          this.hide();
        }
      }.bind(this));
      // 点击视频实现播放/暂停
      this.vcontent.addEventListener("click",this.judge.bind(this));

      this.show();

      this.play();
    }
  })
  
  // 暴露接口
  window.Follow = Follow;
  window.Login = Login;
  window.Slider = Slider;
  window.Course = Course;
  window.Hotcourse = Hotcourse;
  window.VModal = VModal;

  var winWidth = window.innerWidth,
      flag = 1,
      url = "https://study.163.com/webDev/couresByCategory.htm",
      data = {pageNo:1,psize:20,type:10},
      hoturl = "https://study.163.com/webDev/hotcouresByCategory.htm";

  // 若窗口宽度小于1205px,每页放15个
  if(winWidth < 1205){
    data.psize = 15;
    flag =0;
  }
  //函数节流
  function throttle(method,context){
            clearTimeout(method.tId);
            method.tId=setTimeout(function(){
                method.call(context);
            },500);
        }
  // 检测窗口函数,实时改变布局
  function changewindow(){
    if(window.innerWidth < 1205  && flag ==1){
      flag = 0;

      data.psize = 15;

      course.msg.innerText = "";

      get(url,data,function(obj){
      course = new Course(obj);
      });
    }else if(window.innerWidth >=1206 && flag ==0){
      flag = 1;

      data.psize = 20;

      course.msg.innerText = "";

      get(url,data,function(obj){
      course = new Course(obj);
      });
    }
  }
  window.onresize = function(){
    throttle(changewindow,window)
  }
  // 获取课程数据
  get(url,data,function(obj){
    course = new Course(obj);
  });
  // 获取榜单数据
  get(hoturl,"",function(arr){
    hotcourse = new Hotcourse(arr);
  })
})()