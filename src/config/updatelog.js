const config = [
    {
        version: '0.3.x',
        logs: [{
            version: '0.3.2',
            time: '2020年5月13日',
            updates: [
                '采用Marked.js作为Markdown渲染器',
                '在主界面按钮上增加必要的提示文本',
                '修复桌面组件不可用的问题，重写部分样式',
                '修复回收站的错误样式和错误的长按行为',
                '修复热更新相关的一些错误，优化程序更新流程',
                '基础依赖更新'
            ]
        },
        {
            version: '0.3.1',
            time: '2020年4月5日',
            updates: [
                '加入热更新支持',
                '新建/编辑便签窗口样式重置',
                '对之前版本探测到的 Bug 和样式错误进行了修正'
            ]
        }, {
            version: '0.3.0',
            time: '2020年4月19日',
            updates: [
                '重新规划了渲染流程，更快，更高效',
                '对主题和主界面样式进行了重做，更美观',
                '一系列的 Bug 修复和交互逻辑上的调整，更稳定',
                '重做了便签备份的导入导出，数据更安全'
            ]
        }]
    }
]

export default config;