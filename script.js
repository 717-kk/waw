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
});

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
