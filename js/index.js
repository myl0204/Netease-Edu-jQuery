// (function(){
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
      index >3?index=1:index=index;
      // 遍历所有"圆点",添加基本类名
      for(var i = 0,length=this.pageNum;i<length;i++){
        this.pointes[i].className = "u-p";
      }
      // 当前"圆点"添加"z-crt"类名
      this.pointes[index-1].className += " z-crt";
      // 改变src,实现轮播
      this.slides.src = this.images[index-1];
      // 改变url
      this.link.href = this.urls[index-1];

      this.slides.style.cssText = "opacity:0;";
      // 通过获取位置属性,清空浏览器对样式的缓存
      this.slides.offsetHeight;
      // 淡入
      this.slides.style.cssText = "opacity:1;transition-property:opacity;transition-duration:0.5s;transition-timing-function:ease-in;"

      this.pageindex = index;
    },
    // 执行轮播,5s一次
    // start:function(){
    //   this.timer = setInterval(this.change.bind(this),5000)
    // },
    // 停止轮播
    stop:function(){
      clearInterval(this.timer);
    },
    // 初始化,设置'首页'图片,对应"圆点"样式以及链接,开始轮播
    _initEvent:function(){

      this.container.append(this.slider);

      this.link.attr('href',this.urls[this.pageindex-1]) 

      this.slides.attr('src',this.images[this.pageindex-1])

      this.pointes[this.pageindex-1].className+=" z-crt";
      // 添加'圆点'点击事件,采用事件代理
      this.pointer.bind("click",function(e){
        var target = e.srcElement ? e.srcElement:e.target
        if(target.tagName=="I"){
          this.stop();
          this.pageindex = dataset(target).index - 1;
          this.change();
          this.start();
        }
      }.bind(this));

      // 鼠标移入,停止轮播.
      // this.slides.bind("mouseover",function(){
      //   this.stop();
      // }.bind(this));
      // // 鼠标移出,重新开始轮播
      // this.slides.bind("mouseout",function(){
      //   this.start();
      // }.bind(this));
      // 开始轮播
      // this.start();
    }
  })
  window.Follow = Follow
// })()