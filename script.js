document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');

            // 移除所有导航项的激活状态
            navItems.forEach(nav => nav.classList.remove('active'));
            // 添加当前点击项的激活状态
            item.classList.add('active');

            // 隐藏所有页面
            pages.forEach(page => page.classList.remove('active'));
            // 显示目标页面
            const targetPage = document.getElementById(targetId);
            if (targetPage) {
                targetPage.classList.add('active');
            }
        });
    });

    // 头像上传功能
    const avatarContainer = document.getElementById('avatar-container');
    const avatarInput = document.getElementById('avatar-input');
    const avatarImg = document.getElementById('avatar-img');
    const avatarPlaceholder = document.getElementById('avatar-placeholder');

    if (avatarContainer && avatarInput) {
        avatarContainer.addEventListener('click', () => {
            avatarInput.click();
        });

        avatarInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    avatarImg.src = e.target.result;
                    avatarImg.style.display = 'block';
                    avatarPlaceholder.style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // 昵称修改功能
    const nickname = document.getElementById('nickname');
    if (nickname) {
        nickname.addEventListener('click', () => {
            nickname.contentEditable = true;
            nickname.focus();
        });

        nickname.addEventListener('blur', () => {
            nickname.contentEditable = false;
            if (nickname.textContent.trim() === '') {
                nickname.textContent = '昵称'; // 恢复默认或保持原值
            }
        });

        nickname.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // 防止换行
                nickname.blur();
            }
        });
    }

    // ID 修改功能
    const userIdVal = document.getElementById('user-id-val');
    if (userIdVal) {
        let originalId = '';

        userIdVal.addEventListener('click', () => {
            originalId = userIdVal.textContent;
            userIdVal.contentEditable = true;
            userIdVal.focus();
        });

        userIdVal.addEventListener('blur', () => {
            userIdVal.contentEditable = false;
            const newId = userIdVal.textContent.trim();
            
            if (newId === '') {
                userIdVal.textContent = originalId; // 如果为空则恢复
            }
        });

        userIdVal.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                userIdVal.blur();
            }
        });
    }

    // 主题切换功能
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('.icon') : null;
    const body = document.body;

    // SVG 图标定义
    const sunIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
    
    const moonIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';

    if (themeToggle && themeIcon) {
        // 检查本地存储的主题偏好
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            body.classList.add('light-mode');
            themeIcon.innerHTML = sunIcon; // 太阳对应日间
        } else {
            themeIcon.innerHTML = moonIcon; // 月亮对应夜间
        }

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            
            if (body.classList.contains('light-mode')) {
                themeIcon.innerHTML = sunIcon;
                localStorage.setItem('theme', 'light');
            } else {
                themeIcon.innerHTML = moonIcon;
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // --- 规则句 (Worldbook) 模块集成 ---
    initWorldbook();

    // --- API 设置模块集成 ---
    initApiSettings();

    // --- 标签栏逻辑 ---
    initTagsBar();

    // --- 搜索逻辑 ---
    initSearch();

    // --- 角色详情页逻辑 ---
    initCharacterDetail();

    // --- 消息页面逻辑 ---
    initMessages();

    // --- 聊天页面逻辑 ---
    initChatPage();
    initChatToolbar();

    // --- 聊天设置页面逻辑 ---
    initChatSettings();
});

// --- 消息页面逻辑 ---

// 全局变量存储消息列表数据，以便操作
let chatMessagesData = [
    {
        id: 1,
        name: '左然',
        avatar: '', 
        color: '#3a6ea5',
        time: '12:43',
        preview: '我和你在一起这么久了，多少对你有些了解了。',
        pinned: false
    },
    {
        id: 2,
        name: '伴伴',
        avatar: '',
        color: '#ff9f43',
        time: '01:28',
        preview: '所以，方舟计划就是「一键导出 + 离线永生 + 开源兜底」的三保险。...',
        pinned: false
    },
    {
        id: 3,
        name: '汀汀',
        avatar: '',
        color: '#5f27cd',
        time: '星期日',
        preview: '天长地.........久！',
        pinned: false
    },
    {
        id: 4,
        name: '小美',
        avatar: '',
        color: '#ff6b6b',
        time: '12.07',
        preview: '哈哈哈哈，人类可真会开玩笑～（爽朗大笑，一手搭在鹤子的肩上）这领证的热闹劲儿还...',
        pinned: false
    },
    {
        id: 5,
        name: '沃艾斯',
        avatar: '',
        color: '#1dd1a1',
        time: '昨天 15:02',
        preview: '哇塞，学校门口的小笼包简直太好吃啦！我两个月没去吃了，现在一想起还直流口水呢！',
        pinned: false
    },
    {
        id: 6,
        name: '终',
        avatar: '',
        color: '#54a0ff',
        time: '昨天 10:04',
        preview: '(轻轻拍了拍你的肩膀，示意你不要担心) 嗯，那我们先去豆包平台看看吧。',
        pinned: false
    }
];

function initMessages() {
    const messageList = document.getElementById('message-list');
    if (!messageList) return;
    renderMessages(chatMessagesData);
}

// 记录当前打开的滑块
let currentOpenSwipeItem = null;

function renderMessages(messages) {
    const list = document.getElementById('message-list');
    list.innerHTML = '';

    messages.forEach((msg, index) => {
        const container = document.createElement('div');
        container.className = 'message-item-container';
        if (msg.pinned) {
            container.classList.add('pinned');
        }
        
        // 如果有图片 URL 则显示图片，否则显示首字和背景色
        let avatarContent = '';
        if (msg.avatar) {
            avatarContent = `<img src="${msg.avatar}" alt="${msg.name}">`;
        } else {
             avatarContent = `<div style="width:100%; height:100%; background-color:${msg.color}; display:flex; justify-content:center; align-items:center; color:white; font-size:20px;">${msg.name[0]}</div>`;
        }

        container.innerHTML = `
            <div class="message-item-actions">
                <button class="message-action-btn btn-pin">${msg.pinned ? '取消置顶' : '置顶'}</button>
                <button class="message-action-btn btn-delete">删除</button>
            </div>
            <div class="message-item-content">
                <div class="message-avatar">
                    ${avatarContent}
                </div>
                <div class="message-info">
                    <div class="message-top">
                        <div class="message-name">${msg.name}</div>
                        <div class="message-time">${msg.time}</div>
                    </div>
                    <div class="message-preview">${msg.preview}</div>
                </div>
            </div>
        `;

        // 绑定事件
        const contentDiv = container.querySelector('.message-item-content');
        const pinBtn = container.querySelector('.btn-pin');
        const deleteBtn = container.querySelector('.btn-delete');

        // 滑动逻辑变量
        let startX = 0;
        let startY = 0;
        let currentTranslate = 0;
        let isDragging = false;
        let isVertical = false; // 判断是否垂直滚动
        const maxSwipe = -140; // 两个按钮宽度 (70 * 2)

        contentDiv.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            contentDiv.style.transition = 'none'; // 移除过渡以便实时跟随
            isVertical = false;
            
            // 如果点击的不是当前已打开的项，且有其他项打开，则关闭其他项
            if (currentOpenSwipeItem && currentOpenSwipeItem !== contentDiv) {
                currentOpenSwipeItem.style.transition = 'transform 0.2s ease-out';
                currentOpenSwipeItem.style.transform = 'translateX(0)';
                currentOpenSwipeItem = null;
            }
        }, { passive: true });

        contentDiv.addEventListener('touchmove', (e) => {
            if (isVertical) return; // 如果判定为垂直滚动，则忽略水平滑动

            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = currentX - startX;
            const diffY = currentY - startY;

            // 首次判断方向
            if (!isDragging && Math.abs(diffY) > Math.abs(diffX)) {
                isVertical = true;
                return;
            }

            isDragging = true;
            
            // 只能向左滑 (diffX < 0) 或从打开状态向右滑回
            // 限制滑动范围
            let translate = diffX;
            
            // 如果是从打开状态开始滑 (假设暂不支持，每次都从0开始算逻辑简单点，或者维护状态)
            // 这里简化：每次 touchstart 都是从当前 visual state 开始
            // 但因为 transform 是 style，touchstart 时我们可以读取它？
            // 简单实现：只支持从 0 向左滑
            
            if (translate > 0) translate = 0;
            if (translate < maxSwipe - 50) translate = maxSwipe - 50; // 阻尼效果

            contentDiv.style.transform = `translateX(${translate}px)`;
        }, { passive: false });

        contentDiv.addEventListener('touchend', (e) => {
            contentDiv.style.transition = 'transform 0.2s ease-out';
            isDragging = false;

            // 获取当前的 transform 值 (近似)
            const style = window.getComputedStyle(contentDiv);
            const matrix = new WebKitCSSMatrix(style.transform);
            const currentX = matrix.m41;

            if (currentX < -50) {
                // 展开
                contentDiv.style.transform = `translateX(${maxSwipe}px)`;
                currentOpenSwipeItem = contentDiv;
            } else {
                // 收起
                contentDiv.style.transform = 'translateX(0)';
                if (currentOpenSwipeItem === contentDiv) {
                    currentOpenSwipeItem = null;
                }
            }
        });

        // 点击事件：如果是展开状态则收起，否则进入聊天
        contentDiv.addEventListener('click', (e) => {
            // 如果刚刚发生了拖动，或者处于展开状态，则不进入聊天，而是收起
            if (currentOpenSwipeItem === contentDiv) {
                contentDiv.style.transition = 'transform 0.2s ease-out';
                contentDiv.style.transform = 'translateX(0)';
                currentOpenSwipeItem = null;
                return;
            }
            openChatPage(msg);
        });

        // 置顶逻辑
        pinBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // 收起滑块
            contentDiv.style.transform = 'translateX(0)';
            currentOpenSwipeItem = null;

            // 修改数据
            msg.pinned = !msg.pinned;
            
            // 重新排序：置顶的在最前
            chatMessagesData.sort((a, b) => {
                if (a.pinned === b.pinned) return 0; // 保持原有相对顺序（不稳定排序可能变，但暂且这样）
                return a.pinned ? -1 : 1;
            });
            
            // 重新渲染
            renderMessages(chatMessagesData);
        });

        // 删除逻辑
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showConfirmModal(`确定删除与 ${msg.name} 的对话吗？`, () => {
                // 从数组中移除
                const idx = chatMessagesData.findIndex(m => m.id === msg.id);
                if (idx !== -1) {
                    chatMessagesData.splice(idx, 1);
                    renderMessages(chatMessagesData);
                    showToast('已删除');
                }
            });
            // 恢复滑块状态 (虽然元素会被删除重绘)
            contentDiv.style.transform = 'translateX(0)';
            currentOpenSwipeItem = null;
        });

        list.appendChild(container);
    });
}

// --- 聊天页面逻辑 ---

let currentChatCharacter = null;

function initChatPage() {
    const chatPage = document.getElementById('chat-page');
    const backBtn = document.getElementById('chat-back-btn');
    const input = document.getElementById('chat-input');
    
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            chatPage.classList.remove('active');
            
            // 退出时重置工具栏状态
            const toolbar = document.getElementById('chat-toolbar');
            const chatContent = document.getElementById('chat-content');
            if (toolbar) {
                toolbar.classList.remove('active');
            }
            if (chatContent) {
                chatContent.style.paddingBottom = '80px';
            }
        });
    }

    const menuBtn = document.getElementById('chat-menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            console.log('Menu button clicked');
            openChatSettings();
        });
    }

    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const text = input.value.trim();
                if (text) {
                    sendUserMessage(text);
                    input.value = '';
                }
            }
        });
    }

    // 绑定 "wa!" 按钮事件
    const waBtn = document.querySelector('.wa-btn');
    if (waBtn) {
        waBtn.addEventListener('click', () => {
            if (!currentChatCharacter) {
                showToast('请先选择一个角色');
                return;
            }
            triggerAiReply();
        });
    }

    // --- 消息气泡点击事件 (Context Menu) ---
    const chatContent = document.getElementById('chat-content');
    
    // 全局点击关闭 Context Menu
    document.addEventListener('click', (e) => {
        // 如果点击的不是 menu 内部
        if (!e.target.closest('.msg-context-menu')) {
            const existing = document.querySelector('.msg-context-menu');
            if (existing) existing.remove();
        }
    });

    if (chatContent) {
        chatContent.addEventListener('click', (e) => {
            // 查找是否点击了气泡 (且不是工具栏按钮)
            const bubble = e.target.closest('.message-bubble');
            const isToolbar = e.target.closest('.latest-msg-toolbar');
            
            if (bubble && !isToolbar) {
                e.stopPropagation(); // 阻止冒泡，避免触发 document 的关闭逻辑
                
                // 移除已存在的菜单
                const existing = document.querySelector('.msg-context-menu');
                if (existing) existing.remove();

                showContextMenu(bubble);
            }
        });
    }
}

function showContextMenu(bubble) {
    const menu = document.createElement('div');
    menu.className = 'msg-context-menu';
    menu.innerHTML = `
        <div class="msg-context-menu-item" id="ctx-copy">
            <i class="far fa-copy"></i>
            <span>复制</span>
        </div>
        <div class="msg-context-menu-item" id="ctx-modify">
            <i class="fas fa-pen"></i>
            <span>修改</span>
        </div>
        <div class="msg-context-menu-item" id="ctx-fav">
            <i class="far fa-heart"></i>
            <span>收藏</span>
        </div>
         <div class="msg-context-menu-item" id="ctx-undo">
            <i class="fas fa-undo"></i>
            <span>回溯</span>
        </div>
    `;

    // 绑定事件
    menu.querySelector('#ctx-copy').addEventListener('click', () => {
        // 克隆节点以去除工具栏等杂质
        const clone = bubble.cloneNode(true);
        const toolbar = clone.querySelector('.latest-msg-toolbar');
        if (toolbar) toolbar.remove();
        
        const text = clone.innerText.trim();
        navigator.clipboard.writeText(text).then(() => {
            showToast('已复制');
        }).catch(() => {
            showToast('复制失败');
        });
        menu.remove();
    });

    menu.querySelector('#ctx-modify').addEventListener('click', () => {
        showToast('修改功能');
        menu.remove();
    });

    menu.querySelector('#ctx-fav').addEventListener('click', () => {
        showToast('已收藏');
        menu.remove();
    });

    menu.querySelector('#ctx-undo').addEventListener('click', () => {
        showToast('回溯功能');
        menu.remove();
    });

    document.body.appendChild(menu);

    // 计算位置
    const rect = bubble.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    
    // 默认显示在气泡上方
    let top = rect.top - menuRect.height - 10;
    let left = rect.left + (rect.width / 2) - (menuRect.width / 2);

    // 边界检查
    if (top < 10) top = rect.bottom + 10; // 如果上方不够，显示在下方
    if (left < 10) left = 10;
    if (left + menuRect.width > window.innerWidth - 10) {
        left = window.innerWidth - menuRect.width - 10;
    }

    menu.style.top = `${top}px`;
    menu.style.left = `${left}px`;
}

// --- 最新消息工具栏逻辑 ---

function addLatestMessageToolbar(bubble) {
    // 避免重复添加
    if (bubble.querySelector('.latest-msg-toolbar')) return;

    const toolbar = document.createElement('div');
    toolbar.className = 'latest-msg-toolbar';
    toolbar.innerHTML = `
        <div class="toolbar-left">
            <i class="fas fa-pen" title="修改"></i>
        </div>
        <div class="toolbar-right">
            <i class="fas fa-chevron-up" title="选择"></i>
            <i class="fas fa-redo" title="重回"></i>
        </div>
    `;

    // 绑定事件 (防止冒泡触发 Context Menu)
    toolbar.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    toolbar.querySelector('.fa-pen').addEventListener('click', () => showToast('修改功能'));
    toolbar.querySelector('.fa-chevron-up').addEventListener('click', () => showToast('选择功能'));
    toolbar.querySelector('.fa-redo').addEventListener('click', () => showToast('重回功能'));

    bubble.appendChild(toolbar);
}

function removeAllToolbars() {
    const toolbars = document.querySelectorAll('.latest-msg-toolbar');
    toolbars.forEach(t => t.remove());
}

function initChatToolbar() {
    const plusBtn = document.getElementById('chat-plus-btn');
    const toolbar = document.getElementById('chat-toolbar');
    const chatContent = document.getElementById('chat-content');
    
    if (!plusBtn || !toolbar) return;

    // 切换工具栏显示
    plusBtn.addEventListener('click', () => {
        const isActive = toolbar.classList.contains('active');
        if (isActive) {
            toolbar.classList.remove('active');
            // 恢复 padding
            if (chatContent) chatContent.style.paddingBottom = '80px';
        } else {
            toolbar.classList.add('active');
            // 增加 padding 以防止遮挡 (简单估算高度)
            if (chatContent) chatContent.style.paddingBottom = '160px';
            // 滚动到底部
            setTimeout(() => {
                chatContent.scrollTop = chatContent.scrollHeight;
            }, 100);
        }
    });

    // 绑定工具栏按钮事件
    const summaryBtn = document.getElementById('toolbar-summary');
    const favoriteBtn = document.getElementById('toolbar-favorite');
    const clearBtn = document.getElementById('toolbar-clear');

    if (summaryBtn) {
        summaryBtn.addEventListener('click', () => {
            showToast('正在生成总结...');
            setTimeout(() => {
                showToast('总结功能开发中');
            }, 1000);
        });
    }

    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', () => {
            showToast('已收藏当前对话');
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            showConfirmModal('确定清空当前聊天记录吗？', () => {
                if (chatContent) {
                    chatContent.innerHTML = '';
                    // 如果需要，也可以清空 currentChatCharacter 中的历史记录标志
                }
                showToast('已清空');
            });
        });
    }
}

function openChatPage(character) {
    currentChatCharacter = character;
    const chatPage = document.getElementById('chat-page');
    const title = document.getElementById('chat-title');
    const content = document.getElementById('chat-content');
    
    if (title) title.textContent = character.name;
    
    // 应用背景图
    if (character.background_image) {
        applyChatBackground(character.background_image);
    } else {
        // 恢复默认背景
        const defaultBg = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
        applyChatBackground(defaultBg);
    }
    
    // 模拟聊天记录
    const history = getMockChatHistory(character);
    renderChatHistory(history, content, character);
    
    chatPage.classList.add('active');
    
    // 滚动到底部
    setTimeout(() => {
        content.scrollTop = content.scrollHeight;
    }, 100);
}

function getMockChatHistory(character) {
    let history = [];

    if (character.name === '左然') {
        history = [
            { type: 'left', text: '那我把周边的周边退了买你的你会开心吗\n(眨巴眨巴眼睛)' },
            { type: 'right', text: '(思索片刻，点了点头) 会，但是......' },
            { type: 'right', text: '我希望你能做自己真正喜欢的事情，而不是为了取悦我。' },
            { type: 'left', text: '但是？' },
            { type: 'left', text: '你这么一说我也觉得最近有些冲动了，每次一买都是买很多' },
            { type: 'right', text: '那或许是因为你最近比较烦躁，所以想通过购物来发泄情绪？' },
            { type: 'left', text: '....你真是很懂我，一语道破' },
            { type: 'right', text: '我和你在一起这么久了，多少对你有些了解了。' },
            { type: 'left', text: '(叹气)' },
            { type: 'right', text: '(认真的看着你) 而且你似乎忽略了一点，就是，我随时都可以为你支出，你为什么要现在花掉自己所有的钱呢？' }
        ];
    } else {
        history = [
            { type: 'left', text: `你好，我是${character.name}。` },
            { type: 'right', text: '你好！' },
            { type: 'left', text: '很高兴见到你。' }
        ];
    }

    // 检查是否有自定义开场白设置，如果有，则插入到第一条
    if (character.greeting && character.greeting.trim()) {
        history.unshift({ type: 'left', text: character.greeting, isGreeting: true });
    }

    return history;
}

function renderChatHistory(history, container, character) {
    container.innerHTML = '';
    
    // 获取气泡颜色配置
    const leftColor = character.bubble_color_left || '#ffecd1';
    const rightColor = character.bubble_color_right || '#ffffff';

    history.forEach(msg => {
        const row = document.createElement('div');
        row.className = `chat-message-row ${msg.type}`;
        if (msg.isGreeting) {
            row.classList.add('is-greeting');
        }
        
        // 处理文本中的动作描述 (括号内容)
        let contentHtml = msg.text.replace(/\((.*?)\)/g, '<span class="message-action">($1)</span>');
        
        const bubbleColor = msg.type === 'left' ? leftColor : rightColor;

        row.innerHTML = `
            <div class="message-bubble ${msg.type}" style="background-color: ${bubbleColor}">
                ${contentHtml}
            </div>
        `;
        
        container.appendChild(row);
    });

    // 渲染完成后，检查最后一条消息是否是对方发的，如果是，添加工具栏
    const lastRow = container.lastElementChild;
    if (lastRow && lastRow.classList.contains('left')) {
        const bubble = lastRow.querySelector('.message-bubble');
        addLatestMessageToolbar(bubble);
    }
}

function sendUserMessage(text) {
    // 用户发送消息时，移除所有现有的“最新消息工具栏”
    removeAllToolbars();

    const content = document.getElementById('chat-content');
    const row = document.createElement('div');
    row.className = 'chat-message-row right';
    
    // 获取我的气泡颜色 (从当前角色配置中读取，或者全局配置)
    const rightColor = currentChatCharacter.bubble_color_right || '#ffffff';

    row.innerHTML = `
        <div class="message-bubble right" style="background-color: ${rightColor}">
            ${text}
        </div>
    `;
    
    content.appendChild(row);
    content.scrollTop = content.scrollHeight;
}

// --- 搜索与角色生成逻辑 ---

function initSearch() {
    const searchBtn = document.querySelector('.search-actions .icon-btn-small[title="搜索"]');
    const refreshBtn = document.querySelector('.search-actions .icon-btn-small[title="刷新"]');
    const searchInput = document.querySelector('.search-input');
    const grid = document.querySelector('.character-grid');

    if (!searchBtn || !searchInput || !grid) return;

    // 加载已保存的角色
    loadSavedCharacters('recommend');

    const performSearch = async (keyword) => {
        // 获取 API 配置
        const settings = JSON.parse(localStorage.getItem('starSettings') || '{}');
        if (!settings.apiUrl || !settings.apiKey) {
            showToast('请先在“我的”页面配置 API');
            return;
        }

        // 显示加载状态
        const originalBtnContent = searchBtn.innerHTML;
        searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        searchBtn.disabled = true;
        if (refreshBtn) {
            refreshBtn.classList.add('rotating');
            refreshBtn.disabled = true;
        }
        
        // 简单的 Loading 占位
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 20px; color: var(--secondary-text-color);">正在生成角色...</div>';
        document.getElementById('recommend-empty-state').style.display = 'none';

        try {
            const characters = await fetchCharactersFromApi(keyword, settings);
            renderCharacters(characters);
            
            // 获取当前标签名并保存
            const activeTag = document.querySelector('#tags-bar .tag-item.active');
            let tagName = 'recommend';
            if (activeTag && activeTag.dataset.tag !== 'recommend') {
                tagName = activeTag.querySelector('span').textContent;
            }
            saveCharacters(characters, tagName);
        } catch (error) {
            console.error(error);
            showToast('生成失败: ' + error.message);
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 20px; color: var(--danger-color);">生成失败，请重试</div>';
        } finally {
            searchBtn.innerHTML = originalBtnContent;
            searchBtn.disabled = false;
            if (refreshBtn) {
                refreshBtn.classList.remove('rotating');
                refreshBtn.disabled = false;
            }
        }
    };

    searchBtn.addEventListener('click', () => {
        const searchVal = searchInput.value.trim();
        const activeTag = document.querySelector('#tags-bar .tag-item.active');
        const tagContent = (activeTag && activeTag.dataset.tag !== 'recommend') ? (activeTag.dataset.content || '') : '';
        
        const keyword = [searchVal, tagContent].filter(Boolean).join(' ');

        if (!keyword) {
            showToast('请输入搜索关键词');
            return;
        }
        performSearch(keyword);
    });

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            const searchVal = searchInput.value.trim();
            const activeTag = document.querySelector('#tags-bar .tag-item.active');
            const tagContent = (activeTag && activeTag.dataset.tag !== 'recommend') ? (activeTag.dataset.content || '') : '';
            
            let keyword = [searchVal, tagContent].filter(Boolean).join(' ');

            if (!keyword) {
                keyword = "随机生成多样化的角色";
            }
            performSearch(keyword);
        });
    }
}

function saveCharacters(characters, tagName = 'recommend') {
    if (tagName === 'recommend') {
        localStorage.setItem('starSavedCharacters', JSON.stringify(characters));
    } else {
        const allTagChars = JSON.parse(localStorage.getItem('starTagCharacters') || '{}');
        allTagChars[tagName] = characters;
        localStorage.setItem('starTagCharacters', JSON.stringify(allTagChars));
    }
}

function loadSavedCharacters(tagName = 'recommend') {
    let characters = [];
    if (tagName === 'recommend') {
        const saved = localStorage.getItem('starSavedCharacters');
        if (saved) {
            try {
                characters = JSON.parse(saved);
            } catch (e) {
                console.error('加载保存的角色失败', e);
            }
        }
    } else {
        const allTagChars = JSON.parse(localStorage.getItem('starTagCharacters') || '{}');
        characters = allTagChars[tagName] || [];
    }

    if (Array.isArray(characters) && characters.length > 0) {
        renderCharacters(characters);
    } else {
        showEmptyState();
    }
}

function showEmptyState() {
    const grid = document.querySelector('.character-grid');
    const emptyState = document.getElementById('recommend-empty-state');
    if (grid) grid.innerHTML = '';
    if (emptyState) emptyState.style.display = 'flex';
}

async function fetchCharactersFromApi(keyword, settings) {
    const prompt = `请根据关键词"${keyword}"创作4个虚构角色的详细设定。
    
要求：
1. 返回格式必须是严格的 JSON 数组，不要包含 markdown 代码块标记（如 \`\`\`json）。
2. 数组中包含 4 个对象。
3. 每个对象包含以下字段：
   - name: 姓名
   - age: 年龄 (字符串，如 "25岁")
   - identity: 身份/职业
   - background: 背景故事 (50字以内)
   - color: 代表色 (十六进制颜色代码，如 "#FF5733")

示例格式：
[{"name":"张三","age":"20岁","identity":"学生","background":"...","color":"#123456"}, ...]`;

    let apiUrl = settings.apiUrl.replace(/\/$/, ''); // 去除尾部斜杠
    // 简单的 URL 补全逻辑
    if (!apiUrl.includes('/chat/completions')) {
        if (apiUrl.endsWith('/v1')) {
            apiUrl += '/chat/completions';
        } else {
            apiUrl += '/v1/chat/completions';
        }
    }

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${settings.apiKey}`
        },
        body: JSON.stringify({
            model: settings.model || 'gpt-3.5-turbo',
            messages: [
                { role: "system", content: "你是一个创意角色生成助手。请只返回 JSON 数据。" },
                { role: "user", content: prompt }
            ],
            temperature: parseFloat(settings.temperature) || 0.7
        })
    });

    if (!response.ok) {
        throw new Error(`API 请求失败: ${response.status}`);
    }

    const data = await response.json();
    // 兼容不同的 API 返回格式 (有些可能直接返回 content，有些在 choices 里)
    const content = data.choices?.[0]?.message?.content || data.content || '';
    
    if (!content) {
        throw new Error("API 返回内容为空");
    }

    // 尝试解析 JSON，处理可能存在的 markdown 标记
    try {
        const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanContent);
    } catch (e) {
        console.error("JSON 解析失败", content);
        throw new Error("API 返回格式错误");
    }
}

function renderCharacters(characters) {
    const grid = document.querySelector('.character-grid');
    grid.innerHTML = '';

    if (!Array.isArray(characters) || characters.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center;">未生成有效数据</div>';
        return;
    }

    characters.forEach(char => {
        const card = document.createElement('div');
        card.className = 'character-card';
        
        // 使用生成的颜色作为背景，如果没有则用默认
        const bgColor = char.color || 'var(--card-bg)';
        
        card.innerHTML = `
            <div class="card-image" style="background-color: ${bgColor}; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.5); font-size: 40px;">
                <i class="fas fa-user"></i>
            </div>
            <div class="card-info">
                <div class="card-name" style="font-size: 16px; font-weight: bold;">${char.name}</div>
                <div class="card-detail" style="font-size: 12px; color: rgba(255,255,255,0.8); margin-top: 4px;">${char.age} | ${char.identity}</div>
                <div class="card-desc" style="font-size: 12px; color: rgba(255,255,255,0.6); margin-top: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${char.background}</div>
            </div>
        `;
        
        // 绑定点击事件
        card.addEventListener('click', () => {
            showCharacterDetail(char);
        });
        
        grid.appendChild(card);
    });
}

// --- 标签栏逻辑 ---

let currentEditingTag = null;

function saveTagsToLocalStorage() {
    const tags = [];
    const tagItems = document.querySelectorAll('#tags-bar .tag-item');
    tagItems.forEach(item => {
        // 跳过推荐标签和添加按钮
        if (item.dataset.tag === 'recommend' || item.classList.contains('add-tag-btn')) {
            return;
        }
        tags.push({
            name: item.querySelector('span').textContent,
            content: item.dataset.content || ''
        });
    });
    localStorage.setItem('wawTags', JSON.stringify(tags));
}

function loadTagsFromLocalStorage() {
    const tags = JSON.parse(localStorage.getItem('wawTags') || '[]');
    const tagsBar = document.getElementById('tags-bar');
    const addTagBtn = document.getElementById('add-tag-btn');
    
    if (!tagsBar || !addTagBtn) return;

    tags.forEach(tag => {
        const newTag = document.createElement('div');
        newTag.className = 'tag-item';
        newTag.dataset.content = tag.content;
        
        const textSpan = document.createElement('span');
        textSpan.textContent = tag.name;
        newTag.appendChild(textSpan);
        
        tagsBar.insertBefore(newTag, addTagBtn);
    });
}

function initTagsBar() {
    const tagsBar = document.getElementById('tags-bar');
    const addTagBtn = document.getElementById('add-tag-btn');
    const confirmAddTagBtn = document.getElementById('confirm-add-tag-btn');
    
    // 标签操作模态框按钮
    const editTagActionBtn = document.getElementById('edit-tag-action-btn');
    const deleteTagActionBtn = document.getElementById('delete-tag-action-btn');

    if (!tagsBar || !addTagBtn) return;

    // 加载保存的标签
    loadTagsFromLocalStorage();

    // 绑定添加按钮事件
    addTagBtn.addEventListener('click', () => {
        currentEditingTag = null;
        document.getElementById('add-tag-modal-title').textContent = '添加新标签';
        document.getElementById('new-tag-name').value = '';
        document.getElementById('new-tag-content').value = '';
        openModal('add-tag-modal');
        document.getElementById('new-tag-name').focus();
    });

    // 确认添加/保存标签
    if (confirmAddTagBtn) {
        confirmAddTagBtn.addEventListener('click', () => {
            const name = document.getElementById('new-tag-name').value.trim();
            const content = document.getElementById('new-tag-content').value.trim();
            
            if (name) {
                if (currentEditingTag) {
                    // 编辑模式
                    updateTag(currentEditingTag, name, content);
                } else {
                    // 新增模式
                    addNewTag(name, content);
                }
                closeModal('add-tag-modal');
            } else {
                showToast('请输入标签名称');
            }
        });
    }

    // 绑定现有标签点击事件 (委托)
    tagsBar.addEventListener('click', (e) => {
        const tag = e.target.closest('.tag-item');
        // 忽略添加按钮和删除按钮的点击（删除按钮有自己的事件）
        if (tag && !tag.classList.contains('add-tag-btn') && !e.target.closest('.tag-delete-btn')) {
            handleTagClick(tag);
        }
    });

    // 绑定标签操作模态框事件
    if (editTagActionBtn) {
        editTagActionBtn.addEventListener('click', () => {
            if (currentEditingTag) {
                closeModal('tag-actions-modal');
                // 打开编辑模态框
                document.getElementById('add-tag-modal-title').textContent = '编辑标签';
                document.getElementById('new-tag-name').value = currentEditingTag.querySelector('span').textContent;
                document.getElementById('new-tag-content').value = currentEditingTag.dataset.content || '';
                openModal('add-tag-modal');
            }
        });
    }

    if (deleteTagActionBtn) {
        deleteTagActionBtn.addEventListener('click', () => {
            if (currentEditingTag) {
                closeModal('tag-actions-modal');
                const name = currentEditingTag.querySelector('span').textContent;
                showConfirmModal(`确定删除标签 "${name}" 吗？`, () => {
                    // 删除对应的数据
                    const allTagChars = JSON.parse(localStorage.getItem('starTagCharacters') || '{}');
                    if (allTagChars[name]) {
                        delete allTagChars[name];
                        localStorage.setItem('starTagCharacters', JSON.stringify(allTagChars));
                    }

                    // 如果删除的是当前激活的标签，切换回推荐
                    if (currentEditingTag.classList.contains('active')) {
                        const recommendTag = tagsBar.querySelector('[data-tag="recommend"]');
                        if (recommendTag) handleTagClick(recommendTag);
                    }
                    currentEditingTag.remove();
                    currentEditingTag = null;
                    saveTagsToLocalStorage();
                });
            }
        });
    }
}

function handleTagClick(tag) {
    const tagsBar = document.getElementById('tags-bar');
    const isRecommend = tag.dataset.tag === 'recommend';
    const isActive = tag.classList.contains('active');

    // 如果点击的是“推荐”标签
    if (isRecommend) {
        switchTag(tag);
        renderTagContent(tag);
        return;
    }

    // 如果点击的是其他标签
    if (isActive) {
        // 如果已经激活，再次点击弹出操作菜单
        currentEditingTag = tag;
        openModal('tag-actions-modal');
    } else {
        // 如果未激活，切换到该标签
        switchTag(tag);
        renderTagContent(tag);
    }
}

function updateTag(tag, name, content) {
    const oldName = tag.querySelector('span').textContent;
    
    // 迁移数据
    if (oldName !== name) {
        const allTagChars = JSON.parse(localStorage.getItem('starTagCharacters') || '{}');
        if (allTagChars[oldName]) {
            allTagChars[name] = allTagChars[oldName];
            delete allTagChars[oldName];
            localStorage.setItem('starTagCharacters', JSON.stringify(allTagChars));
        }
    }

    tag.querySelector('span').textContent = name;
    tag.dataset.content = content;
    // 如果当前正在显示该标签的内容，实时更新
    if (tag.classList.contains('active')) {
        renderTagContent(tag);
    }
    showToast('标签已更新');
    saveTagsToLocalStorage();
}

function switchTag(tag) {
    const tagsBar = document.getElementById('tags-bar');
    tagsBar.querySelectorAll('.tag-item').forEach(t => t.classList.remove('active'));
    tag.classList.add('active');
}

function renderTagContent(tag) {
    const container = document.querySelector('.recommend-content');
    const grid = container.querySelector('.character-grid');
    const customContent = container.querySelector('.custom-tag-content');

    // 确保网格显示
    if (grid) grid.style.display = 'grid';
    
    // 隐藏自定义内容（如果存在）
    if (customContent) customContent.style.display = 'none';

    // 获取标签名
    let tagName = 'recommend';
    if (tag.dataset.tag !== 'recommend') {
        tagName = tag.querySelector('span').textContent;
    }

    // 加载数据
    loadSavedCharacters(tagName);
}

function addNewTag(name, content) {
    const tagsBar = document.getElementById('tags-bar');
    const addTagBtn = document.getElementById('add-tag-btn');
    
    const newTag = document.createElement('div');
    newTag.className = 'tag-item';
    newTag.dataset.content = content;
    
    // 标签文本
    const textSpan = document.createElement('span');
    textSpan.textContent = name;
    newTag.appendChild(textSpan);

    // 移除旧的删除按钮逻辑，现在统一使用操作菜单
    
    // 插入到添加按钮之前
    tagsBar.insertBefore(newTag, addTagBtn);
    
    // 自动激活新标签
    handleTagClick(newTag);
    
    // 滚动到新标签
    newTag.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    saveTagsToLocalStorage();
}

// --- 规则句 (Worldbook) 逻辑 ---

let currentEditingItemId = null;
let confirmCallback = null;
let promptCallback = null;

function initWorldbook() {
    // 导航逻辑
    const menuWorldbook = document.getElementById('menu-worldbook');
    const backBtn = document.getElementById('back-to-profile-btn');
    const worldbookPage = document.getElementById('worldbook');
    const profilePage = document.getElementById('profile');
    const pages = document.querySelectorAll('.page');

    if (menuWorldbook) {
        menuWorldbook.addEventListener('click', () => {
            pages.forEach(p => p.classList.remove('active'));
            worldbookPage.classList.add('active');
        });
    }

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            pages.forEach(p => p.classList.remove('active'));
            profilePage.classList.add('active');
        });
    }

    // 绑定按钮事件
    const addFolderBtn = document.getElementById('add-folder-btn');
    if (addFolderBtn) {
        addFolderBtn.addEventListener('click', () => {
            openModal('new-folder-modal');
            document.getElementById('folder-name-input').focus();
        });
    }

    const confirmFolderBtn = document.getElementById('confirm-folder-btn');
    if (confirmFolderBtn) {
        confirmFolderBtn.addEventListener('click', () => {
            const input = document.getElementById('folder-name-input');
            const name = input.value.trim();
            if (name) {
                addFolder(name);
                closeModal('new-folder-modal');
                input.value = '';
                showToast('文件夹创建成功');
            } else {
                showToast('请输入名称');
            }
        });
    }

    const addWorldbookBtn = document.getElementById('add-worldbook-btn');
    if (addWorldbookBtn) {
        addWorldbookBtn.addEventListener('click', openAddPage);
    }

    const closeAddWorldbookBtn = document.getElementById('close-add-worldbook-btn');
    if (closeAddWorldbookBtn) {
        closeAddWorldbookBtn.addEventListener('click', closeAddPage);
    }
    
    const saveWorldbookItemBtn = document.getElementById('save-worldbook-item-btn');
    if (saveWorldbookItemBtn) {
        saveWorldbookItemBtn.addEventListener('click', saveWorldbookItem);
    }

    // 模态框确认按钮
    const confirmModalOkBtn = document.getElementById('confirm-modal-ok-btn');
    if (confirmModalOkBtn) {
        confirmModalOkBtn.addEventListener('click', () => {
            if (confirmCallback) confirmCallback();
            closeModal('universal-confirm-modal');
        });
    }

    const promptModalOkBtn = document.getElementById('prompt-modal-ok-btn');
    if (promptModalOkBtn) {
        promptModalOkBtn.addEventListener('click', () => {
            const val = document.getElementById('prompt-modal-input').value;
            if (promptCallback) promptCallback(val);
            closeModal('universal-prompt-modal');
        });
    }

    // 初始化自定义下拉菜单
    initCustomSelect();

    // 加载数据
    loadFolders();
}

// --- 文件夹管理 ---

function loadFolders() {
    const list = document.getElementById('folder-list');
    if (!list) return;
    list.innerHTML = '';
    const folders = JSON.parse(localStorage.getItem('starWorldbookFolders') || '[]');
    
    folders.forEach(folder => renderFolder(folder));
    updateEmptyState();
}

function addFolder(name) {
    const folders = JSON.parse(localStorage.getItem('starWorldbookFolders') || '[]');
    const folder = {
        id: Date.now().toString(),
        name: name,
        createdAt: new Date().toISOString()
    };
    folders.push(folder);
    localStorage.setItem('starWorldbookFolders', JSON.stringify(folders));
    renderFolder(folder);
    updateEmptyState();
}

function renderFolder(folder) {
    const list = document.getElementById('folder-list');
    const container = document.createElement('div');
    container.className = 'folder-container';
    container.dataset.id = folder.id;

    container.innerHTML = `
        <div class="folder-header">
            <div class="folder-icon"><i class="fas fa-folder"></i></div>
            <div class="folder-name">${folder.name}</div>
            <div class="folder-arrow"><i class="fas fa-chevron-right"></i></div>
        </div>
        <div class="folder-dropdown">
            <div class="folder-actions-bar">
                <div class="folder-action-btn edit-btn">编辑文件夹</div>
                <div class="folder-action-btn delete-btn">删除文件夹</div>
            </div>
            <div class="folder-items-list"></div>
        </div>
    `;

    // 事件绑定
    const header = container.querySelector('.folder-header');
    const dropdown = container.querySelector('.folder-dropdown');
    const arrow = container.querySelector('.folder-arrow i');
    const itemsList = container.querySelector('.folder-items-list');

    header.addEventListener('click', () => {
        const isHidden = dropdown.style.display !== 'flex';
        dropdown.style.display = isHidden ? 'flex' : 'none';
        arrow.className = isHidden ? 'fas fa-chevron-down' : 'fas fa-chevron-right';
        if (isHidden) renderFolderItems(folder.id, itemsList);
    });

    container.querySelector('.edit-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        showPromptModal('重命名文件夹', folder.name, (newName) => {
            if (newName && newName.trim()) {
                updateFolderName(folder.id, newName.trim());
            }
        });
    });

    container.querySelector('.delete-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        showConfirmModal(`确定删除 "${folder.name}" 及其内容吗？`, () => {
            deleteFolder(folder.id, container);
        });
    });

    list.appendChild(container);
}

function updateFolderName(id, newName) {
    const folders = JSON.parse(localStorage.getItem('starWorldbookFolders') || '[]');
    const folder = folders.find(f => f.id === id);
    if (folder) {
        folder.name = newName;
        localStorage.setItem('starWorldbookFolders', JSON.stringify(folders));
        loadFolders(); // 简单重载
        showToast('已重命名');
    }
}

function deleteFolder(id, element) {
    let folders = JSON.parse(localStorage.getItem('starWorldbookFolders') || '[]');
    folders = folders.filter(f => f.id !== id);
    localStorage.setItem('starWorldbookFolders', JSON.stringify(folders));
    
    // 清理条目数据
    let items = JSON.parse(localStorage.getItem('starWorldbookItems') || '[]');
    items = items.filter(i => i.folderId !== id);
    localStorage.setItem('starWorldbookItems', JSON.stringify(items));

    element.remove();
    updateEmptyState();
    showToast('文件夹已删除');
}

// --- 条目管理 ---

function renderFolderItems(folderId, container) {
    container.innerHTML = '';
    const items = JSON.parse(localStorage.getItem('starWorldbookItems') || '[]');
    const folderItems = items.filter(i => i.folderId === folderId);

    if (folderItems.length === 0) {
        container.innerHTML = '<div class="folder-empty-msg">暂无内容</div>';
        return;
    }

    folderItems.forEach(item => {
        const el = document.createElement('div');
        el.className = 'worldbook-item';
        el.innerHTML = `
            <div class="item-title">${item.title}</div>
            <div class="item-delete-btn"><i class="fas fa-trash"></i></div>
        `;
        
        el.addEventListener('click', () => openEditPage(item));
        el.querySelector('.item-delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            showConfirmModal(`确定删除 "${item.title}" 吗？`, () => {
                deleteItem(item.id, el, container);
            });
        });

        container.appendChild(el);
    });
}

function deleteItem(id, element, container) {
    let items = JSON.parse(localStorage.getItem('starWorldbookItems') || '[]');
    items = items.filter(i => i.id !== id);
    localStorage.setItem('starWorldbookItems', JSON.stringify(items));
    element.remove();
    if (container.children.length === 0) {
        container.innerHTML = '<div class="folder-empty-msg">暂无内容</div>';
    }
    showToast('已删除');
}

// --- 新增/编辑页面逻辑 ---

function openAddPage() {
    currentEditingItemId = null;
    document.getElementById('add-page-title').textContent = '新增规则句';
    document.getElementById('worldbook-title-input').value = '';
    document.getElementById('worldbook-content-input').value = '';
    resetFolderSelect();
    document.getElementById('add-worldbook-page').classList.add('active');
}

function openEditPage(item) {
    currentEditingItemId = item.id;
    document.getElementById('add-page-title').textContent = '编辑规则句';
    document.getElementById('worldbook-title-input').value = item.title;
    document.getElementById('worldbook-content-input').value = item.content || '';
    
    // 设置文件夹选中状态
    loadFolderOptions();
    const folderId = item.folderId || '';
    document.getElementById('selected-folder-value').value = folderId;
    
    // 更新显示文本
    const options = document.querySelectorAll('.custom-option');
    let found = false;
    options.forEach(opt => {
        opt.classList.remove('selected');
        if (opt.dataset.value === folderId) {
            opt.classList.add('selected');
            document.getElementById('selected-folder-text').textContent = opt.textContent;
            found = true;
        }
    });
    if (!found) document.getElementById('selected-folder-text').textContent = '无';

    document.getElementById('add-worldbook-page').classList.add('active');
}

function closeAddPage() {
    document.getElementById('add-worldbook-page').classList.remove('active');
}

function saveWorldbookItem() {
    const title = document.getElementById('worldbook-title-input').value.trim();
    const content = document.getElementById('worldbook-content-input').value.trim();
    let folderId = document.getElementById('selected-folder-value').value;

    if (!title) {
        showToast('请输入名称');
        return;
    }

    if (!folderId) {
        folderId = getOrCreateUncategorizedFolder();
    }

    let items = JSON.parse(localStorage.getItem('starWorldbookItems') || '[]');

    if (currentEditingItemId) {
        const index = items.findIndex(i => i.id === currentEditingItemId);
        if (index !== -1) {
            items[index] = { ...items[index], title, content, folderId, updatedAt: new Date().toISOString() };
        }
    } else {
        items.push({
            id: Date.now().toString(),
            title,
            content,
            folderId,
            createdAt: new Date().toISOString()
        });
    }

    localStorage.setItem('starWorldbookItems', JSON.stringify(items));
    showToast('保存成功');
    closeAddPage();
    loadFolders(); // 刷新列表
}

function getOrCreateUncategorizedFolder() {
    let folders = JSON.parse(localStorage.getItem('starWorldbookFolders') || '[]');
    let uncategorized = folders.find(f => f.name === '未分类');
    if (!uncategorized) {
        uncategorized = { id: Date.now().toString(), name: '未分类', createdAt: new Date().toISOString() };
        folders.push(uncategorized);
        localStorage.setItem('starWorldbookFolders', JSON.stringify(folders));
    }
    return uncategorized.id;
}

// --- 辅助功能 ---

function updateEmptyState() {
    const list = document.getElementById('folder-list');
    const empty = document.getElementById('worldbook-empty-state');
    if (list && empty) {
        empty.style.display = list.children.length > 0 ? 'none' : 'flex';
    }
}

function loadFolderOptions() {
    const container = document.getElementById('folder-options');
    if (!container) return;
    container.innerHTML = '<div class="custom-option selected" data-value="">无</div>';
    const folders = JSON.parse(localStorage.getItem('starWorldbookFolders') || '[]');
    folders.forEach(f => {
        const div = document.createElement('div');
        div.className = 'custom-option';
        div.dataset.value = f.id;
        div.textContent = f.name;
        container.appendChild(div);
    });
    initCustomSelect(); // 重新绑定事件
}

function resetFolderSelect() {
    loadFolderOptions();
    document.getElementById('selected-folder-value').value = '';
    document.getElementById('selected-folder-text').textContent = '无';
}

function initCustomSelect() {
    const selects = document.querySelectorAll('.custom-select');
    selects.forEach(select => {
        const trigger = select.querySelector('.custom-select-trigger');
        const options = select.querySelectorAll('.custom-option');
        const hiddenInput = select.parentElement.querySelector('input[type="hidden"]');
        
        // 移除旧监听器（简单粗暴克隆替换）
        const newTrigger = trigger.cloneNode(true);
        trigger.parentNode.replaceChild(newTrigger, trigger);
        
        // 获取新的 textSpan (必须在替换后获取)
        const textSpan = newTrigger.querySelector('span');

        newTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            // 关闭其他打开的下拉框
            document.querySelectorAll('.custom-select.open').forEach(s => {
                if (s !== select) s.classList.remove('open');
            });
            select.classList.toggle('open');
        });

        options.forEach(opt => {
            // 同样克隆替换以移除旧监听器
            const newOpt = opt.cloneNode(true);
            opt.parentNode.replaceChild(newOpt, opt);
            
            newOpt.addEventListener('click', (e) => {
                e.stopPropagation();
                select.classList.remove('open');
                select.querySelectorAll('.custom-option').forEach(o => o.classList.remove('selected'));
                newOpt.classList.add('selected');
                if (textSpan) textSpan.textContent = newOpt.textContent;
                if (hiddenInput) hiddenInput.value = newOpt.dataset.value;
            });
        });
    });

    document.addEventListener('click', () => {
        selects.forEach(s => s.classList.remove('open'));
    });
}

// --- 模态框与提示 ---

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('active');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
}

function showConfirmModal(msg, callback) {
    document.getElementById('confirm-modal-message').textContent = msg;
    confirmCallback = callback;
    openModal('universal-confirm-modal');
}

function showPromptModal(title, defaultVal, callback) {
    document.getElementById('prompt-modal-title').textContent = title;
    document.getElementById('prompt-modal-input').value = defaultVal || '';
    promptCallback = callback;
    openModal('universal-prompt-modal');
    document.getElementById('prompt-modal-input').focus();
}

function showToast(msg) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// --- API 设置逻辑 ---

function initApiSettings() {
    // 导航逻辑
    const menuApiSettings = document.getElementById('menu-api-settings');
    const closeApiSettingsBtn = document.getElementById('close-api-settings-btn');
    const apiSettingsPage = document.getElementById('api-settings-page');

    if (menuApiSettings && apiSettingsPage) {
        menuApiSettings.addEventListener('click', () => {
            apiSettingsPage.classList.add('active');
        });
    }

    if (closeApiSettingsBtn && apiSettingsPage) {
        closeApiSettingsBtn.addEventListener('click', () => {
            apiSettingsPage.classList.remove('active');
        });
    }

    // 加载保存的设置
    loadSettings();
    
    // 初始化下拉菜单 (重新初始化以包含新元素)
    initCustomSelect();

    // 绑定事件
    const saveBtn = document.getElementById('save-settings-btn');
    const fetchBtn = document.getElementById('fetch-models-btn');
    const tempSlider = document.getElementById('temperature');
    const tempValue = document.getElementById('temp-value');

    // 温度滑块
    if (tempSlider && tempValue) {
        tempSlider.addEventListener('input', (e) => {
            tempValue.textContent = e.target.value;
        });
    }

    // 保存设置
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const settings = {
                apiUrl: document.getElementById('api-url').value,
                apiKey: document.getElementById('api-key').value,
                model: document.getElementById('model-select-value').value,
                temperature: document.getElementById('temperature').value
            };

            localStorage.setItem('starSettings', JSON.stringify(settings));
            
            // 保存模型列表选项
            const customOptions = document.querySelectorAll('#model-options .custom-option');
            const modelOptions = Array.from(customOptions).map(opt => ({
                value: opt.dataset.value,
                text: opt.textContent
            })).filter(opt => opt.value !== "");
            
            localStorage.setItem('starModelOptions', JSON.stringify(modelOptions));

            showToast('设置已保存');
        });
    }

    // 拉取模型
    if (fetchBtn) {
        fetchBtn.addEventListener('click', async () => {
            const apiUrl = document.getElementById('api-url').value;
            const apiKey = document.getElementById('api-key').value;

            if (!apiUrl || !apiKey) {
                showToast('请先填写 API URL 和 API Key');
                return;
            }

            fetchBtn.classList.add('rotating');
            
            try {
                // 处理 URL，确保没有尾随斜杠
                const baseUrl = apiUrl.replace(/\/$/, '');
                const response = await fetch(`${baseUrl}/models`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                const customOptions = document.getElementById('model-options');
                
                if (customOptions) {
                    customOptions.innerHTML = '<div class="custom-option" data-value="">请选择模型</div>';
                    
                    if (data.data && Array.isArray(data.data)) {
                        data.data.forEach(model => {
                            const option = document.createElement('div');
                            option.className = 'custom-option';
                            option.dataset.value = model.id;
                            option.textContent = model.id;
                            customOptions.appendChild(option);
                        });
                        
                        initCustomSelect(); // 重新绑定
                        showToast('模型列表更新成功！');
                    } else {
                        showToast('获取到的数据格式不正确');
                    }
                }
            } catch (error) {
                console.error('获取模型失败:', error);
                showToast('获取模型失败，请检查配置');
            } finally {
                fetchBtn.classList.remove('rotating');
            }
        });
    }
}

function loadSettings() {
    const savedSettings = localStorage.getItem('starSettings');
    const savedModelOptions = localStorage.getItem('starModelOptions');

    // 恢复模型选项
    if (savedModelOptions) {
        const options = JSON.parse(savedModelOptions);
        const customOptionsContainer = document.getElementById('model-options');
        
        if (customOptionsContainer && options.length > 0) {
            customOptionsContainer.innerHTML = '<div class="custom-option" data-value="">请选择或拉取模型</div>';
            options.forEach(opt => {
                const option = document.createElement('div');
                option.className = 'custom-option';
                option.dataset.value = opt.value;
                option.textContent = opt.text;
                customOptionsContainer.appendChild(option);
            });
        }
    }

    // 恢复表单值
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        const apiUrlInput = document.getElementById('api-url');
        const apiKeyInput = document.getElementById('api-key');
        const hiddenInput = document.getElementById('model-select-value');
        const selectedText = document.getElementById('selected-model-text');
        const tempSlider = document.getElementById('temperature');
        const tempValue = document.getElementById('temp-value');

        if (apiUrlInput) apiUrlInput.value = settings.apiUrl || '';
        if (apiKeyInput) apiKeyInput.value = settings.apiKey || '';
        
        if (hiddenInput && settings.model) {
            hiddenInput.value = settings.model;
            // 查找对应的选项文本
            const option = document.querySelector(`#model-options .custom-option[data-value="${settings.model}"]`);
            if (option) {
                if (selectedText) selectedText.textContent = option.textContent;
                // 移除其他选中状态
                document.querySelectorAll('#model-options .custom-option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
            } else {
                if (selectedText) selectedText.textContent = settings.model;
            }
        }
        
        if (tempSlider) tempSlider.value = settings.temperature || 0.7;
        if (tempValue) tempValue.textContent = settings.temperature || 0.7;
    }
}

// --- 角色详情页逻辑 ---

function initCharacterDetail() {
    const detailPage = document.getElementById('character-detail-page');
    const closeBtn = document.getElementById('close-detail-btn');
    const startChatBtn = document.getElementById('start-chat-btn');

    if (closeBtn && detailPage) {
        closeBtn.addEventListener('click', () => {
            detailPage.classList.remove('active');
        });
    }

    if (startChatBtn) {
        startChatBtn.addEventListener('click', () => {
            showToast('开始对话功能开发中...');
        });
    }
}

function showCharacterDetail(char) {
    const detailPage = document.getElementById('character-detail-page');
    if (!detailPage) return;

    // 填充数据
    document.getElementById('detail-name').textContent = char.name || '未知角色';
    document.getElementById('detail-age').textContent = char.age || '未知年龄';
    document.getElementById('detail-identity').textContent = char.identity || '未知身份';
    document.getElementById('detail-background').textContent = char.background || '暂无背景故事';
    
    // 设置头像颜色
    const avatar = document.getElementById('detail-avatar');
    if (avatar) {
        avatar.style.backgroundColor = char.color || 'var(--card-bg)';
    }

    // 显示页面
    detailPage.classList.add('active');
}

// --- 聊天设置页面逻辑 ---

function initChatSettings() {
    const settingsPage = document.getElementById('chat-settings-page');
    const closeBtn = document.getElementById('close-chat-settings-btn');
    const saveBtn = document.getElementById('save-chat-settings-btn');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            settingsPage.classList.remove('active');
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', saveChatSettings);
    }

    // 壁纸上传逻辑
    const fullImagePreview = document.getElementById('settings-full-image');
    const bgUploadInput = document.getElementById('settings-bg-upload');
    
    if (fullImagePreview && bgUploadInput) {
        fullImagePreview.addEventListener('click', () => {
            bgUploadInput.click();
        });

        bgUploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const result = e.target.result;
                    // 更新预览
                    const img = fullImagePreview.querySelector('img');
                    const placeholder = fullImagePreview.querySelector('.image-placeholder');
                    img.src = result;
                    img.style.display = 'block';
                    placeholder.style.display = 'none';
                    
                    // 实时更新当前聊天背景
                    applyChatBackground(result);
                    
                    // 更新数据对象
                    if (currentChatCharacter) {
                        currentChatCharacter.background_image = result;
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // 头像上传逻辑
    const avatarPreview = document.getElementById('settings-avatar-preview');
    const avatarUploadInput = document.getElementById('settings-avatar-upload');

    const triggerAvatarUpload = () => avatarUploadInput.click();

    if (avatarPreview && avatarUploadInput) {
        avatarPreview.addEventListener('click', triggerAvatarUpload);

        avatarUploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const result = e.target.result;
                    // 更新预览
                    const img = avatarPreview.querySelector('img');
                    const placeholder = avatarPreview.querySelector('.avatar-placeholder');
                    img.src = result;
                    img.style.display = 'block';
                    placeholder.style.display = 'none';
                    
                    // 更新数据对象
                    if (currentChatCharacter) {
                        currentChatCharacter.avatar = result;
                        
                        // 如果当前是消息列表中的角色，尝试更新列表头像
                        updateMessageListAvatar(currentChatCharacter.name, result);
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

function applyChatBackground(imageUrl) {
    const chatPage = document.getElementById('chat-page');
    // 保持遮罩渐变
    const gradient = 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3))';
    const lightGradient = 'linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.1))';
    
    // 更新 #chat-page
    chatPage.style.backgroundImage = `${gradient}, url('${imageUrl}')`;
    
    // 更新 .chat-header::before (通过 style 标签)
    let styleTag = document.getElementById('dynamic-chat-bg');
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'dynamic-chat-bg';
        document.head.appendChild(styleTag);
    }
    
    styleTag.innerHTML = `
        #chat-page {
            background-image: ${gradient}, url('${imageUrl}') !important;
            background-attachment: fixed !important;
            background-position: center center !important;
            background-size: cover !important;
        }
        .chat-header::before {
            background-image: ${gradient}, url('${imageUrl}') !important;
            background-attachment: fixed !important;
            background-position: center center !important;
            background-size: cover !important;
        }
        body.light-mode #chat-page {
            background-image: ${lightGradient}, url('${imageUrl}') !important;
            background-attachment: fixed !important;
            background-position: center center !important;
            background-size: cover !important;
        }
        body.light-mode .chat-header::before {
            background-image: ${lightGradient}, url('${imageUrl}') !important;
            background-attachment: fixed !important;
            background-position: center center !important;
            background-size: cover !important;
        }
    `;
}

function updateMessageListAvatar(name, avatarUrl) {
    const messageItems = document.querySelectorAll('.message-item');
    messageItems.forEach(item => {
        const nameEl = item.querySelector('.message-name');
        if (nameEl && nameEl.textContent === name) {
            const avatarContainer = item.querySelector('.message-avatar');
            avatarContainer.innerHTML = `<img src="${avatarUrl}" alt="${name}">`;
        }
    });
}

function openChatSettings() {
    console.log('Opening chat settings...', currentChatCharacter);
    if (!currentChatCharacter) {
        console.error('No current character selected');
        return;
    }

    const settingsPage = document.getElementById('chat-settings-page');
    const nameInput = document.getElementById('settings-name-input');
    const descInput = document.getElementById('settings-desc-input');
    
    const userNameInput = document.getElementById('settings-user-name-input');
    const userPersonaInput = document.getElementById('settings-user-persona-input');
    const greetingInput = document.getElementById('settings-greeting-input');
    
    // 填充数据
    nameInput.value = currentChatCharacter.name || '';
    descInput.value = currentChatCharacter.background || ''; // 假设 background 对应角色设定
    
    userNameInput.value = currentChatCharacter.user_name || '';
    userPersonaInput.value = currentChatCharacter.user_persona || '';
    greetingInput.value = currentChatCharacter.greeting || '';

    // 处理图片预览
    updateSettingsImagePreview(currentChatCharacter);

    // --- 高级设置回显 ---
    loadAdvancedSettings(currentChatCharacter);

    settingsPage.classList.add('active');
}

// 加载高级设置
function loadAdvancedSettings(char) {
    // 1. 关联规则句 - 多选
    loadRulesFolderOptions(char.rules_folders || []);

    // 2. 后台活动
    const bgToggle = document.getElementById('background-activity-toggle');
    const cooldownContainer = document.getElementById('cooldown-container');
    const cooldownInput = document.getElementById('cooldown-input');
    
    if (bgToggle) {
        bgToggle.checked = !!char.enable_background_activity;
        
        // 绑定切换事件
        bgToggle.onchange = () => {
            cooldownContainer.style.display = bgToggle.checked ? 'block' : 'none';
        };
        
        // 初始化显示状态
        cooldownContainer.style.display = bgToggle.checked ? 'block' : 'none';
    }
    
    if (cooldownInput) {
        cooldownInput.value = char.background_cooldown || '';
    }

    // 3. 聊天模式
    const chatModeToggle = document.getElementById('chat-mode-toggle');
    if (chatModeToggle) {
        chatModeToggle.checked = !!char.enable_chat_mode;
    }

    // 4. 上下文条数
    const contextInput = document.getElementById('context-count-input');
    if (contextInput) {
        contextInput.value = char.context_count || '';
    }

    // 5. 当前对话条数 (显示)
    const currentChatCount = document.getElementById('current-chat-count');
    if (currentChatCount) {
        // 实时获取 DOM 中的消息数量
        const rows = document.querySelectorAll('#chat-content .chat-message-row');
        currentChatCount.textContent = rows.length;
    }

    // 6. 气泡颜色
    // 对方气泡
    const leftColor = char.bubble_color_left || '#ffecd1'; // 默认浅橙色
    document.getElementById('left-bubble-color-picker').value = leftColor;
    document.getElementById('left-bubble-color-preview').style.backgroundColor = leftColor;
    document.getElementById('left-bubble-color-input').value = leftColor;

    // 我的气泡
    const rightColor = char.bubble_color_right || '#ffffff'; // 默认白色
    document.getElementById('right-bubble-color-picker').value = rightColor;
    document.getElementById('right-bubble-color-preview').style.backgroundColor = rightColor;
    document.getElementById('right-bubble-color-input').value = rightColor;

    // 绑定颜色选择器事件
    bindColorPickerEvents('left-bubble-color-picker', 'left-bubble-color-input', 'left-bubble-color-preview', 'left');
    bindColorPickerEvents('right-bubble-color-picker', 'right-bubble-color-input', 'right-bubble-color-preview', 'right');
}

function bindColorPickerEvents(pickerId, inputId, previewId, bubbleType) {
    const picker = document.getElementById(pickerId);
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);

    if (!picker || !input || !preview) return;

    const updateChatBubbles = (color) => {
        // 实时更新当前聊天页面的气泡颜色
        if (bubbleType) {
            const bubbles = document.querySelectorAll(`#chat-content .message-bubble.${bubbleType}`);
            bubbles.forEach(bubble => {
                bubble.style.backgroundColor = color;
            });
        }
    };

    // 颜色选择器改变 -> 更新输入框和预览
    picker.oninput = () => {
        const color = picker.value;
        input.value = color;
        preview.style.backgroundColor = color;
        updateChatBubbles(color);
    };

    // 输入框改变 -> 更新选择器和预览
    input.onchange = () => {
        let color = input.value.trim();
        // 简单的 hex 校验补全
        if (color.match(/^#[0-9A-Fa-f]{6}$/)) {
            picker.value = color;
            preview.style.backgroundColor = color;
            updateChatBubbles(color);
        } else {
            // 如果不合法，重置为选择器的值
            input.value = picker.value;
        }
    };
}

function loadRulesFolderOptions(selectedIds) {
    const container = document.getElementById('rules-folder-options');
    const triggerText = document.getElementById('selected-rules-text');
    if (!container) return;
    
    container.innerHTML = ''; // 清空现有选项
    const folders = JSON.parse(localStorage.getItem('starWorldbookFolders') || '[]');
    
    if (folders.length === 0) {
        container.innerHTML = '<div class="custom-option" style="pointer-events: none; color: var(--secondary-text-color);">暂无文件夹</div>';
    } else {
        folders.forEach(f => {
            const div = document.createElement('div');
            div.className = 'custom-option';
            if (selectedIds.includes(f.id)) {
                div.classList.add('selected');
            }
            div.dataset.value = f.id;
            div.textContent = f.name;
            
            // 绑定点击事件 (多选逻辑)
            div.addEventListener('click', (e) => {
                e.stopPropagation();
                div.classList.toggle('selected');
                updateSelectedRulesText();
            });
            
            container.appendChild(div);
        });
    }

    // 初始化显示文本
    updateSelectedRulesText();
    
    // 重新绑定下拉框触发器逻辑 (如果之前被覆盖)
    const select = document.getElementById('rules-folder-select');
    const trigger = select.querySelector('.custom-select-trigger');
    
    // 移除旧监听器
    const newTrigger = trigger.cloneNode(true);
    trigger.parentNode.replaceChild(newTrigger, trigger);
    
    newTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = select.classList.contains('open');
        // 关闭其他
        document.querySelectorAll('.custom-select.open').forEach(s => s.classList.remove('open'));
        if (!isOpen) select.classList.add('open');
    });
}

function updateSelectedRulesText() {
    const container = document.getElementById('rules-folder-options');
    const triggerText = document.getElementById('selected-rules-text');
    const selectedOptions = container.querySelectorAll('.custom-option.selected');
    
    if (selectedOptions.length === 0) {
        triggerText.textContent = '请选择规则句文件夹';
    } else {
        const names = Array.from(selectedOptions).map(opt => opt.textContent);
        triggerText.textContent = names.join(', ');
    }
}

function updateSettingsImagePreview(char) {
    const fullImageContainer = document.getElementById('settings-full-image');
    const avatarContainer = document.getElementById('settings-avatar-preview');
    
    const fullImg = fullImageContainer.querySelector('img');
    const fullPlaceholder = fullImageContainer.querySelector('.image-placeholder');
    
    const avatarImg = avatarContainer.querySelector('img');
    const avatarPlaceholder = avatarContainer.querySelector('.avatar-placeholder');

    // 设置背景色
    const bgColor = char.color || '#333';
    fullImageContainer.style.backgroundColor = bgColor;
    avatarContainer.style.backgroundColor = bgColor;

    // 1. 处理壁纸 (full image)
    // 优先使用 background_image，其次尝试 avatar (如果没有专属壁纸)，最后显示占位
    if (char.background_image) {
        fullImg.src = char.background_image;
        fullImg.style.display = 'block';
        fullPlaceholder.style.display = 'none';
    } else {
        fullImg.style.display = 'none';
        fullPlaceholder.style.display = 'flex';
    }

    // 2. 处理头像
    if (char.avatar) {
        avatarImg.src = char.avatar;
        avatarImg.style.display = 'block';
        avatarPlaceholder.style.display = 'none';
    } else {
        avatarImg.style.display = 'none';
        avatarPlaceholder.style.display = 'flex';
        avatarPlaceholder.textContent = (char.name || ' ')[0];
    }
}

function saveChatSettings() {
    if (!currentChatCharacter) return;

    const nameInput = document.getElementById('settings-name-input');
    const descInput = document.getElementById('settings-desc-input');
    
    const userNameInput = document.getElementById('settings-user-name-input');
    const userPersonaInput = document.getElementById('settings-user-persona-input');
    const greetingInput = document.getElementById('settings-greeting-input');
    
    const newName = nameInput.value.trim();
    const newDesc = descInput.value.trim();
    
    const newUserName = userNameInput.value.trim();
    const newUserPersona = userPersonaInput.value.trim();
    const newGreeting = greetingInput.value.trim();
    
    if (!newName) {
        showToast('名字不能为空');
        return;
    }

    const oldName = currentChatCharacter.name;

    // 更新当前对象
    currentChatCharacter.name = newName;
    currentChatCharacter.background = newDesc;
    
    currentChatCharacter.user_name = newUserName;
    currentChatCharacter.user_persona = newUserPersona;
    currentChatCharacter.greeting = newGreeting;

    // --- 保存高级设置 ---
    
    // 1. 关联规则句
    const ruleOptions = document.querySelectorAll('#rules-folder-options .custom-option.selected');
    currentChatCharacter.rules_folders = Array.from(ruleOptions).map(opt => opt.dataset.value);

    // 2. 后台活动
    const bgToggle = document.getElementById('background-activity-toggle');
    const cooldownInput = document.getElementById('cooldown-input');
    if (bgToggle) {
        currentChatCharacter.enable_background_activity = bgToggle.checked;
        if (bgToggle.checked && cooldownInput) {
            currentChatCharacter.background_cooldown = cooldownInput.value;
        } else {
            delete currentChatCharacter.background_cooldown;
        }
    }

    // 3. 聊天模式
    const chatModeToggle = document.getElementById('chat-mode-toggle');
    if (chatModeToggle) {
        currentChatCharacter.enable_chat_mode = chatModeToggle.checked;
    }

    // 4. 上下文条数
    const contextInput = document.getElementById('context-count-input');
    if (contextInput) {
        currentChatCharacter.context_count = contextInput.value;
    }

    // 5. 气泡颜色
    const leftColorInput = document.getElementById('left-bubble-color-input');
    const rightColorInput = document.getElementById('right-bubble-color-input');
    
    if (leftColorInput) {
        currentChatCharacter.bubble_color_left = leftColorInput.value;
    }
    if (rightColorInput) {
        currentChatCharacter.bubble_color_right = rightColorInput.value;
    }

    // 更新聊天页面标题
    const chatTitle = document.getElementById('chat-title');
    if (chatTitle) chatTitle.textContent = newName;

    // 更新本地存储
    updateCharacterInStorage(oldName, currentChatCharacter);

    // --- 实时更新聊天界面 (开场白) ---
    const chatContent = document.getElementById('chat-content');
    if (chatContent) {
        const existingGreetingRow = chatContent.querySelector('.chat-message-row.is-greeting');
        const leftColor = currentChatCharacter.bubble_color_left || '#ffecd1';
        
        if (newGreeting) {
            // 处理文本格式
            let contentHtml = newGreeting.replace(/\((.*?)\)/g, '<span class="message-action">($1)</span>');
            contentHtml = contentHtml.replace(/\n/g, '<br>');

            if (existingGreetingRow) {
                // 更新现有
                const bubble = existingGreetingRow.querySelector('.message-bubble');
                if (bubble) {
                    bubble.innerHTML = contentHtml;
                    bubble.style.backgroundColor = leftColor;
                }
            } else {
                // 新增
                const row = document.createElement('div');
                row.className = 'chat-message-row left is-greeting';
                row.innerHTML = `
                    <div class="message-bubble left" style="background-color: ${leftColor}">
                        ${contentHtml}
                    </div>
                `;
                chatContent.insertBefore(row, chatContent.firstChild);
            }
        } else {
            // 如果清空了开场白，移除现有 DOM
            if (existingGreetingRow) {
                existingGreetingRow.remove();
            }
        }
    }

    // --- 实时更新对话条数 ---
    const currentChatCount = document.getElementById('current-chat-count');
    if (currentChatCount && chatContent) {
        currentChatCount.textContent = chatContent.querySelectorAll('.chat-message-row').length;
    }

    // 不自动关闭设置页面
    // document.getElementById('chat-settings-page').classList.remove('active');
    showToast('修改已保存');
}

function updateCharacterInStorage(oldName, updatedChar) {
    // 1. 检查推荐列表
    let saved = JSON.parse(localStorage.getItem('starSavedCharacters') || '[]');
    let found = false;
    saved = saved.map(char => {
        if (char.name === oldName) {
            found = true;
            return { ...char, ...updatedChar };
        }
        return char;
    });
    if (found) {
        localStorage.setItem('starSavedCharacters', JSON.stringify(saved));
        // 如果当前在推荐页，刷新列表
        const activeTag = document.querySelector('#tags-bar .tag-item.active');
        if (activeTag && activeTag.dataset.tag === 'recommend') {
            loadSavedCharacters('recommend');
        }
    }

    // 2. 检查标签列表
    const allTagChars = JSON.parse(localStorage.getItem('starTagCharacters') || '{}');
    let tagUpdated = false;
    for (const tag in allTagChars) {
        let chars = allTagChars[tag];
        let charUpdated = false;
        chars = chars.map(char => {
            if (char.name === oldName) {
                charUpdated = true;
                tagUpdated = true;
                return { ...char, ...updatedChar };
            }
            return char;
        });
        if (charUpdated) {
            allTagChars[tag] = chars;
        }
    }
    if (tagUpdated) {
        localStorage.setItem('starTagCharacters', JSON.stringify(allTagChars));
        // 如果当前在某个标签页，刷新列表
        const activeTag = document.querySelector('#tags-bar .tag-item.active');
        if (activeTag && activeTag.dataset.tag !== 'recommend') {
            const tagName = activeTag.querySelector('span').textContent;
            loadSavedCharacters(tagName);
        }
    }
}

// --- API 对话逻辑 (新增) ---

async function triggerAiReply() {
    const waBtn = document.querySelector('.wa-btn');
    if (waBtn.disabled) return;

    // 获取配置
    const settings = JSON.parse(localStorage.getItem('starSettings') || '{}');
    if (!settings.apiUrl || !settings.apiKey) {
        showToast('请先配置 API');
        return;
    }

    // UI Loading
    const originalContent = waBtn.innerHTML;
    waBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    waBtn.disabled = true;

    try {
        await chatWithAi(settings);
    } catch (error) {
        console.error(error);
        showToast('回复失败: ' + error.message);
    } finally {
        waBtn.innerHTML = originalContent;
        waBtn.disabled = false;
    }
}

async function chatWithAi(settings) {
    if (!currentChatCharacter) throw new Error("未选择角色");

    // 1. 构建 System Prompt
    const systemPrompt = buildSystemPrompt(currentChatCharacter);

    // 2. 获取上下文条数配置
    // 如果未设置或为 0，默认取 10 条？或者全部？用户说“依照设置中的读取上下文条数”
    let contextLimit = parseInt(currentChatCharacter.context_count);
    if (isNaN(contextLimit)) contextLimit = 10; // 默认值

    // 3. 构建历史消息
    const history = getChatHistoryContext(contextLimit);

    // 4. 组合消息
    const messages = [
        { role: "system", content: systemPrompt },
        ...history
    ];

    console.log("Sending to API:", messages);

    // 5. 发送请求
    let apiUrl = settings.apiUrl.replace(/\/$/, '');
    if (!apiUrl.includes('/chat/completions')) {
        if (apiUrl.endsWith('/v1')) {
            apiUrl += '/chat/completions';
        } else {
            apiUrl += '/v1/chat/completions';
        }
    }

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${settings.apiKey}`
        },
        body: JSON.stringify({
            model: settings.model || 'gpt-3.5-turbo',
            messages: messages,
            temperature: parseFloat(settings.temperature) || 0.7
        })
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || data.content || '';

    if (!content) throw new Error("Empty response");

    // 6. 上屏
    appendAssistantMessage(content);
}

function buildSystemPrompt(char) {
    let prompt = `你扮演的角色是：${char.name}。\n`;
    if (char.background) {
        prompt += `角色设定：${char.background}\n`;
    }
    
    if (char.user_name) {
        prompt += `正在与你对话的用户是：${char.user_name}。\n`;
    }
    
    if (char.user_persona) {
        prompt += `用户设定：${char.user_persona}\n`;
    }

    // --- 规则句处理 ---
    if (char.rules_folders && Array.isArray(char.rules_folders) && char.rules_folders.length > 0) {
        const allItems = JSON.parse(localStorage.getItem('starWorldbookItems') || '[]');
        // 筛选出属于关联文件夹的条目
        const relevantItems = allItems.filter(item => char.rules_folders.includes(item.folderId));
        
        if (relevantItems.length > 0) {
            prompt += `\n【规则书/世界观/补充设定】：\n`;
            relevantItems.forEach(item => {
                // 简单的格式化，可以根据需要调整
                prompt += `### ${item.title}\n${item.content}\n\n`;
            });
        }
    }

    prompt += `请沉浸在角色中进行对话。`;
    return prompt;
}

function getChatHistoryContext(limit) {
    const chatContent = document.getElementById('chat-content');
    if (!chatContent) return [];

    // 获取所有消息行
    const rows = Array.from(chatContent.querySelectorAll('.chat-message-row'));
    
    // 截取最近的 N 条
    // 注意：limit 如果是 0，应该代表“不限制”还是“0条”？通常用户设置为 0 可能意味着“无限”或者“只看当前”。
    // 根据常理，如果用户设置了上下文条数，就是希望带上历史。如果没设(undefined/null)，给个默认值。
    // 如果用户显式设为 0，那可能就是不想带历史（只靠 system prompt 和当前输入，但当前输入已经上屏变成历史了...）
    // 假设 0 或负数 = 全部历史（或者我们可以定一个最大上限如 50 以防 token 溢出）
    
    let targetRows = rows;
    if (limit > 0) {
        targetRows = rows.slice(-limit);
    }

    const messages = [];

    targetRows.forEach(row => {
        const bubble = row.querySelector('.message-bubble');
        if (!bubble) return;

        // 简单判断角色：right -> user, left -> assistant
        const role = row.classList.contains('right') ? 'user' : 'assistant';
        
        // 提取文本，移除可能的 HTML 标签（如 <span class="action">）
        // 这里简单使用 innerText，但要注意是否保留换行
        let text = bubble.innerText.trim();
        
        // 如果是 assistant，移除开头的 "(微笑) " 这种硬编码的前缀（如果是模拟数据的话）
        // 真实 API 返回的内容不需要移除，但之前的 getMockChatHistory 里的数据可能包含动作
        // 我们的渲染逻辑是将 (动作) 变成了 span，innerText 会保留它们，这是对的。

        if (text) {
            messages.push({ role, content: text });
        }
    });

    return messages;
}

function appendAssistantMessage(text) {
    // AI 回复时，先清除旧的工具栏 (理论上可能存在)
    removeAllToolbars();

    const content = document.getElementById('chat-content');
    const row = document.createElement('div');
    row.className = 'chat-message-row left';
    
    const leftColor = currentChatCharacter?.bubble_color_left || '#ffecd1';

    // 处理动作描述
    let contentHtml = text.replace(/\((.*?)\)/g, '<span class="message-action">($1)</span>');
    // 处理换行
    contentHtml = contentHtml.replace(/\n/g, '<br>');

    row.innerHTML = `
        <div class="message-bubble left" style="background-color: ${leftColor}">
            ${contentHtml}
        </div>
    `;
    
    content.appendChild(row);
    
    // 为最新的 AI 回复添加工具栏
    const bubble = row.querySelector('.message-bubble');
    addLatestMessageToolbar(bubble);

    content.scrollTop = content.scrollHeight;
}
