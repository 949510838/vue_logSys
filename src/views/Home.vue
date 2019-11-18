<template>
  <div class="home">
    <el-container  id="box" style="height: 100%; border: 1px solid #eee">
      <el-header id="header" style="text-align: right; font-size: 12px;padding:0;height:60px;">
        <div style="display: flex;justify-content: space-between;flex-flow:row nowrap;overflow:hidden;">
          <div style="margin-left:0px" >	            				 
            <img src="../assets/images/head.png" style="width:650px;height:60px;" >
          </div>
          <div style=" padding-right:20px;display: flex;justify-content: space-between;flex-flow:row nowrap;overflow:hidden;">
            <el-menu
              :default-active="activeIndex2"
              class="el-menu-demo"
              mode="horizontal"
              @select="handleSelect"
              background-color="#3e789b"
              text-color="#fff"
              active-text-color="#ffd04b"
              style="height:60px">
              <el-menu-item index="1" @click="backHome"><i class="el-icon-s-home" style="color:#fff"></i>返回首页</el-menu-item>
              <el-submenu index="2" show-timeout="0" hide-timeout="0">
                <template slot="title"><i class="el-icon-user-solid" style="color:#fff"></i>帐号</template>
                <el-menu-item index="2-1" @click="exitAccount" style="text-align:center;"><span class="iconfont" >&#xe60f;</span> 注销登录</el-menu-item>
                <el-menu-item index="2-2" @click="switchAccount" style="text-align:center;"><span class="iconfont" >&#xe611;</span> 切换帐号</el-menu-item>
              </el-submenu>
            </el-menu>
          </div>					 			   				
        </div>             
      </el-header>   
          
      <el-container >
        <el-aside :width="asideWidth"  >
          <el-radio-group v-model="isCollapse" class="asideButton"  size="small">
            <el-radio-button :label="false" >展开</el-radio-button>
            <el-radio-button :label="true" v-if="!isCollapse" >收起</el-radio-button>
          </el-radio-group>
          <el-menu router active-text-color="#0f87ce" class="el-menu-vertical-demo" :collapse="isCollapse" id="nav" background-color="#D3DCE6">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-time"></i>
                <span slot="title">日志管理</span>
              </template>
              <el-menu-item-group>
                <span slot="title"></span>
                <el-menu-item index="/logList"><span class="iconfont" >&#xe62b;</span> 查看日志</el-menu-item>
                <el-menu-item index="/deleteLog" ><span class="iconfont" style="font-size:15px;" >&#xe641;</span> 日志删除</el-menu-item>
              </el-menu-item-group>             
            </el-submenu>
          </el-menu>
        </el-aside>
        
        <el-main style="padding:0;"  id="main">
          <!-- elementui的过渡动画 -->
          <el-collapse-transition>
            <router-view></router-view>
          </el-collapse-transition>        
        </el-main>
 
      </el-container>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

// export default {
//   name: 'home',
//   components: {
//     HelloWorld
//   }
// }
export default {
    data() {      
      return {

        isCollapse: false,  //导航栏开关
        asideWidth:'170px',  //侧边栏的宽度     
      }
    },
    methods:{
        // 返回首页                     
        backHome() {
          $(location).attr('href', '/');
        },
        // 退出登录
        exitAccount() {
          alert('注销成功');
        },
        // 切换账户
        switchAccount() {
          alert('切换成功');
        }
     
    },
    
    mounted() {       
      //var min_height = window.innerHeight * 1.0 +"px";        	
      //	this.$refs.main.src = "table/logList.jsp";
      //在 Vue 实例内部，可以通过 $router 访问路由实例。可以调用 this.$router.push相当于<router-link :to="...">
      // 带查询参数，变成 /register?plan=private : this.$router.push({ path: 'register', query: { plan: 'private' }})      
      this.$router.push('/logList');   
      $(function(){                   
        $("#box").height($(window).height()*0.97);
        $("#main").height($("#box").height()-60);
        $(window).resize(function(){
          $("#box").height($(window).height()*0.97);
          $("#main").height($("#box").height()-60);  	              
        })
      })
      	
    },
    watch: {
      // 监听导航栏的开关
      isCollapse(val) {  
        if(this.isCollapse) {
          this.asideWidth = "64px";
        }else {
          this.asideWidth = "170px";
        }        
      }
    }

  };
</script>
<style scoped>
  #nav {
    transition: cubic-bezier(0.075, 0.82, 0.165, 1);
  }
  .el-header {
    background-color: #3e789b;
    color: #333;
    line-height: 60px;
  }
   .el-aside {
    background-color: #D3DCE6;
    color: #333;
    overflow:hidden;
  }
  .asideButton {
   display: flex;
   justify-content: center;
   flex-flow: row nowrap;
   margin-top: 20px;
   margin-bottom: 20px;
  }
  
 
</style>

