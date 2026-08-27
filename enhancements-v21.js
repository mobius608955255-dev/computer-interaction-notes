(() => {
  'use strict';

  const $ = (s, r=document) => r.querySelector(s);

  function patchUnverifiedRecentClaim() {
    const section = $('#excel-5');
    if (!section) return;
    section.querySelectorAll('.exam-head p').forEach(p => {
      if (p.textContent.includes('2025、2026 连续考')) {
        p.textContent = p.textContent.replace('2025、2026 连续考。', '近年真题反复出现。');
      }
    });
  }

  function moduleHTML(id, index, title, lead, what, use, rules, boundary='') {
    return `
      <section id="${id}" class="course-module v21-added-module" data-v21-module="1">
        <div class="module-shell">
          <header class="module-head">
            <span>${String(index).padStart(2,'0')}</span>
            <div><small>补全核心概念</small><h2>${title}</h2><p>${lead}</p></div>
          </header>
          <div class="v10-concept-note v21-concept-note">
            <div><span>是什么</span><p>${what}</p></div>
            <div><span>有什么用</span><p>${use}</p></div>
          </div>
          <div class="module-grid">
            <div class="knowledge-card">
              <h3>核心规则与操作结果</h3>
              <ul>${rules.map(x=>`<li>${x}</li>`).join('')}</ul>
            </div>
            ${boundary ? `<div class="knowledge-card"><h3>边界要分清</h3><p>${boundary}</p></div>` : ''}
          </div>
          <div class="memory-line"><span>一条线记住</span><strong>${lead}</strong></div>
        </div>
      </section>`;
  }

  function addWindowsCoverage() {
    const page = $('.windows-page');
    const footer = $('.windows-page .course-footer');
    if (!page || !footer || $('#windows-17')) return;

    const html = [
      moduleHTML(
        'windows-17', 17, '用户账户与 UAC',
        '账户类型看权限，登录身份看来源；UAC 是提权确认，不是杀毒软件。',
        'Windows 用户账户用于区分不同使用者的身份、配置和权限。常见权限级别包括标准用户和管理员；登录身份又可以是本地账户或 Microsoft 账户。UAC（用户账户控制）是在程序尝试进行需要更高权限的系统更改时给出确认或凭据提示的安全机制。',
        '理解账户与权限，才能判断谁能安装软件、修改系统级设置，以及为什么管理员账户执行某些操作时仍可能弹出确认。',
        [
          '标准用户适合日常使用，不能把“标准用户”理解成“完全不能安装或运行任何程序”。',
          '管理员拥有更高系统控制权限，但管理员身份不等于所有高权限操作都无提示；UAC 仍可能要求确认。',
          '本地账户 / Microsoft 账户描述登录身份来源；标准用户 / 管理员描述权限级别，两组分类维度不同。',
          'UAC 主要减少未经授权的系统级更改，不是病毒扫描器，也不能判断所有程序是否恶意。'
        ],
        '“Microsoft 账户 = 管理员”“本地账户 = 标准用户”都不成立；同一种登录身份可以被赋予不同权限级别。'
      ),
      moduleHTML(
        'windows-18', 18, '时钟、区域与输入法',
        '时间、时区、区域格式、语言和输入法彼此相关，但不是同一个设置。',
        '“日期和时间”负责系统时钟和时区；“区域”影响日期、时间、数字、货币等本地化显示格式；语言和输入法决定界面语言或文字输入方式。',
        '这些设置会影响文件时间显示、应用中的日期数字格式以及中英文输入，但改变显示格式不等于改掉文件本身的数据内容。',
        [
          '系统时间与时区要分开：同一 UTC 时刻在不同时区显示的本地时间不同。',
          '区域格式可以影响短日期、长日期、时间、数字和货币的显示习惯。',
          '输入法负责文字输入方式；切换输入法不会把已经保存的中文文档自动转换成另一种编码。',
          '全角/半角、中英文输入状态属于输入行为，不等同于修改 Windows 的系统语言。'
        ]
      ),
      moduleHTML(
        'windows-19', 19, '系统、安全与更新',
        '系统信息、杀毒、防火墙、更新、备份和还原各管一层，不能互相替代。',
        'Windows 的“系统和安全”相关功能包括查看系统信息、Windows 安全中心/病毒防护、防火墙、Windows Update、备份与恢复、系统保护等。它们分别解决硬件与系统信息、恶意软件、网络访问、补丁更新和数据/系统恢复问题。',
        '把这些功能分层后，遇到题目就能根据问题对象选工具，而不是看到“安全”二字就都选防火墙。',
        [
          '防火墙主要按规则控制网络通信，不等同于杀毒软件。',
          'Windows Update 用于获取系统安全、质量、功能及部分驱动更新；更新与病毒扫描是两件事。',
          '文件备份用于保护个人数据；系统还原主要回退系统文件、注册表、驱动和设置，不等同于个人文件备份。',
          '系统信息可查看 Windows 版本、处理器、内存和系统类型等；32 位 / 64 位与可用内存和软件兼容性有关。'
        ],
        '“系统还原”“备份”“重置此电脑”不是同义词：前者回退系统状态，备份保存数据副本，重置则重新安装 Windows 并按选项保留或移除内容。'
      ),
      moduleHTML(
        'windows-20', 20, '网络与远程连接',
        '先分网络状态、适配器、地址配置和远程连接，再判断对应工具。',
        'Windows 的网络设置用于查看连接状态、管理网络适配器和共享等；远程桌面则允许从另一台设备连接到支持远程桌面主机功能的 Windows PC 并操作其桌面。',
        '这部分用于判断网络故障应查哪里、网络配置和远程控制有什么区别，以及“远程桌面连接”客户端与“允许本机被远程连接”不是同一件事。',
        [
          '网络和共享相关入口可用于查看网络状态、适配器、共享和连接设置。',
          'IP 地址、子网掩码、默认网关、DNS 等属于网络参数，不应与计算机名或工作组名称混为一谈。',
          '公用网络与专用网络采用不同的共享和防火墙策略；公用网络通常采用更严格的发现/共享策略。',
          'Windows 10 可以运行“远程桌面连接”客户端；要让一台 PC 作为被连接的远程桌面主机，还取决于 Windows 版本和是否启用远程桌面等条件。'
        ],
        'Windows 10 Home 可以作为远程桌面客户端去连接其他主机，但不能机械写成“所有 Windows 10 版本都能作为 Remote Desktop 主机”。'
      ),
      moduleHTML(
        'windows-21', 21, '磁盘管理与系统维护',
        '分区/卷决定怎么组织空间；清理、检查、优化解决的是三类不同问题。',
        '磁盘管理关注物理磁盘、分区、卷、盘符和格式化；系统维护还包括磁盘清理/存储感知、错误检查以及“优化驱动器”等工具。',
        '只有先区分“空间组织、释放空间、检查错误、优化访问”四个目标，才能选对工具并判断操作后到底改变了什么。',
        [
          '物理磁盘是 HDD/SSD 等设备；分区是地址空间划分；卷是可格式化并挂载使用的存储区域；盘符只是 Windows 的访问标识，不等于一块独立物理硬盘。',
          '格式化会在卷上建立文件系统，存在数据丢失风险；快速格式化与完整格式化不能理解成“一个删数据、一个完全不删数据”。',
          '磁盘清理/存储感知用于释放空间，例如清理临时文件等；它不会自动把所有不用的软件卸载掉。',
          '错误检查 / chkdsk 面向文件系统和磁盘错误检查，不等同于垃圾清理。',
          '优化驱动器会按介质类型采用合适方式：机械硬盘可进行碎片整理；SSD 的优化通常涉及 TRIM 等处理，不应把 SSD 当作机械硬盘频繁执行传统碎片整理。'
        ],
        '“磁盘清理增加磁盘总容量”是错误的，它只是释放已占用空间；“碎片整理 = 删除垃圾文件”也错误，二者目标不同。'
      )
    ].join('');

    footer.insertAdjacentHTML('beforebegin', html);
    document.dispatchEvent(new CustomEvent('notes:chapterchange', {detail:{chapter:2, source:'v21-coverage'}}));
  }

  function apply() {
    patchUnverifiedRecentClaim();
    addWindowsCoverage();
  }

  let queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      apply();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, {once:true});
  else schedule();
  document.addEventListener('notes:chapterchange', schedule);
  new MutationObserver(schedule).observe(document.documentElement, {childList:true, subtree:true});
})();
