# 前端部分
- 直接向后端发起请求把响应数据二进制保存为Excel
- 下面例子中的参数 都是请求数据需要的
- 建议你先获取到要导出的数据，然后拿出来写一个js脚本把数据导出成excel文件，慢慢调，调好了，再放回路由代码里
```javascript
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
```


# 路由部分
```javascript
var ExcelJS = require('exceljs');

module.exports.autoroute = {
    post: {
        '/regularExcel2': regularExcel2,  //请求数据整合excel输出buffer
    }
}


function regularExcel2(req, res, next) {
    console.error("====excel====");
    console.error(req.body);


    const { REGION_ID } = req.session.hold.userInfo
    try {
        var api = '/regularTasksExe';
        var param = {
            region_id: REGION_ID,
            ...req.body
        };

        holdApiCaller.safePostJpa(req, res, next, api, param, async function (response, body) {
            if (body.isSuccess) {
                try {
                    //请求后端得到要导出的数据
                    var data;
                    data = body;
                    var dd = data.result;
                    //创建一个excel对象
                    const workbook = new ExcelJS.Workbook();
                    //添加一个Sheet
                    const worksheet = workbook.addWorksheet('定期巡检任务记录');
                    //添加一行
                    worksheet.addRow([
                        "序号",
                        "任务名称",
                        "执行管理单位",
                        "执行人姓名",
                        "参与人员",
                        "巡检地点",
                        "巡检情况说明",
                        "经度,纬度",
                        "执行人",
                        "执行时间",
                    ])
                    //循环自己的业务数据 追加行进去
                    dd.forEach((item, index) => {
                        let {
                            TASK_NAME,
                            TASK_MANA_NAME,
                            USER_NAME,
                            PARTICIPANTS,
                            TASK_POSITION,
                            TASK_EXEINFO,
                            LONGITUDE,
                            LATITUDE,
                            PUBLISH_USER_NAME, OPERATE_TIME } = item;
                        worksheet.addRow([
                            index + 1,
                            TASK_NAME,
                            TASK_MANA_NAME,
                            USER_NAME,
                            PARTICIPANTS,
                            TASK_POSITION,
                            TASK_EXEINFO,
                            LONGITUDE + ',' + LATITUDE,
                            PUBLISH_USER_NAME, OPERATE_TIME
                        ])
                    })

                    // 设置第一行背景色
                    const headerRow = worksheet.getRow(1);
                    headerRow.eachCell((cell) => {
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'f5f5f5' } // 黄色背景
                        };
                        cell.font = {
                            bold: true
                        };
                    });
                    headerRow.commit();

                    // 自动列宽：遍历每一列，计算最大宽度
                    worksheet.columns.forEach(column => {
                        let maxLength = 10;
                        column.eachCell({ includeEmpty: true }, cell => {
                            cell.alignment = {
                                vertical: 'middle',
                                wrapText: true,
                                horizontal: 'center'
                            };
                            const val = cell.value ? cell.value.toString() : '';
                            maxLength = Math.max(maxLength, val.length);
                            const row = worksheet.getRow(cell.row); // cell.row 是行号
                            row.height = 35;
                        });
                        column.width = maxLength + 2; // 加点 buffer
                    });

                    //输出为Buffer流（也可以输出文件 看一下文档或查GPT）
                    const buffer = await workbook.xlsx.writeBuffer();
                    //如果希望访问路由浏览器直接下载，那就增加这两个头
                    res.setHeader(
                        'Content-Type',
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    );
                    res.setHeader('Content-Disposition', 'attachment; filename="report.xlsx"');

                    // 发送文件流给前端
                    res.send(buffer);
                } catch (e) {
                    logger.error(e.message);
                    console.error(e.message);
                }

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
```