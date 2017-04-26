// (function(){
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

  	this._appendtohtml();

  	this.follow = $('.u-follow #follow')

  	this.followed = $('.u-follow .followed')
    // 取消关注按钮
    this.unfollow = $('.followed .unfollow')
    // 关注人数
    this.fcount = $('.u-follow .fancount')

  	this._initEvent();
  }

  extend(Follow.prototype,{
  	_appendtohtml:function(){
  		this.container.insertAfter(".title")
  	},
  	status_switch:function(){
      var f_val = Number(this.fcount.text());

      $('#follow').is(':hidden')? this.fcount.text(f_val - 1) : this.fcount.text(f_val + 1)

  		this.follow.toggle();
  		this.followed.toggle();
  	},
  	_initEvent:function(){
  		var _this = this
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
          $.get(url,"",function(data){
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
      this.form.bind("submit",function(e){
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
      this.pointer.bind("click",function(e){
        if(e.target.tagName=="I"){
          this.stop();
          this.pageindex = e.target.dataset.index - 1;
          this.change();
          this.start();
        }
      }.bind(this));

      // 鼠标移入,停止轮播.
      this.slides.bind("mouseover",function(){
        this.stop();
      }.bind(this));
      // // 鼠标移出,重新开始轮播
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
    this.coursecount = this.container.bind(".u-course");
    // 页码器
    this.pager = $('.m-page')
    // 页数,jQuery选择器不是动态的,所以这里用原生的。
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
      // s.querySelector(".dimg").src = l.middlePhotoUrl;
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
      event = event || window.event;
      this.msg.text('');
      if(event.target.tagName == "LI"){
        var index = event.target.dataset.index,
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
            // 改用ele.onlick注册事件,解决
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
      }
    },

    // 初始化事件,根据现有的课程数和获取到的课程数来增删/设置课程
    _initEvent:function(){
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
            this.container.removeChild(children(this.container)[0])
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

            $pageindex.insertBefore($('.icn .right'));
          }
         
          // 注册tab的点击事件,采用事件代理
          var $coursetab = $('.u-tab');
          $coursetab.bind("click",function(e){

            if(e.target.tagName == "LI"){
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
              // // 遍历所有tab,设置基本类名
              // for(var i = 0,length = children(coursetab).length;i<length;i++){
              //   children(coursetab)[i].className = "";
              // }
              // // 当前tab设置'z-sel'
              // target.className = "z-sel"
              $coursetab.children().toggleClass('z-sel')
              get(url,data,function(obj){
                course = new Course(obj)
              })
            }
          })
        }else if (this.pagecount.length < this.totalPage){ // 页面总页码数小于从服务器获取的总页码数时
          for(var i = this.pagecount.length ; i<this.totalPage;i++){

            var pageindex = document.createElement("li");

            pageindex.className = "pageindex";

            pageindex.setAttribute("data-index",i+1);

            pageindex.innerHTML = i+1 ;

            this.pager.insertBefore(pageindex,children(this.pager)[i+2]);
          }
        }else if(this.pagecount.length > this.totalPage){ //页面总页码数大于从服务器获取的总页码数时
          for(var i = this.totalPage;i<this.pagecount.length;i++){

            this.pager.removeChild(children(this.pager)[i+2]);
            
          }
        }
        // 对页码器进行事件代理,执行跳转
        // addEvent(this.pager,"click",this.pmove.bind(this));
        this.pager.onclick = this.pmove.bind(this);
        // 设置页码状态
        for(i=0;i<this.totalPage;i++){
        (i+1) == data.pageNo ? this.pagecount[i].className = "pageindex z-sel" : this.pagecount[i].className = "pageindex";
        } 
      }      
    }
  })

  window.Follow = Follow
// })()