// ==UserScript==
// @name         东财股吧 - 去广告 & 清爽布局
// @namespace    https://github.com/
// @version      1.2
// @description  过滤东方财富股吧广告、推广、APP诱导，提升阅读体验
// @author       Grok
// @match        https://guba.eastmoney.com/*
// @match        https://*.eastmoney.com/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    // ==================== CSS 样式清理 ====================
    GM_addStyle(`
        /* 隐藏广告、推广、浮动元素 */
        .ad, .advert, .tg, .promotion, .app-download,
        [class*="ad"], [class*="banner"], [class*="popup"],
        [id*="ad"], [id*="banner"], [id*="pop"],
        .right-side, .recommend, .hot-user, .download-app,
        .emotion-index + div, .user-recommend,
        .footer-app, .scan-app, .acttg, .dfcf {
            display: none !important;
        }

        /* 主内容区加宽 */
        .main, .content, .list-content, .guba-container,
        .bbs_list, .stock_list {
            width: 100% !important;
            max-width: 1200px !important;
            margin: 0 auto !important;
        }

        /* 侧边栏收窄或隐藏非必要部分 */
        .side, .right, .sidebar {
            width: 220px !important;
        }

        /* 帖子列表优化 */
        .article-list, .news-list, .bbs-list {
            font-size: 15px !important;
        }

        /* 隐藏顶部/底部多余导航和推广 */
        header + div > div:last-child,
        .top-banner, .bottom-banner {
            display: none !important;
        }

        /* 提升可读性 */
        body {
            background: #f8f9fa !important;
        }
        
        .post-item, .news-item {
            padding: 12px 15px !important;
            margin-bottom: 8px !important;
            border-radius: 6px !important;
        }
    `);

    // ==================== 元素移除函数 ====================
    function cleanPage() {
        // 常见广告/推广选择器（根据实际页面动态调整）
        const selectors = [
            'div[class*="ad"]', 'div[class*="promot"]', 'div[class*="recommend"]',
            'a[href*="acttg.eastmoney.com"]', 'img[src*="ad"]',
            '.app-down', '.download-bar', '.float-layer',
            'div:contains("下载APP")', 'div:contains("扫一扫")',
            '.hot-topic', '.user-recommend', '.emotion-bar'
        ];

        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                if (el) el.remove();
            });
        });

        // 移除包含“APP”“下载”“扫码”等文字的推广块
        document.querySelectorAll('div, span, a').forEach(el => {
            const text = el.textContent || '';
            if (/(下载APP|扫一扫|手机炒股|东方财富APP|天天基金)/i.test(text) &&
                el.offsetHeight > 30 && el.offsetHeight < 300) {
                el.style.display = 'none';
            }
        });
    }

    // ==================== 定时清理（应对动态加载） ====================
    const observer = new MutationObserver(() => {
        cleanPage();
    });

    // 启动观察
    function init() {
        cleanPage();
        
        // 监听DOM变化
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });

        // 额外定时清理
        setInterval(cleanPage, 2000);
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
