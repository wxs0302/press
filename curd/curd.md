#  CURD前端案例代码

## 包含
- 日历
- 自定义列表
- 表格
- 表单
- 媒体附件管理
<br/>
<img src="/images/curd.png"></img>
<br/>



## JS业务代码概览(源码在下面)
<img src="/images/1.png"></img>
<img src="/images/2.png"></img>


## 页面内源码

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Title</title>
    <%- include('../00frame/headRefer.html') %>
        <link rel="stylesheet" href="<%=resourceurl %>/10EngineerCheck/02RegulagTasks/03RegulagTasksExe.css" />
        <script type="text/javascript" src="<%=resourceurl %>/controls/holdcommonjs/easyuiValidate.js"></script>
        <script type="text/javascript"
            src="<%=resourceurl %>/10EngineerCheck/02RegulagTasks/js/uploadAndPreview.js"></script>

        <style>
            .calendar-exe-num {
                position: absolute;
                width: 2vh;
                height: 2vh;
                background-color: #1a9cfe;
                border-radius: 50%;
                right: 0;
                top: 0;
                font-size: 1.2vh;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #fff;
            }
        </style>


</head>

<body>
    <div class="holdLayout">
        <div class="holdContent left-content" style="width: 40vh;flex:none;">
            <div class="title">
                定期巡检日历
            </div>

            <div class="date">
                <div id="cc" class="easyui-calendar" style="width:180px;height:180px;"></div>
            </div>
            <div style="padding:0 1.5vh;margin-top: 1vh;">
                <div style="border-bottom: 1px solid #ddd;"></div>
            </div>
            <div class="task-list-content">

                <div class="task-list">

                </div>
                <div id="task-item-template" class="task-item" style="display: none;">
                    <div class="state ITEM_TASK_STATE">
                        已上报
                    </div>
                    <div class="fz14 text-blue-1 flex mb-05 items-center">
                        <div class="task-type fz12 ITEM_TASK_TYPE">任务类型</div>
                        <span class="ITEM_TASK_NAME"></span>
                    </div>
                    <div class="fz12 text-blue-2 flex border-b">
                        <span class="label text-black">负责科室:</span> <b class="ITEM_TASK_MANA"></b>
                    </div>
                    <div class="fz12 text-blue-2 flex border-b mb-1">
                        <div class="label text-black">负 责 人 :</div> <b class="ITEM_TASK_PERSON"></b>

                    </div>
                    <div class="fz12 text-blue-2 fz12 mb-2">
                        <div class="label text-black mb-1">任务说明 :</div>
                        <span class="ITEM_TASK_INFO"></span>
                    </div>
                    <div class="child-data">
                        <div class="arc">
                            <div class="c"></div>
                        </div>
                        <div class="between border-b-2">
                            <div class="item">
                                <div class="fz12 label text-black">执行单位</div>
                                <div class="value text-blue-2 EXE_DEPT_ID"></div>
                            </div>
                            <div class="item">
                                <div class="fz12 label text-black">执行人</div>
                                <div class="value text-blue-2 EXE_USER_NAME"></div>
                            </div>
                        </div>
                        <div class="between mb-1 border-b-2">
                            <div class="item">
                                <div class="fz12 label text-black">巡检地点</div>
                                <div class="value text-blue-2 EXE_TASK_POSITION"></div>
                            </div>
                            <div class="item">
                                <div class="fz12 label text-black">参与人</div>
                                <div class="value text-blue-2 EXE_PARTICIPANTS"></div>
                            </div>
                        </div>

                        <div class="text-black-2 fz10  mb-0">

                        </div>
                    </div>
                </div>
            </div>

        </div>
        <div class="holdContent">

            <div id="file-manager"></div>


            <div class="holdToolbar">

                <div class="headerCondition">
                    <h1>执行管理单位</h1>
                    <input id="QUERY_MANA_NAME" class="easyui-textbox" data-options="min:1,max:10,editable:true"
                        type="text">
                </div>

                <div class="headerCondition">
                    <h1>执行人姓名</h1>
                    <input id="QUERY_USER_NAME" class="easyui-textbox" data-options="min:1,max:10,editable:true"
                        type="text">
                </div>

                <div class="headerCondition">
                    <h1>巡检地点</h1>
                    <input id="QUERY_TASK_POSITION" class="easyui-textbox" data-options="min:1,max:10,editable:true"
                        type="text">
                </div>

                <div class="headerButton">
                    <a href="#" id="QueryButton" class="easyui-linkbutton" iconCls="icon-search">
                        <p>查询</p>
                    </a>
                    <a id="AddButton" class="easyui-linkbutton EDITshow" iconCls="icon-add">
                        <p>新增</p>
                    </a>
                    <a id="DelButton" class="easyui-linkbutton EDITshow">
                        <p>删除</p>
                    </a>
                    <a id="ExportButton" class="easyui-linkbutton EDITshow" iconCls="icon-excel">
                        <p>输出Excel</p>
                    </a>
                </div>

            </div>


            <div class="holdContentDiv">
                <div id="divEdit" class="divEdit">
                    <!--添加/编辑表单-->
                    <div class="editMatt">

                        <div class="mattBar">
                            <span class="star EDITshow">*</span>
                            <span>任务名称</span>
                            <select id="TASK_ID" class="easyui-combobox EDITreadonly textbox50"
                                data-options="editable:false,required:true" name="dept">
                            </select>
                        </div>

                        <div class="mattBar">
                            <span class="star EDITshow">*</span>
                            <span>执行管理单位</span>
                            <select id="DEPT_ID" class="easyui-combobox EDITreadonly textbox50"
                                data-options="editable:false,required:true" name="dept">
                            </select>
                        </div>

                        <div class="mattBar">
                            <span class="star EDITshow">*</span>
                            <span>执行人姓名</span>
                            <input id="USER_NAME" data-options="editable:true,required:true"
                                class="easyui-textbox EDITreadonly textbox50" type="text">
                        </div>

                        <div class="mattBar">
                            <span>参与人员</span>
                            <input id="PARTICIPANTS" class="easyui-textbox EDITreadonly textbox50" type="text">
                        </div>

                        <div class="mattBar">
                            <span>巡检地点</span>
                            <input id="TASK_POSITION" class="easyui-textbox EDITreadonly textbox50" type="text">
                        </div>

                        <div class="mattBar">
                            <span>地点选择</span>
                            <input readonly id="LONGITUDE_LATITUDE" class="easyui-textbox EDITreadonly textbox50"
                                type="text">
                            <div class="select-button">
                                <img style="width: 2vh;"
                                    src="<%=resourceurl %>/10EngineerCheck/02RegulagTasks/image/map.png" alt="">
                                选择
                            </div>
                        </div>

                        <div class="mattBar">
                            <span>巡检情况说明</span>
                            <input id="TASK_EXEINFO" class="easyui-textbox EDITreadonly textbox50" />
                        </div>

                    </div>


                    <!--输入框分页及数据操作按钮-->
                    <div class="divEditButton">
                        <!--输入框分页按钮-->
                        <div class="moreEditer">
                        </div>
                        <!--数据操作按钮-->
                        <div class="divEditButtons">
                            <a id="OkButton" class="easyui-linkbutton EDITshow" iconCls="icon-ok">
                                <p>保存</p>
                            </a>
                            <a id="CancelButton" class="easyui-linkbutton" iconCls="icon-cancel">
                                <p>取消</p>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="divTable">
                    <table id="dg" class="thedatagrid" style="width: 100%;height: 100%"></table>
                </div>
            </div>

        </div>
    </div>

    <div id="fileUpload"></div>


    <script>

        // setTimeout(() => {
        //     $(".divEdit").show();
        //     $('.divEdit').css('height', '35vh').css('min-height', '35vh');
        // }, 300)

        let getListData = null; //获取表格数据函数
        let getDateData = null; //获取日期列表数据函数
        let regularExcel = null; //导出Excel函数
        let tableData = []; //表格数据
        let editDataObject = {}; //当前正在编辑的数据

        //表单初始化
        function formInit() {
            editDataObject = {};
            $("#TASK_ID").combobox("setValue", "")
            $("#DEPT_ID").combobox("setValue", "")
            $("#USER_NAME").textbox("setValue", "")
            $("#PARTICIPANTS").textbox("setValue", "")
            $("#TASK_POSITION").textbox("setValue", "")
            $("#LONGITUDE_LATITUDE").textbox("setValue", "")
            $("#TASK_EXEINFO").textbox("setValue", "")
        }

        $(function () {

            //⬜表单提交（新增和编辑）
            $("#OkButton").click(function () {

                const TASK_ID = $("#TASK_ID").combobox("getValue")
                const DEPT_ID = $("#DEPT_ID").combobox("getValue")
                const USER_NAME = $("#USER_NAME").val()
                const PARTICIPANTS = $("#PARTICIPANTS").val()
                const TASK_POSITION = $("#TASK_POSITION").val()
                const LONGITUDE_LATITUDE = $("#LONGITUDE_LATITUDE").val()
                const TASK_EXEINFO = $("#TASK_EXEINFO").val()


                let postData = {
                    "TASK_ID": TASK_ID, // 任务编号
                    "DEPT_ID": DEPT_ID, // 执行管理单位
                    "USER_NAME": USER_NAME, // 执行人姓名
                    "PARTICIPANTS": PARTICIPANTS, // 参与人员
                    "TASK_POSITION": TASK_POSITION, // 巡检地点
                    "TASK_EXEINFO": TASK_EXEINFO, // 巡检情况说明
                    "LONGITUDE": LONGITUDE_LATITUDE.split(',')[0], // 经度
                    "LATITUDE": LONGITUDE_LATITUDE.split(',')[1], // 纬度
                }

                if (editDataObject.ID) {
                    postData = Object.assign(editDataObject, postData)
                }
                enableValidation('divEdit');
                //开启验证
                var cansave = isValid('divEdit');
                if (cansave) {
                    $.messager.progress({ text: PromptInfo.InOperationMessage });
                    $.post("/10EngineerCheck/insertRegularTasksExe", postData, res => {
                        $.messager.progress("close");
                        if (res.isSuccess) {
                            $.messager.alert('提示', '操作成功', 'success');
                            if (!editDataObject.ID) {
                                formInit()
                            }
                            getListData()
                        } else {
                            $.messager.alert('提示', res.resultMessage, 'error');
                        }
                    })
                }
                return;

            })

            //🟨 初始化
            //权限设置
            power = moduleinfo.PERMISSIONVALUE;
            poweropt(moduleinfo.WEIGTH.split(','), moduleinfo.PERMISSIONVALUE.split(','));

            //表格初始化
            $("#dg").holddatagrid({
                pageNumber: 1,
                pageSize: 20,
                checkbox: true,
                frozenColumns: [[
                    {
                        field: 'ck',
                        checkbox: true // 显示复选框
                    },
                    {
                        field: 'rownumber',
                        title: '序号',
                        width: 50,
                        align: 'center',
                        formatter: function (value, row, index) {
                            return index + 1;
                        }
                    },
                    {
                        field: 'operate',
                        frozen: true,
                        width: 90,
                        halign: 'center',
                        align: 'center',
                        formatter: formatOper,
                        title: '操作'
                    },
                    {
                        field: "file",
                        title: "附件",
                        width: 100,
                        align: "center",
                        formatter: (val, row, index) => {
                            return "<button class='file-btn' onclick='if(window.fileManager){window.fileManager(\"" + row.ID + "\",\"" + index + "\")}' type='button'> 附件管理 </button>"
                        }
                    },
                    {
                        field: "exception",
                        title: "异常事件",
                        width: 100,
                        align: "center",
                        formatter: (val, row) => {
                            return "<button class='exception-btn' type='button'> 异常事件 </button>"
                        }
                    }

                ]],
                columns: [[
                    { field: "TASK_NAME", width: 170, halign: "center", align: "center", title: "任务名称" },
                    { field: "TASK_MANA_NAME", width: 170, halign: "center", align: "center", title: "执行管理单位" },
                    { field: "USER_NAME", width: 170, halign: "center", align: "center", title: "执行人姓名" },
                    { field: "PARTICIPANTS", width: 170, halign: "center", align: "center", title: "参与人员" },
                    { field: "TASK_POSITION", width: 170, halign: "center", align: "center", title: "巡检地点" },
                    { field: "TASK_EXEINFO", width: 170, halign: "center", align: "center", title: "巡检情况说明" },
                    {
                        field: "LONGITUDE", width: 170, halign: "center", align: "center", title: "经度,纬度", formatter: (v, row) => {
                            return row.LONGITUDE + "," + row.LATITUDE
                        }
                    },
                    { field: "PUBLISH_USER_NAME", width: 170, halign: "center", align: "center", title: "执行人" },
                    { field: "OPERATE_TIME", width: 170, halign: "center", align: "center", title: "执行时间" },
                ]],
                onLoadSuccess: function () {
                    $('.easyui-tooltip').tooltip();
                }
            })
            //获取日历数据
            getDateData = (year, month) => {
                $.post("/10EngineerCheck/getRegularTasksByYearAndMonth", {
                    "year": year,
                    "month": month
                }, res => {
                    $(".task-list").html("")
                    if (res.isSuccess) {
                        if (res.result[0]) {
                            res.result.forEach(task => {
                                const { BEGIN_TIME, END_TIME, EXE_LIST, TASK_STATE, TASK_TYPE, TASK_NAME, TASK_MANA_NAME, TASK_PERSON, TASK_INFO, TASK_TYPE_NAME } = task

                                let taskItemTemplate = $('#task-item-template').clone();
                                taskItemTemplate.show();
                                $(".task-list").append(taskItemTemplate)
                                const types = {
                                    "01": "已上报",
                                    "02": "进行中",
                                    "03": "已完成",
                                }

                                $(".ITEM_TASK_STATE", taskItemTemplate).text(types[TASK_STATE])
                                $(".ITEM_TASK_TYPE", taskItemTemplate).text(TASK_TYPE_NAME)
                                $(".ITEM_TASK_NAME", taskItemTemplate).text(TASK_NAME)
                                $(".ITEM_TASK_MANA", taskItemTemplate).text(TASK_MANA_NAME)
                                $(".ITEM_TASK_PERSON", taskItemTemplate).text(TASK_PERSON)
                                $(".ITEM_TASK_INFO", taskItemTemplate).text(TASK_INFO)

                                if (EXE_LIST && EXE_LIST[0]) {

                                    const { dept_ID: DEPT_ID, user_NAME: USER_NAME, task_POSITION: TASK_POSITION, participants: PARTICIPANTS } = EXE_LIST[0];
                                    $(".EXE_DEPT_ID", taskItemTemplate).text(DEPT_ID)
                                    $(".EXE_USER_NAME", taskItemTemplate).text(USER_NAME)
                                    $(".EXE_TASK_POSITION", taskItemTemplate).text(TASK_POSITION)
                                    $(".EXE_PARTICIPANTS", taskItemTemplate).text(PARTICIPANTS)
                                } else {
                                    $(".child-data", taskItemTemplate).hide();
                                }

                                const BEGIN_TIME_ARR = BEGIN_TIME.split("-").map(item => parseInt(item));
                                const END_TIME_ARR = END_TIME.split("-").map(item => parseInt(item));

                                const TASK_STATES = {
                                    "01": "#f5f5f5",
                                    "02": "#e7ffe7",
                                    "03": "#eff7ff",
                                }
                                const textColors = {
                                    "01": "#666666",
                                    "02": "#13ad13",
                                    "03": "#007cff"
                                }

                                if (EXE_LIST && EXE_LIST[0]) {
                                    EXE_LIST.forEach(exe => {
                                        const { operate_TIME } = exe;
                                        const operate_TIME_ARR = operate_TIME.split("-").map(item => parseInt(item));
                                        var target = $(`.calendar-dtable td[abbr='${operate_TIME_ARR[0]},${operate_TIME_ARR[1]},${operate_TIME_ARR[2]}']`);

                                        if (target.children(".calendar-exe-num").length > 0) {
                                            const num = target.children(".calendar-exe-num").text();
                                            target.children(".calendar-exe-num").text(parseInt(num) + 1)
                                        } else {
                                            target.append(`<div class="calendar-exe-num">1</div>`)
                                        }
                                    })
                                }

                                for (let index = BEGIN_TIME_ARR[2]; index <= END_TIME_ARR[2]; index++) {
                                    var target = $(`.calendar-dtable td[abbr='${BEGIN_TIME_ARR[0]},${BEGIN_TIME_ARR[1]},${index}']`)
                                        .css("background-color", TASK_STATES[TASK_STATE])
                                        .css("color", textColors[TASK_STATE])
                                        .css("border-radius", "0")
                                        .css("font-weight", "bold")
                                        .css("position", "relative")
                                }

                            })


                            //表单项赋值
                            const setDep = (index) => {

                                $("#DEPT_ID").combobox("loadData",
                                    [
                                        ...res.result[index].MANA_LIST.map(item => ({ value: item.dept_ID, text: item.dept_NAME }))
                                    ]
                                )
                            }

                            $("#TASK_ID").combobox("loadData",
                                [
                                    ...res.result.map((item, index) => ({ index, value: item.ID, text: item.TASK_NAME, MANA_LIST: item.MANA_LIST }))
                                ]
                            ).combobox("setValue", res.result[0].ID)

                            setDep(0);

                            $("#TASK_ID").combobox(
                                {
                                    onSelect: function (v) {
                                        setDep(v.index);
                                    }
                                })

                        }
                    }
                })
            }
            //左侧日历组件
            $('#cc').calendar({
                fit: true,
                border: false,
                current: new Date(),
                onNavigate: (year, month) => {
                    getDateData(year, month)
                }
            });

            //获取表格数据
            getListData = (init) => {
                const options = $('#dg').holddatagrid('getPager').pagination('options');
                const page = init ? 1 : (options.pageNumber || 1);  // 当前页码
                const pageSize = init ? 20 : options.pageSize;       // 每页条数

                const MANA_NAME = $("#QUERY_MANA_NAME").val();
                const USER_NAME = $("#QUERY_USER_NAME").val();
                const TASK_POSITION = $("#QUERY_TASK_POSITION").val();

                $.post("/10EngineerCheck/regularTasksExe", {
                    page,
                    pageSize,
                    MANA_NAME,
                    USER_NAME,
                    TASK_POSITION
                }, res => {
                    if (res.isSuccess) {
                        tableData = res.result;
                        $('#dg').datagrid('loadData', {
                            total: res.total,
                            rows: res.result
                        });
                    }
                })
            }
            getListData();

            //导出Excel函数
            regularExcel = (init) => {
                const MANA_NAME = $("#QUERY_MANA_NAME").val();
                const USER_NAME = $("#QUERY_USER_NAME").val();
                const TASK_POSITION = $("#QUERY_TASK_POSITION").val();

                fetch('/10EngineerCheck/regularExcel2', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        MANA_NAME,
                        USER_NAME,
                        TASK_POSITION
                    })
                })
                    .then(response => response.blob())
                    .then(blob => {
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `定期巡检任务记录.xlsx`;
                        a.click();
                        window.URL.revokeObjectURL(url);
                    })
                    .catch(err => {
                        console.error('下载失败', err);
                    });
            }

            //🟪点击查询
            $("#QueryButton").click(function () {
                getListData();
            })

            //🟩点击新增
            $("#AddButton").click(function () {
                formInit()
            })

            //🟥 点击删除已选
            $("#DelButton").click(function () {
                var deleteids = canDelete('dg');
                DeleteData(false, deleteids.map(item => (item.ID)).join(","))
            })

            //🟩 点击导出Excel
            $("#ExportButton").click(function () {
                regularExcel();
            })

        })

        // 附件管理器
        let OBJECT_ID = null; //上传需要提交参数,按照自己需求补充其他
        //附件管理器初始化
        $("#fileUpload").uploadAndPreview({
            title: "附件管理器", //左上角标题
            initShow: false, //初始化后是否默认打开
            deleteItem: function (id, liDom) {
                $.messager.confirm('确认', '确定删除吗？', function (r) {
                    if (r) {
                        $.post('/10EngineerCheck/deleteMediaById', {
                            id
                        }, res => {
                            if (res.isSuccess) {
                                liDom.remove(); //请求成功调用这个删除前端图片
                                getListData() //更新列表数据 因为上面的删除只是Dom删除
                            }
                        })
                    }
                });
            },
            upload: function (files) {
                const file = files[0];
                if (!file) {
                    alert('请选择一个文件！');
                    return;
                }
                const formData = new FormData();
                formData.append('file1', file);
                formData.append('OBJECT_ID', OBJECT_ID);
                //如果需要加载动画...自己加吧...easyUI有现成的...
                $.ajax({
                    url: '/10EngineerCheck/saveCheckMedia',
                    type: 'POST',
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (res) {
                        const { id, media_ORDER, media_PATH, media_TYPE, object_ID, operate_TIME, region_ID, remark, user_ID } = res.result[0];
                        //把提交成功的新文件插入进列表
                        $("#fileUpload").uploadAndPreview("insertData", {
                            id: id,
                            text: operate_TIME,
                            filePath: media_PATH,
                            type: media_TYPE
                        })
                        getListData() //更新列表数据 因为上面的插入只是Dom插入上传成功的图片
                    },
                    error: function () {
                        console.error('上传失败');
                    }
                });
            }
        })
        //点击附件管理按钮触发
        function fileManager(ID, index) {
            //临时存储一下业务ID 稍后随文件一块提交给后端
            OBJECT_ID = ID;
            var rows = $('#dg').holddatagrid('getRows');
            var row = rows[index];

            $("#fileUpload").uploadAndPreview("setData", [
                {
                    title: "图片",
                    files: row.MEDIA_LIST.map(item => {
                        return {
                            id: item.id,
                            text: item.operate_TIME,
                            filePath: item.media_PATH,
                            type: item.media_TYPE,
                        }
                    })
                }
            ])
            $("#fileUpload").uploadAndPreview("show")
        }

        //分页页码改变时
        function dgdatagridonSelectPage(pageNumber, pageSize) {
            getListData();
        }

        //🟦表格行编辑按钮点击
        function EditData(lineindex) {
            showeditarea();

            var rows = $('#dg').holddatagrid('getRows');
            var row = rows[lineindex];
            var rowTemp = JSON.parse(JSON.stringify(row));
            delete rowTemp.MANA_LIST;
            editDataObject = rowTemp
            $("#LONGITUDE_LATITUDE").textbox("setValue", row.LONGITUDE + "," + row.LATITUDE)
        }

        //🟥表格行删除按钮点击
        function DeleteData(index, ids) {
            var IDS;
            if (!ids) {
                rows = $('#dg').holddatagrid('getRows');
                row = rows[index];
                IDS = row.ID
            } else {
                IDS = ids;
            }
            $.messager.confirm('确认', "确认删除?", function (r) {
                if (r) {
                    $.post("/10EngineerCheck/deleteRegularTasksExe", {
                        IDS
                    }, res => {
                        if (res.isSuccess) {
                            $.messager.show({
                                title: '提示',
                                msg: '删除成功',
                            });
                            getListData();
                        } else {
                            $.messager.show({
                                title: '提示',
                                msg: res.resultMessage,
                            });
                        }
                    })
                }
            });
        }

    </script>
</body>

</html>
```