# 前端UAP.js使用方法

## 表格列绑定点击事件，传递的实参（id,index）根据业务的需要更改
- 如果不是表格列，比如普通按钮，直接绑定点击事件，传递的实参根据业务的需要更改
```javascript
{
    field: "file",
    title: "附件",
    width: 100,
    align: "center",
    formatter: (val, row, index) => {
        return "<button class='file-btn' onclick='if(window.fileManager){window.fileManager(\"" + row.ID + "\",\"" + index + "\")}' type='button'> 附件管理 </button>"
    }
},

```
## 定义点击事件
- 把当前行的媒体列表赋值给UAP（格式要对哈，最好去看一眼文档的[API描述](/uploadAndPreview/uploadAndPreview.html#setdata-data)）
```javascript
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
```

## UAP初始化并且绑定upload方法和deleteItem方法
```javascript
 // 附件管理器
let OBJECT_ID = null; //上传需要提交参数,按照自己需求补充其他
//附件管理器初始化
$("#fileUpload").uploadAndPreview({
    title: "附件管理器", //左上角标题
    initShow: false, //初始化后是否默认打开
    deleteItem: function (id, liDom) {
        $.messager.confirm('确认', '确定删除吗？', function (r) {
            if (r) {
                //你也可以自己准备删除表中媒体数据的接口，成功了调用liDom.remove()删除即可
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
