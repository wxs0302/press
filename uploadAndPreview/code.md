# 未压缩版本
```javascript
/**
 * uploadAndPreviewPlugin v1.0.0
 * 
 * Copyright (c) 2025 Cedar WU
 * All rights reserved.
 *
 */
; (function ($) {
    var pluginVersion = "1.0.0";
    var pluginName = "uploadAndPreview";
    var doc = "http://www.baidu.com";

    var defaults = {
        title: "未设置标题",
        upload: function () {
            console.warn("未配置upload方法");
        }
    }

    var methods = {
        init(options) {
            return this.each(function () {
                var thisElement = $(this);


                var setting = Object.assign({}, defaults, options)

                var id = Math.random().toString().substring(2, 9);
                var dialogId = "dialog-" + id
                var tabId = "tab-" + id
                var dialogPreviewId = "dialog-preview-" + id
                thisElement.html(`
                              <div class="${dialogId} easyui-dialog"  style="width:800px;height:500px;"
                                data-options="iconCls:'icon-save',resizable:true,modal:true,maximizable:true" closed="false">
                                <div class="${dialogPreviewId}"></div>
                                <div style="padding:1vh">
                                    <label class="easyui-linkbutton">
                                        上传附件
                                        <input type="file" class="upload-file-input-${id}" multiple accept="image/*" style="display:none;" />
                                    </label>
                                </div>
                                <div class="${tabId} easyui-tabs" style="width:100%;height:85%;"></div>
                            </div>
                        `)

                $('.' + dialogId).dialog({
                    title: setting.title,
                    closed: !setting.initShow,
                    modal: true,
                    resizable: true,
                    maximizable: true
                });

                $('.' + dialogPreviewId).dialog({
                    title: '预览',
                    width: window.innerWidth * 0.8,
                    height: window.innerHeight * 0.8,
                    closed: true,
                    modal: true,
                    resizable: true,
                    maximizable: true,
                    content: `<div class="media"></div>`,
                    onBeforeClose: function () {
                        $('.' + dialogPreviewId).find('.media').html("");
                    }
                });


                $(document).on('click', '.preview-li-' + id, function () {
                    const type = $(this).data("type")
                    const src = $(this).find('.media-item').attr('src');
                    if (type === "image") {
                        $('.' + dialogPreviewId).find('.media').html(`<img class="preview-img" src="${src}" style="width:100%;" src="" alt="" / >`)
                    }
                    else if (type === "video") {
                        $('.' + dialogPreviewId).find('.media').html(`<video autoplay controls class="preview-img" src="${src}" style="width:100%;" src="" alt="" />`)
                    }
                    $('.' + dialogPreviewId).dialog('open');

                });

                $(document).on("change", '.upload-file-input-' + id, function (e) {
                    if (typeof setting.upload === 'function') {
                        setting.upload.call(thisElement, e.target.files);
                    }
                });

                thisElement.data(pluginName, {
                    title: setting.title,
                    setting,
                    id,
                    dialogId,
                    tabId,
                    dialogPreviewId
                })
            })
        },
        show() {
            return this.each(function () {
                var thisElement = $(this);
                var thisElementData = thisElement.data(pluginName);
                $("." + thisElementData['dialogId']).dialog("open");
            })
        },
        hide() {
            return this.each(function () {
                var thisElement = $(this);
                var thisElementData = thisElement.data(pluginName);

                $("." + thisElementData['dialogId']).dialog("close");
            })
        },
        setData(data) {
            thisElement = $(this);
            thisElementData = thisElement.data(pluginName);
            if (!(data instanceof Array)) {
                console.error(pluginName + ":setData仅接收数组类型,仔细阅读文档" + doc);
            }

            const tabElement = $('.' + thisElementData.tabId);
            tabElement.tabs({ border: false });

            // 清空旧tabs
            const allTabs = tabElement.tabs('tabs');
            for (let i = allTabs.length - 1; i >= 0; i--) {
                const title = allTabs[i].panel('options').title;
                tabElement.tabs('close', title);
            }

            // 添加新tabs
            data.forEach((tab, index) => {
                tabElement.tabs('add', {
                    title: tab.title,
                    content: `
                            <ul style="margin:0;padding:2vh;display:flex;flex-wrap:wrap;">
                                ${tab.files.map(item => `
                                    <li class="preview-li-${thisElementData.id}" data-type="${item.type}" style="padding:0.5vh;width:25%;height:20vh;list-style:none;cursor:pointer;position:relative;flex-shrink:0">
                                        <div style="height:100%;width:100%;position:relative;border:1px solid #ddd;">
                                            ${item.type === 'image' ?
                            `<img class="media-item" style="width:100%;height:100%;object-fit:cover;" src="${item.filePath}" alt="" />` :
                            `<video class="media-item" style="width:100%;height:100%;object-fit:cover;" src="${item.filePath}" alt=""></video>`
                        }
                                                <div style="display:${item.text ? 'block' : 'none'};position:absolute;bottom:0;left:0;width:100%;padding:0.5vh 0;background-color:rgba(0,0,0,0.5);color:#fff;text-align:center;z-index:9">
                                                    ${item.text || ""}
                                                </div>
                                        </div>
                                    </li>
                                `).join('')}
                            </ul>
                        `
                });
            });

            tabElement.tabs('select', 0);

        }
    }
    $.fn[pluginName] = function (optionsOrMethod) {
        if (methods[optionsOrMethod]) {
            methods[optionsOrMethod].apply(this, Array.prototype.slice.call(arguments, 1))
        } else if (typeof optionsOrMethod === "object" || !optionsOrMethod) {
            methods.init.apply(this, arguments)
        } else {
            console.error(pluginName + "中未找到方法," + optionsOrMethod + "为无效方法");
        }
    }

})(jQuery)
```