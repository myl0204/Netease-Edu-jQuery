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
      }.bind(this))$.param()
      //关注
      this.follow.click(function(){
      if(document.cookie.indexOf("loginSuc=")==-1){
          login = new Login();
        }else{
          var url = "http://study.163.com/webDev/attention.htm";
          get(url,"",function(num){
            try{
              if(num==1){
                document.cookie = "followSuc=1";
                this.status_un();
              }
            }catch(ex){
              //
            }
          }.bind(this));
        }
      }.bind(this))
  	}
  })
  window.Follow = Follow
// })()