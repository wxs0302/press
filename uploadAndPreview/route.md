# 路由使用方法
- 本质上这两个接口的作用
- 1.保存文件和获取文件信息提交给java
- 2.中转请求给java去删除表里的媒体信息

## 必要依赖和配置
- express默认不支持文件上传，需要安装multer中间件（项目依赖里已经包含了）

```javascript
var path = require("path")
var fs = require("fs")
var multer = require('multer');
var storagePath = path.join(process.holdCtx.rootDir, 'upload/tms');
var upload = multer({ dest: storagePath }).single('file1'); 
//注意这块！前端上传文件FormData的key要和这个一致file1

```


## 把方法注册到路由配置上
```javascript
module.exports.autoroute = {
    post: {
        '/saveCheckMedia': [upload, saveCheckMedia],//保存上传媒体，包含与Java交互存储文件数据和业务字段
        "/deleteMediaById": deleteMediaById  //删除上传媒体
    }
}
```


## 方法
- 【删除媒体】方法-前端传递一个参数id
- 【上传保存并且携带业务字段和文件信息请求Java存表】方法

```javascript
function deleteMediaById(req, res, next) {
    console.error("====deleteMediaById====");

    const { REGION_ID } = req.session.hold.userInfo
    try {
        var api = '/deleteMediaById';
        var param = {
            region_id: REGION_ID,
            ...req.body
        };

        holdApiCaller.safePostJpa(req, res, next, api, param, function (response, body) {
            if (body.isSuccess) {
                var data;
                data = body;
                res.send(data);
            } else {
                logger.info(body.resultMessage);
                var data;
                data = body;
                res.send(data);
            }
        });
    } catch (e) {
        logger.error(e.message);
        handlerError.showError(req, res, next, e);
    }
}

function saveCheckMedia(req, res, next) {
    console.error("====saveCheckMedia====");
    try {
        res.setHeader('content-type', 'text/json');
        var fileObj = req.file;
        const newPath = fileObj.path + fileObj.originalname
        fs.renameSync(fileObj.path, newPath)
        if (!fileObj) {
            var result = new commonResult(false, "上传文件不成功");
            res.send(result);
            res.end();
            return;
        } else {
            const { REGION_ID, USER_ID } = req.session.hold.userInfo
            try {
                var api = '/saveCheckMedia';
                var param = {
                    region_id: REGION_ID,
                    user_id: USER_ID,
                    "OBJECT_ID": "2",     // 关联对象ID
                    "MEDIA_PATH": "/tms/" + fileObj.filename + fileObj.originalname,    // 媒体文件路径
                    "MEDIA_TYPE": fileObj.mimetype,    // 媒体类型
                    "MEDIA_ORDER": "1",   // 媒体顺序
                    "REMARK": "",        // 备注说明
                    ...req.body
                };
                holdApiCaller.safePostJpa(req, res, next, api, param, function (response, body) {
                    if (body.isSuccess) {
                        var data;
                        data = body;
                        res.send(data);
                    } else {
                        logger.info(body.resultMessage);
                        var data;
                        data = body;
                        res.send(data);
                    }
                });
            } catch (e) {
                logger.error(e.message);
                handlerError.showError(req, res, next, e);
            }

        }
    } catch (e) {
        handlerError.showError(req, res, next, e);
    }

}

```