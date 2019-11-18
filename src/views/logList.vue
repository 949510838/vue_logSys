<template>
<div style="padding:20px 20px 5px 20px;" id="sub_main" >
  <!-- 工具栏 -->  
  <div id="tool"> 
	<table>
		<tr>
			<td>
				<div style="width:220px;height:40px;">						
					<el-input
					:placeholder="placeholderValue"
					@focus="queryMessage"	   
					v-model="keywords"
					clearable
					maxlength="6"
					@clear="showList"
					@blur="placeholderValue='请输入关键字'"						
					show-word-limit		    
					>	    
						<el-button slot="append" @click="selectByKey" class="search" icon="el-icon-search">搜索</el-button>
					</el-input>   	  		
				</div>									
			</td>    				
			<td>&nbsp;</td>
			<td>
				<el-select 
				v-model="logType" 
				slot="prepend" 
				clearable 
				multiple="true" 
				collapse-tags="true" 	     
				placeholder="日志类型" 
				@change="TypeOptionChange"
				style="width:140px;">
					<el-option label="增加" value="增加"></el-option>
					<el-option label="删除" value="删除"></el-option>
					<el-option label="修改" value="修改"></el-option>
					<el-option label="查询" value="查询"></el-option>
				</el-select> 
			</td>
			<td>&nbsp;</td>
			<td>
				<el-date-picker
				v-model="timevalue1"
				type="datetime"
				format="yyyy-MM-dd HH:mm"
				value-format="yyyy-MM-dd HH:mm"
				:editable = "false"
				placeholder="选择开始日期时间"
				prefix-icon="el-icon-date"
				@change="timeChange"
				style="width:180px;">
				</el-date-picker>   
			</td>
			<td>&nbsp;</td>
			<td>
				<el-date-picker
				v-model="timevalue2"
				type="datetime"
				format="yyyy-MM-dd HH:mm"
				value-format="yyyy-MM-dd HH:mm"
				:editable = "false"
				placeholder="选择结束日期时间"
				prefix-icon="el-icon-date"
				@change="timeChange"
				align="center"
				style="width:180px;">
				</el-date-picker> 
			</td>		
			<td>&nbsp;</td>
			<td>
				<el-button type="success" class="getAll"  @click="getAllLog" icon="el-icon-refresh" style="width:120px;height:40px;text-align:center;padding:12px 0;">获取全部数据</el-button>
			</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>
				<el-tooltip content="导出到Excel" class="export" placement="top" effect="dark">
					<el-button type="info" icon="el-icon-document" round @click="export2Excel" style="width:80px;height:40px;text-align:center;padding:12px 0;">导出</el-button>   
				</el-tooltip>
      </td> 
      			
		</tr>
	</table>           	       
  </div>
  <!-- 日志表格 -->
  <div id="table" style="padding-top: 10px">
	  <el-table
	  	v-loading="loading"
	    ref="multipleTable"
	    :data="tableData"
	    border="true"
		
	    style="width: 100%;"
	    @selection-change="selectChange" 
	    :height="tableHeight"	    
	    :header-cell-style="{background:'#81BEF7',color:'#FFFFFF'}"
	    empty-text="无可匹配的数据或数据未载入，点击“获取全部数据”载入全部数据，或重新调整匹配条件后再试"
	    fit="false"
	    >
	    <el-table-column
	      type="selection"
	      width="55"
	      align='center'>
	    </el-table-column>
	    <el-table-column type="expand" label="详细" width="60">
	      <template slot-scope="props">
	        <el-form label-position="left" inline class="demo-table-expand">          
	          <el-form-item label="日志来源：">
	            <span>{{ props.row.source_name }}</span>
	          </el-form-item>
	          <el-form-item label="日志类型：">
	            <span>{{ props.row.log_type }}</span>
	          </el-form-item>
	          <el-form-item label="提交人员：">
	            <span>{{ props.row.operator }}</span>
	          </el-form-item>
	          <el-form-item label="日志内容：">
	            <span>{{ props.row.content }}</span>
	          </el-form-item>
	          <el-form-item label="日志备注：">
	            <span>{{ props.row.remarks }}</span>
	          </el-form-item>                  
	          <el-form-item label="生成日期：">
	            <span>{{ props.row.log_date }}</span>
	          </el-form-item>                  
	        </el-form>
	      </template>
	    </el-table-column>
	     <el-table-column
	      prop="source_name"
	      label="来源"
	      width="120"
	      align='center'>
	    </el-table-column>
	    <el-table-column
	      prop="log_type"
	      label="类型"
	      width="80"
	      align='center'>
	    </el-table-column>
	     <el-table-column
	      prop="operator"
	      label="操作人"
	      width="120"
	      align='center'>
	    </el-table-column> 
	    <el-table-column
	      prop="content"
	      label="内容"
	      width="200"
	      align='center'
	      show-overflow-tooltip>
	    </el-table-column>  
	    <el-table-column
	      prop="remarks"
	      label="备注"
	      width="180"
	      align='center'
	      show-overflow-tooltip>
	    </el-table-column>  
	   
	    <el-table-column
	      prop="log_date"
	      label="日期"       
		  align='center'
		  show-overflow-tooltip
	       >
	    </el-table-column>
	  </el-table>

  </div>
  <!-- 翻页栏 -->
  <div id="paginate" style="display:flex;justify-content: space-between;flex-flow:row nowrap;overflow:hidden;padding-top:10px">
      <div style="display:flex;justify-content: space-between;flex-flow:row nowrap;">
          <el-tooltip content="删除选中数据" class="delete" placement="top" effect="dark">
	  		<el-button type="danger" icon="el-icon-delete" @click="deleteData" size="small">删除选中</el-button>
		  </el-tooltip>
          <div>
              <i class="el-icon-edit" style="line-height:32px;margin-left:20px;letter-spacing:1.5px">已选中<span style="color:red;">{{selectCount}}</span>条</i>
          </div>
      </div>
      <div>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20, 50,100,300]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalcount"
            background
            style="display:flex;justify-content:flex-end;">
          </el-pagination>
      </div> 	
   </div>  
</div>
</template>
<script>

    export default {
        data() {      
            return { 

                idStr : "",
                printStr : "",
                logType: [],
                timevalue1: "",
                timevalue2: "",
                keywords: "",
                placeholderValue: "请输入关键字",
                selectCount: 0,
                sendDataArr: [],
                tableHeight: $("#main").height() - $("#tool").height() - $("#paginate").height() - 50,
                tableData: [],
                currentPage: 1,
                pagesize: 10,
                totalcount: 0,
            }
        },
        methods: {
          
          deleteData() {
        	  var this_ = this;	  
        	  var arr = this_.$refs.multipleTable.selection;
        	  var cur = this_.currentPage;
            var total = this_.totalcount - arr.length;
            var flag = false;
        	  if(arr.length == 0) {
                this_.$alert('您还未选中记录','提示',  {
                    confirmButtonText: '确定',
                    type: 'info',
                });
        		    return;
            }
              
            this_.$confirm("此操作将永久删除选中的 "+ arr.length +" 条数据", '警告', {
              confirmButtonText: '确定删除',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if(cur > (total/this_.pagesize)&&total%this_.pagesize == 0) {
                  if(cur-1 != 0) {
                      this_.currentPage = cur - 1;
                  }else {
                      flag = true;
                  }         		        					
              }
              //获取选中的数据的id 
              var arrid = [];
              for(var i=0;i<arr.length;i++) {
                  arrid.push(arr[i].id);
				      }				
              var sendData = {arrid:arrid};
              var url = "/deleteLogData";        						
              //通过qs序列化提交的json参数,对于参数中含有数组对象时，还需要将数组参数格式化 .stringify(发送的有数组参数json数据,格式模板);
              var sendDataQs = this_.$qs.stringify(sendData,{arrayFormat: 'brackets'});
              this_.$http.post(url, sendDataQs).then(response => { //提交成功的操作			
                this_.showList();
                this_.getPage();  
                if(flag) this_.getAllLog();
                const h = this_.$createElement; 
                this_.$message({
                  type: 'success',
                  offset: 100,
                  message: h('p', null, [
                    h('span', null, ''),
                    h('i', { style: 'color: #67c23a;font-size:15px;font-weight:700' }, '删除成功')
                  ])
                });             				
              }).catch(error => { //提交失败的操作
					
				      });
   
            }).catch(() => {
              const h = this_.$createElement; 
              this_.$message({
                type: 'info',
                offset: 100,
                message: h('p', null, [
                  h('span', null, ''),
                  h('i', { style: 'color: #909399;font-size:15px;font-weight:700' }, '操作已取消')
                ])
              });        
            });
        	  
          },
          //统一查询的入口
          showListOld() {
            var this_ = this;
            this_.sendDataArr = [];
            var sql_time = this_.getTimeDateSql();
            if(sql_time == "timeError") {
              this_.tableData = [];  
              return;
            }
            var sql = "SELECT al.id,al.source_id,ls.source_name,al.log_type,al.operator,al.content,al.remarks,al.log_date "+
            " FROM all_log al inner join log_source ls " +
            " on al.source_id=ls.id ";
            //去除全部空格	
            var kw = this_.keywords.replace(/(^\s*)|(\s*$)/g, "");
            var kwIsNotNull = false; //判断关键字输入框的是否为空的标记，用于查询的时候循环
            if(kw != "") kwIsNotNull = true;
            var sql_logType = this_.logType;
            var url = "/getLogByKey";  				 				
            if(sql_time==""&&sql_logType.length==0) {
              sql += " ";
            }else if(sql_logType.length == 0&&sql_time!=""){  				
              sql += " where " + sql_time ;
            }else if(sql_time == ""&&sql_logType.length!=0){
              sql += " where (";
              
              var i;
              for(i=0;i<(sql_logType.length-1);i++) {
              this_.sendDataArr.push(sql_logType[i]);
                sql += " al.log_type=?  or";
            }
            this_.sendDataArr.push(sql_logType[i]);
              sql += " al.log_type=? ) "
            }else { 				
              sql += " where "+sql_time + " and ("
              var i;
              for(i=0;i<(sql_logType.length-1);i++) {
              this_.sendDataArr.push(sql_logType[i]);
                sql += " al.log_type=? or";
            }
            this_.sendDataArr.push(sql_logType[i]);
            sql += " al.log_type=? )"  				
            }
            if(kw != ""&&sql_time==""&&sql_logType.length==0) {
            sql += " where " + this_.getKeyWordSql();
            this_.sendDataArr.push(kw);
            }else if (kw != ""&&(sql_time!=""||sql_logType.length!=0)) {
            sql += " and " + this_.getKeyWordSql();
            this_.sendDataArr.push(kw);			
            }
            var sendData = {
              sql: sql,
              pageSize: this_.pagesize,
              para: this_.sendDataArr,
              kwIsNotNull: kwIsNotNull,
              currentPage: 1
            };

            //通过qs序列化提交的json参数
            var sendDataQs = this_.$qs.stringify(sendData,{arrayFormat: 'brackets'});
            this_.$http.post(url, sendDataQs)
            .then(function (response) { //提交成功的操作
              //console.log(response)
              var jsarr = response.data;
                //alert(jsarr[2].id);
                if(jsarr.length != 0) {
                  this_.totalcount = jsarr[0].totalC;  					
                }else {
                  this_.totalcount = 0;
                }
                this_.tableData = jsarr;	             
            })
            .catch(function (error) { //提交失败的操作
              alert(error);
            });


          // $.post(url,sendData,function(backData,textStatus,ajax){  				
          // 	var jsarr = JSON.parse( ajax.responseText );
          // 	//alert(jsarr[2].id);
          // 	if(jsarr.length != 0) {
          // 		this_.totalcount = jsarr[0].totalC;  					
          // 	}else {
          // 		this_.totalcount = 0;
          // 	}
          // 	this_.tableData = jsarr;	
              //   });
              
          },
          showList() {
            var this_ = this;
            this_.sendDataArr = [];
            var sql_time = this_.getTimeDateSql();
            if(sql_time == "timeError") {
              this_.tableData = [];  
              return;
            }
            var sql = "SELECT al.id,al.source_id,ls.source_name,al.log_type,al.operator,al.content,al.remarks,al.log_date "+
            " FROM all_log al inner join log_source ls " +
            " on al.source_id=ls.id ";
            //去除全部空格	
            var kw = this_.keywords.replace(/(^\s*)|(\s*$)/g, "");
            var kwIsNotNull = false; //判断关键字输入框的是否为空的标记，用于查询的时候循环
            if(kw != "") kwIsNotNull = true;
            var sql_logType = this_.logType;
            var url = "/getLogByCondition";  				 				
            if(sql_time==""&&sql_logType.length==0) {
              sql += " ";
            }else if(sql_logType.length == 0&&sql_time!=""){  				
              sql += " where " + sql_time ;
            }else if(sql_time == ""&&sql_logType.length!=0){
              sql += " where (";
              
              var i;
              for(i=0;i<(sql_logType.length-1);i++) {
              this_.sendDataArr.push(sql_logType[i]);
                sql += " al.log_type=?  or";
            }
            this_.sendDataArr.push(sql_logType[i]);
              sql += " al.log_type=? ) "
            }else { 				
              sql += " where "+sql_time + " and ("
              var i;
              for(i=0;i<(sql_logType.length-1);i++) {
              this_.sendDataArr.push(sql_logType[i]);
                sql += " al.log_type=? or";
            }
            this_.sendDataArr.push(sql_logType[i]);
            sql += " al.log_type=? )"  				
            }
            if(kw != ""&&sql_time==""&&sql_logType.length==0) {
            sql += " where " + this_.getKeyWordSql();
            this_.sendDataArr.push(kw);
            }else if (kw != ""&&(sql_time!=""||sql_logType.length!=0)) {
            sql += " and " + this_.getKeyWordSql();
            this_.sendDataArr.push(kw);			
            }
            var sendData = {
              sql: sql,
              pageSize: this_.pagesize,
              para: this_.sendDataArr,
              kwIsNotNull: kwIsNotNull,
              currentPage: 1
            };

            //通过qs序列化提交的json参数
            var sendDataQs = this_.$qs.stringify(sendData,{arrayFormat: 'brackets'});
            this_.$http.post(url, sendDataQs)
            .then(function (response) { //提交成功的操作
              //console.log(response)
              var jsarr = response.data;
                console.log(jsarr)                
                this_.totalcount = jsarr.num;  					                
                this_.tableData = jsarr.list;	             
            })
            .catch(function (error) { //提交失败的操作
              alert(error);
            });
              
          },


          getTimeDateSql: function () {
            var this_ = this;	
            var timeS = 0;
      			var timeE = 0;
      			
	          //将YY-MM-DD HH:mm:ss字符串转为日期对象
            //将日期对象转为时间戳
            if(!( !this_.timevalue1 && typeof(this_.timevalue1)!="undefined" && this_.timevalue1!=0)&&this_.timevalue1.replace(/\s*/g,"") != "") {
                  //将YY-MM-DD HH:mm:ss 格式转为 YY/MM/DD HH:mm:ss格式，才能转为date对象(ie)
                  this_.timevalue1 = (this_.timevalue1).replace(/-/g,"/");
                  var dateS = new Date(this_.timevalue1);
                  //date对象转时间戳
                  timeS = dateS.getTime();
              
            }
            if(!(!this_.timevalue2 && typeof(this_.timevalue2)!="undefined" && this_.timevalue2!=0)&&this_.timevalue2.replace(/\s*/g,"") != "") {                      
                  this_.timevalue2 = (this_.timevalue2).replace(/-/g,"/");
                  var dateE = new Date(this_.timevalue2); 
                  timeE = dateE.getTime();
				    } 

        		if(timeS > timeE&&timeE != 0) {
        			this.$alert('开始时间不能大于结束时间，请重新选择！','错误提示',  {
                  confirmButtonText: '确定',
                  type: 'error',
              });
        			return "timeError";
        		}else if(timeS == 0&&timeE == 0) {
					    return "";
        		}else if(timeS ==0&&timeE != 0||timeS !=0&&timeE != 0) {
              this_.sendDataArr.push(timeS+'');
              this_.sendDataArr.push(timeE+'');
        			return " (al.log_date between  ?  and  ?)"; 
        		}else {
				    	this_.sendDataArr.push(timeS+'');
        			return " (al.log_date > ?)" ;
        		}
          	
          },
          
          selectByKey:function() {
            var this_ = this;
        	  this_.logType = [];
        	  this_.timevalue1 = "";
        	  this_.timevalue2 = "";
        	  this_.currentPage = 1;
            //去除所有空格             
        	  this_.keywords = this_.keywords.replace(/(^\s*)|(\s*$)/g, ""); 
        	  var kw = this_.keywords;
        	  //alert(kw);
        	  if(kw == "") {
                  this_.$alert('关键字不能为空','提示',  {
                    confirmButtonText: '确定',
                    type: 'info',
                    roundButton: true
                });                
                return;
        	  }
	 		      this_.showList();
          },
          
          getKeyWordSql() {
            var this_ = this;
        	  this_.keywords = this_.keywords.replace(/(^\s*)|(\s*$)/g, ""); 
        	  var kw = this_.keywords;
        	  //alert(kw);
        	  if(kw == "") {        		  
        		  return " ";
        	  }else {
        		  return  " (ls.source_name LIKE ?  OR al.log_type LIKE ? OR al.operator LIKE ?  OR al.content LIKE ?  OR al.remarks LIKE ? )" ;
        	  }	       	  
          },
          
          TypeOptionChange() {
            var this_ = this;
        	  this_.currentPage = 1;
        	  this_.showList();
          },
          
          getAllLog() {
            var this_ = this;
        	  this_.timevalue1 = "";
        	  this_.timevalue2 = "";
        	  this_.logType = [];
        	  this_.keywords = "";
        	  this_.currentPage = 1;
        	  this_.showList();
          },
          
          timeChange() {
            var this_ = this;
        	  this_.currentPage = 1;
        	  this_.showList();
          },
          
          queryMessage() {
            var this_ = this;
			      this_.placeholderValue = '';
        	  const h = this_.$createElement;
            this_.$message({
              message: h('p', null, [
                h('span', null, '搜索范围： '),
                h('i', { style: 'color: red' }, '来源，类型，操作人，内容，备注'),
                h('br', null, ''),
                h('span', {style:'color: teal'}, '（最多可输入六个字符）')
              ]),
              showClose: true,
              center: true,
              offset: 60
            });
             
          },
          
          export2Excel:function() {
            var this_ = this;             
        	  this_.$confirm('仅导出符合匹配条件的数据，若要导出全部日志数据请点击页面“获取全部数据按钮”后再试。当数据较多时，导出加载速度可能较慢，请耐心等待。', '提示', {
                confirmButtonText: '确定导出',
                cancelButtonText: '取消',
                type: 'info'
              }).then(function() {
                $(location).attr('href', this_.$baseURL + '/downloadxls'); 	
              }).catch(function() {
                          
              });
          },
          
          //长度改变----改变每页显示的条数的时候  自动触发
          handleSizeChange:function(val){
              //alert("长度改变")
              var this_ = this;
              this_.pagesize = val;
              this_.getPage();
          },
          // 当前改变----当前页码改变之后，触发这个函数
          handleCurrentChange:function(val){
            //alert('页码改变')
            var this_ = this;
        	  this_.currentPage = val;
        	  this_.getPage();
          },
          
          getPage() {  
            var this_ = this;          	
          	var url = "/getPage";
    		    var cur = this_.currentPage;
    		
            var sendData = {
              pageSize: this_.pagesize,
              currentPage: cur
            };
            //通过qs序列化提交的json参数
            var sendDataQs = this_.$qs.stringify(sendData);
            this_.$http.post(url, sendDataQs).then(response => { //提交成功的操作			
              var jsarr = response.data;
                if(jsarr.length != 0) {
                  this_.totalcount = jsarr[0].totalC;  					
                }else {
                  this_.totalcount = 0;
                }
                this_.tableData = jsarr;
            }).catch(error => { //提交失败的操作
              console.log(error);
            });
   			
          },

          selectChange() {
              this.selectCount = this.$refs.multipleTable.selection.length;
          }

		},
		created() {
			this.getAllLog();
		},
        //vue生命周期函数，页面加载完成自动调用
    mounted() {        	
      //this_.$refs.main.src = "table/logList.jsp";
			var this_ = this;
			var mainHeight;
      $(function(){	
        mainHeight = $(window).height()*0.97-60;
        this_.tableHeight = mainHeight - $("#tool").height() - $("#paginate").height() - 50;			
        $(window).resize(function() {
            mainHeight = $(window).height()*0.97-60;
            this_.tableHeight = mainHeight - $("#tool").height() - $("#paginate").height() - 50;
        });
      })    
      
      }
    }
    
   



   
</script>

<style scoped>
		.el-select .el-input  {
        width: 140px;
		}
		 
		.demo-table-expand {
		    font-size: 0;
		}
		.demo-table-expand label {
        width: 90px;
        color: #99a9bf;
		}
		.demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 100%;
		}

		.search {
        width:65px;
        text-align:center;
        padding:12px 0;
        background-color: #2195c6!important;
        border-color: #2195c6!important;
        color: #fff!important;
        border-radius: 0 4px 4px 0;
		} 
		  
		.search:hover {
        background-color: #566fa3!important;
        border-color:  #566fa3!important;
        font-weight: 700!important;		
		} 
		.getAll:hover {
        background-color: #469021!important;
        border-color:  #469021!important;
        font-weight: 700!important;	
		} 
		.delete:hover {
        background-color: #e01212!important;
        border-color:  #e01212!important;
        font-weight: 700!important;		
		} 		
		.export:hover {
        background-color: #eaddd7!important;
        border-color:  #eaddd7!important;
        color: #000;
        font-weight: 700!important;		
		} 
   

</style>

