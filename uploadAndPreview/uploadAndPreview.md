# 文件上传与预览 v1.0.0

## ⚠ 只需要阅读一次！不要紧张文字数量，实际简单到爆💥!
- 本模块文档包含[三个业务处理](#)，你可以选择三个都用
- 也可以任选其一、二，其他的自己写代码

### 1️⃣ [前端媒体资源浏览与上传 组件](#)
- uploadAndPreview.js (后面简称UAP) 

### 2️⃣ [Express Route 接收上传文件，保存文件与文件元数据提取发送Java服务](#)
- 提供Route 文件保存与信息提取代码

### 3️⃣ [Java 对于文件信息和业务字段的入库处理](#)
- 提供java controller代码（业务简单且无复用所以省去Service）
- 提供java repository代码
### 💬 每次编写的业务所对应的表、字段、实体其实都有差别，尽可能要读懂代码，每次都能快速修改，再次强调源码很简单，你能轻松掌握💯

### ↖️以上3块内容的源码都在左边导航里找得到

<br/>
<br/>
<br/>
<br/>

# 开始使用
## 两步就能看见结果
### 1️⃣ 引入JS 
### 2️⃣ 初始化 
---
##### 3️⃣ 设置(setData) 
##### 不设置选项卡和数据也能看见弹窗

## ❤️引入必要依赖
- 按照自己项目实际情况引入必要的三个JS库并且注意引入顺序
- 1️⃣jQuery  2️⃣EasyUI  3️⃣uploadAndPreview.js(UAP)
- ☑️ 我们项目中已经包含jQuery和EasyUI了，所以只引入UAP即可了

```html
✅️ <script src="jquery.min.js"></script>
✅️ <script src="jquery.easyui.min.js"></script>
☑️ <script src="uploadAndPreview.js"></script> 
//引入这个 自己到左边导航栏复制源码创建 或者 看看/public/controls里有没有现成的 
```

## 😊 初始化
- 准备一个空div(例如#asd)，本质上是用于插件底层存储当前插件设置和状态
- 一个页面中可以定义若干个附件管理器，方法参照下文例子
- 【选择器+调用插件（包含配置）即可】
```javascript
    //附件管理器初始化
    $("#asd").uploadAndPreview({
        title: "附件管理器", //左上角标题
        initShow: false, //初始化后是否默认打开
        upload: function (file) { 
            //介绍:这里是【上传附件按钮】点击选择文件后的【回调函数】
            //逻辑:后续就是把file发送给【Express Route】存储文件和获取文件信息
            //提示:【上传成功】记得获取新数据列表并【更新列表 】
            //$("#asd").uploadAndPreview("setData",[新列表])
        }
    })
```

---

# 👑 插件方法大全
##### 先写几个常用的后面再迭代

##  show() 
- 打开附件面板窗口
```javascript
$("#asd").uploadAndPreview("show")
```

## hide() 
- 关闭附件面板窗口
```javascript
$("#asd").uploadAndPreview("hide")
```

## setData(data) 
- 设置附件窗口内的选项卡数量名称和每个选项卡内的文件列表
```javascript
//设置管理器中的选项卡和图片、视频 (将你的数据格式转换为setData目标数组格式)
//数组第一层是选项卡对象，对象中的files就是具体的文件列表了
$("#asd").uploadAndPreview("setData", [
    {
        title: "图片",
        files: [
            {
                text: "123",
                filePath: "http://gips3.baidu.com/it/u=3886271102,3123389489&fm=3028&app=3028&f=JPEG&fmt=auto?w=1280&h=960",
                type: "image"
            }
        ]
    },
    {
        title: "视频",
        files: [
            {
                text: "视频标题",
                filePath: "https://www.runoob.com/try/demo_source/movie.mp4",
                type: "video"
            }
        ]
    }
])

```