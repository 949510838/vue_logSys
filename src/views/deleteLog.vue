<template>
  <div>
    <div @click="autoDelete"  class="app">
      <ul class="ul">
        <li><h1>日志删除</h1></li>
        <li></li>
        <li><span class="iconfont" style="font-size:24px;">&#xe64e;</span><span> 点击此处进行设置</span></li>
      </ul>
    </div>

    <el-dialog title="定期清理日志" :visible.sync="dialogFormVisible" center width="550px"  >
      <div style="margin-bottom:20px;">
        <el-alert
          title="定期清理日志说明"
          type="warning"
          description="开启该功能后，系统将在每天凌晨2点自动删除n个月前的日志，n为下面输入框所输入的“清理频率”参数（请输入整数）。关闭该功能后系统将不再自动删除日志。用户手动删除日志在“查看日志”的面板中操作。"
          show-icon
          :closable="false">
        </el-alert>
      </div>
      <el-form :model="form" >
        <el-form-item label="定期清理日志：" :label-width="formLabelWidth" style="text-align:left;">			    	
          <el-radio-group v-model="form.RateRadio" @change="RateSwitch" >
              <el-radio-button label="开启"></el-radio-button>
              <el-radio-button label="关闭"></el-radio-button>				      
          </el-radio-group>			    	
          <span id="rateTip" v-show="form.setRateRadioTip">&nbsp;&nbsp;点击“保存设置”生效</span>
        </el-form-item>			    
        <el-form-item label="当前清理频率：" :label-width="formLabelWidth" >
          <span class="currRate">{{form.currentRate}}</span>
        </el-form-item>
        <el-form-item label="设置新清理频率：" :label-width="formLabelWidth" v-show="!form.showSetRate" >					
          <div class="newRateInput" >						
            <el-input style="width:200px" @focus="setRate" v-model="form.newRate" autofocus="true" maxlength="3" show-word-limit >
              <template slot="prepend">每</template>
              <template slot="append"> 月</template>
            </el-input>
            <span id="rateTip" v-show="form.setRateTip" style="text-align:left!important;">&nbsp;&nbsp;请输入正整数（单位：月）</span>
          </div>				
          <el-alert  title="保存失败" type="error" style="line-height:20px;magin:5px 0;width:200px;" description="请输入大于0 的正整数"  v-if="form.checkIsInt" show-icon :closable="false"></el-alert>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRate" >保存设置</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style scoped>
  .app {
    margin: 30px auto;    
    transition: margin-top 0.5s;
		transition: all 0.5s;
    background-color: #f6f6f6;
  }
  .ul {
    margin: 0 auto;   
    list-style-type: none;
    padding: 0;
  }
  .ul li{
    display: block;
    margin: 0;    
  }
  .ul li:nth-child(1) h1 {
    margin: 0;
    padding: 10px 0; 
    line-height: 50px;
  }
  .ul li:nth-child(2){
    margin: 0 auto;
    background:url('../assets/images/setting.png') no-repeat center;
    background-size: 100% 100%;
    transition:all 0.75s;
  }
  .ul li:last-child {
    text-align: center;
  }
  .app:hover {
      margin-top: 20px;
      border: 1px solid #f5f5f5;
			box-shadow: 0px 0px 50px  rgba(46,46,46,0.2);
      cursor: pointer; 
      background-color: #f5f5f5;     
  }
  .app:hover li:nth-child(2) {
    transform:rotate(180deg);
  }
 
  .ul li:nth-child(3) span {
    font-size: 22px;
    vertical-align: middle;
    color: #7ec3e6;
  }
  
  h1 {
    text-align: center;
    color: #333333;
    font-size: 30px;
  }
  .currRate {
    display: block;
    border: 1px solid #dcdfe6;
    height: 40px;
    width: 150px;
    border-radius: 4px;
    text-align: center;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    cursor:default;
  }
  .newRateInput {
    width: 200px;
    overflow: hidden;
    box-shadow: 2px 2px 20px 0 rgba(157, 182, 223, 0.863);
  }

  
</style>

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

        dialogTableVisible: false,
        dialogFormVisible: false,
        form: {           
          delivery: false,      
          desc: '',
          
          currentRate: "还未开启自动清理",
          newRate: '',
          setRateTip: false,
          showSetRate: false,
          RateRadio: '关闭',
          setRateRadioTip: false,
          checkIsInt: false
        },
        formLabelWidth: '125px',
      }
    },
    methods:{
       
        autoDelete() {  
          var this_ = this;	           	
          this_.form.setRateRadioTip = false;
          this_.form.setRateTip = false;
          this_.form.checkIsInt = false;
          
          this_.dialogFormVisible = true;            	
          this_.form.newRate = "";
          var url =  "/getDeleteRate";
          this_.$http.post(url, null)
          .then(function (response) { //提交成功的操作
            var d_rate = response.data;
            if(d_rate.rate != 0) {   					
              this_.form.currentRate = "每 " + d_rate.rate + " 个月"; 
              this_.form.RateRadio = "开启";
              this_.form.showSetRate = false;
            }else {      					
              this_.form.currentRate = "还未开启自动清理";
              this_.form.RateRadio = "关闭";
              this_.form.showSetRate = true;
            }                             
          })
          .catch(function (error) { //提交失败的操作
            console.log(error);
          });

        },
            
        saveRate() {
          var this_ = this;
          this_.form.newRate =  this_.form.newRate.replace(/\s/g,"");
          var IsInt = /^[0-9]*[1-9][0-9]*$/.test(this_.form.newRate);
          if(!IsInt&&this_.form.RateRadio == "开启") {
            this_.form.checkIsInt = true;
            return;
          }
          
          var tag = "";
          if(this_.form.RateRadio == "关闭") {
            tag = "关闭日志自动清理";
          }else {
            tag = "每 " + this_.form.newRate + " 个月";
          }
                        
          this_.$confirm('确认设置为：'+tag, '提示', {
              confirmButtonText: '确定设置',
              cancelButtonText: '取消',
              type: 'info'
          }).then(function() {
              var url = "/setDeleteRate";
              var rate = this_.form.newRate;
              if(this_.form.RateRadio == "关闭") {
                rate = "0";
              }
              var sendData = {
                rate: rate
              };
              //通过qs序列化提交的json参数
              var sendDataQs = this_.$qs.stringify(sendData);
              this_.$http.post(url, sendDataQs).then(response => { //提交成功的操作
                  this_.dialogFormVisible = false;
                  const h = this_.$createElement;
                  this_.$message({
                    type: 'success',
                    offset: 100,
                    message: h('p', null, [
                      h('span', null, ''),
                      h('i', { style: 'color: #67c23a;font-size:15px;font-weight:700' }, '设置成功！')
                    ])
					        });   
              }).catch(error => { //提交失败的操作
                console.log(error);
              });

          }).catch(function() {});
                  
        },
        
        setRate() {
          //console.log(this_.form.setRateTip);
          //$("#rateTip")[0].style.display = "block";
          //$("#rateTip").show();
          //$("#rateTip").css("display","block");
          var this_ = this;
          this_.form.setRateTip = true;

        },
        
        RateSwitch() {
          var this_ = this;
          this_.form.setRateRadioTip = true;
          this_.form.setRateTip = false;
          this_.form.checkIsInt = false;
          var rateSwitch = this_.form.RateRadio;
          if(rateSwitch == "开启") {
            this_.form.showSetRate = false;
          }else {
            this_.form.showSetRate = true;
          }
        }
    },
    created() {
      var this_ = this;
      var url =  "/getDeleteRate";
      this_.$http.post(url, null).then(function (response) { //提交成功的操作
        var d_rate = response.data;
        if(d_rate.rate != 0) {   					
          this_.form.currentRate = "每 " + d_rate.rate + " 个月"; 
          this_.form.RateRadio = "开启";
          this_.form.showSetRate = false;
        }else {      					
          this_.form.currentRate = "还未开启自动清理";
          this_.form.RateRadio = "关闭";
          this_.form.showSetRate = true;
        }                             
      })
      
    },
    mounted() {       
      //var min_height = window.innerHeight * 1.0 +"px";        	
      //this.$refs.main.src = "table/logList.jsp";
      // 设置删除盒子的自适应
      $(function(){
        $(".app").width($("#main").height()*0.9);
        $(".ul").height($("#main").height()*0.9);
        $(".ul li:eq(1)").height($("#main").height()*0.6);
        $(".ul li:eq(1)").width($("#main").height()*0.6);
        $(".ul li:eq(2)").height($(".ul").height()-$(".ul li:eq(1)").height()-$(".ul li:eq(0)").height());
        $(".ul li:eq(2) span").css("line-height", ($(".ul").height()-$(".ul li:eq(1)").height()-$(".ul li:eq(0)").height())+"px");
        $(window).resize(function() {
          $(".ul").height($("#main").height()*0.9);
          $(".ul li:eq(1)").height($("#main").height()*0.6);
          $(".ul li:eq(1)").width($("#main").height()*0.6);
          $(".ul li:eq(2)").height($(".ul").height()-$(".ul li:eq(1)").height()-$(".ul li:eq(0)").height());
          $(".ul li:eq(2) span").css("line-height", ($(".ul").height()-$(".ul li:eq(1)").height()-$(".ul li:eq(0)").height())+"px");
        })
      });

    },
    watch: {
     
    }

  };
</script>
