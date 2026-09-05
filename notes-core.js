/* Refined chapter 1, 2 and 5 notes; sources remain attached to merged concepts. */
(() => {
  const data = {
  "patches": {
    "y2026q3": {
      "conclusion": "普通RAM是可读写的运行内存，断电后内容丢失；ROM常用于保存固件，具有非易失性。读写特性、断电特性和主存外存是不同分类维度。",
      "points": [
        "RAM暂存正在运行的程序和数据；程序或文件保存在磁盘上，不代表其全部内容一直位于RAM中。",
        "DRAM需要定期刷新，常用作主存；SRAM不需要这种刷新，常用作Cache。两者在普通实现中都需要持续供电保存内容。",
        "Cache是高速缓冲存储器，用于减少CPU访问较慢主存的等待；它不是硬盘，也不是另一种永久文件保存位置。",
        "ROM常保存固件或启动代码；EEPROM等类型可按规定方式擦写，不能把所有ROM都理解成出厂后永远无法改变。",
        "SSD、U盘使用的Flash具有非易失性，但这些设备通常归为外存；HDD同样能断电保存数据，因此非易失存储器不等于ROM。"
      ],
      "boundary": "RAM中的“随机访问”不等于“随机存入”，也不应据名称推导所有RAM技术都易失；基础题未作特殊说明时，通常讨论普通易失性RAM。断电能否保留、能否改写、属于主存还是外存，要分别判断。",
      "comparison": {
        "headers": [
          "名称",
          "分类关系与典型用途",
          "普通实现的断电特性",
          "刷新或改写"
        ],
        "rows": [
          [
            "RAM",
            "随机存取存储器；基础题通常指运行内存",
            "普通RAM易失",
            "可读写；是否刷新取决于类型"
          ],
          [
            "SRAM",
            "RAM的一类；常用于Cache",
            "易失",
            "无需DRAM式定期刷新"
          ],
          [
            "DRAM",
            "RAM的一类；常用于主存",
            "易失",
            "需要定期刷新"
          ],
          [
            "ROM",
            "只读存储器家族；常保存固件",
            "非易失",
            "能否改写及方式取决于具体类型"
          ],
          [
            "Flash",
            "闪存；常用于SSD、U盘及固件存储",
            "非易失",
            "可按规定方式电擦除、编程"
          ]
        ]
      }
    },
    "merged-1": {
      "conclusion": "经典冯·诺依曼计算机由运算器、控制器、存储器、输入设备和输出设备组成；程序指令与数据均用二进制表示，并存放在同一存储体系中。",
      "points": [
        "基础组成题通常把运算器和控制器合称CPU；实际CPU还包含寄存器等部件。",
        "运算器执行算术和逻辑运算；控制器取出指令、解释操作要求、发出控制信号并协调各部件。",
        "“存储程序”强调先把程序指令存入存储器；“程序控制”强调机器按指令要求自动完成操作。",
        "程序指令和数据都表现为二进制位串，不能仅看某个位串的外形判断它一定是指令或一定是数据，要结合访问与解释方式。",
        "普通通用计算机通常把需要执行的代码从外存装入内存，由CPU反复取指、译码和执行；转移指令可以改变后续执行位置。"
      ],
      "boundary": "五大部件是功能划分，不是五块独立芯片；存储程序不表示只能从第一条到最后一条直线执行，也不表示程序保存在硬盘上就已经运行。"
    },
    "y2025q2": {
      "conclusion": "字符编码解决“这是哪个字符”，字形数据解决“这个字符怎样显示”；字符占用多少字节必须结合具体编码，不能笼统认定汉字永远占两个字节。",
      "points": [
        "标准ASCII为7位，共128个编码，存入一个8位字节时最高位通常为0；数字、大写字母、小写字母各自连续排列，按码值比较时数字小于大写字母、大写字母小于小写字母。",
        "ASCII中A=41H、a=61H，同一字母的大小写码值相差20H；G=47H，因此J=4AH。H表示十六进制，不参与数值运算。",
        "区位码表示字符在编码表中的区和位，国标码用于信息交换，机内码用于内部表示；教材常见GB2312双字节汉字机内码两个字节最高位均为1，但满足此条件仍不能保证编码合法。",
        "Unicode为字符分配码位，UTF-8和UTF-16规定具体编码形式；UTF-8编码一个Unicode标量值使用1至4字节，UTF-16使用2或4字节。全角Ａ与半角A也是不同字符，不能只看外形判断相同。",
        "字形可用点阵或轮廓描述。单色、每点1位且不计附加信息时，16×16点阵字形占32 B，24×24占72 B；字体或字号改变会影响字形数据，不会因此改变字符身份。"
      ],
      "boundary": "双字节机内码、16×16点阵和16位编码是不同概念。字符编码长度不能用点阵规模求，字形数据量也不能套用“一汉字两字节”。",
      "comparison": {
        "headers": [
          "比较项",
          "字符编码",
          "字形数据"
        ],
        "rows": [
          [
            "回答的问题",
            "表示哪个字符",
            "这个字符怎样显示或打印"
          ],
          [
            "常见表示",
            "ASCII、GB2312及Unicode的具体编码形式",
            "点阵或轮廓"
          ],
          [
            "容量取决于",
            "具体编码形式及字符",
            "点阵规模、每点位数或轮廓描述"
          ],
          [
            "典型计算",
            "标准ASCII通常存入1 B；GB2312汉字通常为2 B",
            "16×16单色点阵：16×16÷8=32 B"
          ],
          [
            "字体改变",
            "同一编码体系中的字符身份不因此改变",
            "外观与字形数据可以改变"
          ]
        ]
      }
    },
    "y2026q41": {
      "conclusion": "任意进制转十进制用按位权展开；十进制整数转其他进制用除基取余、逆序排列，小数部分用乘基取整、顺序排列。",
      "points": [
        "r进制的个位权为r⁰，向左依次为r¹、r²，向右依次为r⁻¹、r⁻²；例如10001₂=16+1=17₁₀。",
        "十进制整数不断除以目标基数，直到商为0，再把余数倒序写出；60÷16商3余12，12对应C，所以60₁₀=3C₁₆。",
        "小数部分不断乘以目标基数，每次取整数部分，余下小数继续乘；0.625依次乘2取得1、0、1，所以0.625₁₀=0.101₂。",
        "二进制转八进制每3位一组，转十六进制每4位一组；以小数点为界，整数左端、小数右端补0。100010.01₂=0010 0010.0100₂=22.4₁₆，11.11₂=3.C₁₆。",
        "有限十进制小数未必能用有限二进制精确表示；约分后分母为2的幂时才能有限表示，如0.5可以，0.1不可以。一般地，分母的质因数须全部包含在目标基数的质因数中。"
      ],
      "boundary": "整数除基所得余数要逆序，小数乘基所得整数要顺序；不能跨小数点分组。3CH与0x3C都是十六进制记法，保留有限位数时还应按题设截断或舍入。"
    },
    "merged-3": {
      "conclusion": "bit表示一个二进制位，Byte表示字节，1 B=8 bit；容量计算先统一位与字节，再按题设选择1000或1024进位。",
      "points": [
        "SI前缀按1000进位：1 kB=1000 B，1 MB=10⁶ B，1 GB=10⁹ B，1 TB=10¹² B。",
        "IEC前缀按1024进位：1 KiB=2¹⁰ B，1 MiB=2²⁰ B，1 GiB=2³⁰ B，1 TiB=2⁴⁰ B。",
        "旧教材常用KB、MB表示1024进位。题目明确采用此口径时按题设计算，并在步骤中写清换算关系；跨两级需要乘或除两次进率。",
        "像素是位图的基本图像元素。未压缩像素数据量=宽×高×每像素位数÷8，结果单位为B；24位RGB通常是红、绿、蓝各8位。",
        "例如1024×768像素、每像素24位的图像，纯像素数据为2359296 B=2.25 MiB。bit/s是位速率，B/s是字节速率，同一前缀下数值相差8倍。"
      ],
      "boundary": "图像公式计算的是题设条件下的像素数据，不一定等于图像文件大小；文件头、调色板、行填充及压缩会改变文件大小。像素不能直接作为所有图形文件的存储单位。"
    },
    "y2022q4": {
      "conclusion": "数据总线传送内容，地址总线指定位置，控制总线传送读写等控制信号；地址宽度与数据宽度回答的是不同问题。",
      "points": [
        "数据总线传送指令、操作数和结果等信息；经典系统中读写需要不同传送方向。",
        "地址总线指定要访问的存储单元或I/O位置；经典CPU作为总线主设备时，地址由CPU送出。",
        "控制总线包含读、写、中断等信号；整组信号有不同方向，不表示每根控制线都能双向传送。",
        "n位地址最多区分2ⁿ个地址。若按字节寻址，容量为2ⁿ B；例如20位地址可区分2²⁰个字节地址，即1 MiB。",
        "m位并行数据总线一次可传送m位数据；地址线数不能代替数据线数。总线还可按传输方式分为串行与并行，这与按内容分类是不同维度。"
      ],
      "boundary": "算可寻址容量必须先看一个地址对应多少存储量；2ⁿ首先是地址数，只有按字节寻址才能直接写成2ⁿ B。总线更宽也不能单独证明整机一定更快。"
    },
    "y2025q1": {
      "conclusion": "字长描述典型处理位宽，主频描述每秒时钟周期数，核心数量描述并行执行资源；三者都不能单独代表整机实际速度。",
      "points": [
        "字长是处理器一次处理数据的典型二进制位数；基础题中的64位计算机通常指机器字长为64位，不是64字节。",
        "1 GHz=10⁹ Hz，表示每秒10⁹个时钟周期；3.2 GHz表示每秒32亿个周期，不表示每秒必然执行32亿条指令。",
        "MIPS表示每秒百万条指令，BIPS表示每秒十亿条指令；它们是指令执行速率单位，与表示容量的MB、GB不同。",
        "多个核心可以同时处理任务，但必须有可并行的程序和合适的调度；四核3 GHz不能相加写成12 GHz。",
        "同样主频下，不同体系结构、缓存和每周期处理能力可能带来不同速度；内存、存储设备和软件负载也会影响实际运行时间。"
      ],
      "boundary": "字长、地址总线宽度和数据总线宽度不能直接视为相同；比较不同处理器时，不能只凭主频或MIPS大小作结论。",
      "comparison": {
        "headers": [
          "指标",
          "含义",
          "常见误读"
        ],
        "rows": [
          [
            "字长",
            "典型一次处理的二进制位数",
            "64位不是64字节，也不等于地址线必有64根"
          ],
          [
            "主频",
            "每秒时钟周期数；单位Hz、GHz",
            "时钟周期数不是指令条数"
          ],
          [
            "核心数量",
            "可并行工作的处理核心数量",
            "四核3 GHz不能相加为12 GHz"
          ],
          [
            "MIPS、BIPS",
            "每秒百万条、十亿条指令",
            "不是MB、GB等存储容量单位"
          ],
          [
            "实际任务耗时",
            "指定程序与环境下完成任务的时间",
            "不能只由某一个硬件数字确定"
          ]
        ]
      }
    },
    "y2024q41": {
      "conclusion": "机器指令是CPU可直接识别执行的操作命令，基础模型通常概括为操作码与地址码等部分；具体字段和含义由指令系统规定。",
      "points": [
        "操作码说明执行什么操作，如加法、传送或转移；地址码等字段提供操作数及结果位置等相关信息。",
        "操作数可能来自寄存器、存储器，也可能是指令中直接给出的立即数，因此不能把每个操作数字段都理解成主存地址。",
        "一条指令规定一次机器操作；程序是为完成任务组织起来的指令序列，可能包含顺序、分支和循环。",
        "一台处理器能够识别的全部机器指令构成其指令系统；不同处理器架构的机器代码不保证能够直接互用。",
        "机器指令可以直接执行；汇编源程序需汇编，高级语言源程序通常需编译、解释或其他语言处理过程。"
      ],
      "boundary": "不要把“源程序需要翻译”扩大为“任何指令都要先编译”；也不要认为每条指令必须显式给出主存地址或下一条指令地址。"
    },
    "y2020q2": {
      "conclusion": "活动窗口是当前操作的顶层窗口，键盘输入送到它或其内部获得焦点的控件；置顶规定覆盖顺序，最小化、最大化和还原规定显示状态。",
      "points": [
        "单击可操作窗口通常将其激活；普通窗口被激活后通常移到其他普通窗口前方。",
        "非活动的置顶窗口仍可能覆盖活动窗口，因此不能只看谁在前面判断键盘输入的去向。",
        "最小化隐藏窗口的主要内容，程序通常仍在运行；最小化不等于结束进程。",
        "支持最大化的窗口通常可双击标题栏，在最大化与还原之间切换。",
        "启用贴靠时，拖到顶部通常最大化，拖到左右边缘可触发贴靠；拖到底部不是标准最小化手势。"
      ],
      "boundary": "可见、活动、置顶和运行是不同状态；标题栏和贴靠操作还取决于窗口能力、Windows版本及设置。",
      "comparison": {
        "headers": [
          "状态",
          "主要含义",
          "不能直接推出"
        ],
        "rows": [
          [
            "活动",
            "当前操作的顶层窗口，其内部焦点控件可接收输入",
            "一定覆盖所有置顶窗口"
          ],
          [
            "置顶",
            "覆盖其他非置顶窗口",
            "一定接收键盘输入"
          ],
          [
            "最小化",
            "窗口主要内容暂时不在桌面展开",
            "程序已经退出"
          ],
          [
            "最大化／还原",
            "扩大窗口／回到此前大小和位置",
            "增加／减少正在运行的程序数"
          ]
        ]
      }
    },
    "y2020q24": {
      "conclusion": "资源管理器中，普通文件在同一卷的不同文件夹间左键拖动通常移动，跨卷通常复制；Ctrl、Shift及右键拖放菜单可明确请求动作。",
      "points": [
        "这里的“同盘／跨盘”主要按逻辑卷区分；一块物理硬盘上的C盘与D盘也属于跨卷。",
        "Ctrl拖动通常复制，Shift拖动通常移动，Ctrl＋Shift拖动通常创建快捷方式；右键拖动可在松手后从菜单选择。",
        "复制在目标建立副本并保留源文件；移动成功后文件离开原文件夹；快捷方式只建立指向目标的入口。",
        "资源管理器剪切文件通常先标记待移动，粘贴成功后才完成移动；图标变淡不表示文件已经删除。",
        "多文件可批量重命名，系统通常追加序号以区分名称；扩展名与实际格式仍须分别判断。",
        "文件能否移动或删除还受访问权限、占用方式和是否允许共享删除等影响，并非所有打开的文件都绝对不能删除。"
      ],
      "boundary": "默认拖放规则以可访问、可写的普通文件夹为前提；应用、压缩包和特殊系统对象可定义其他行为，应核对松手前的动作提示。",
      "comparison": {
        "headers": [
          "拖放条件",
          "通常动作",
          "源文件"
        ],
        "rows": [
          [
            "同卷普通拖动",
            "移动",
            "成功后离开原文件夹"
          ],
          [
            "跨卷普通拖动",
            "复制",
            "保留"
          ],
          [
            "Ctrl＋拖动",
            "复制",
            "保留"
          ],
          [
            "Shift＋拖动",
            "移动",
            "成功后离开原文件夹"
          ],
          [
            "Ctrl＋Shift＋拖动",
            "创建快捷方式",
            "保留"
          ],
          [
            "右键拖动后松手",
            "从菜单选择动作",
            "随所选动作变化"
          ]
        ]
      }
    },
    "y2025q33": {
      "conclusion": "文本、图片等内容粘贴后通常仍可继续粘贴，正常睡眠与唤醒也不必然清空剪贴板；资源管理器的文件剪切移动及剪贴板历史须分别判断。",
      "points": [
        "复制或剪切通常更新当前剪贴板内容；Ctrl＋V粘贴当前内容，普通粘贴本身通常不会将文本或图片内容用完。",
        "文本剪切通常立即移除选中文字；资源管理器剪切文件通常只标记待移动，粘贴成功后才完成位置变化。",
        "复制文件时，剪贴板可记录文件位置与传输信息，不能把它当成整个文件已经完整备份到内存。",
        "开启Windows剪贴板历史后，可用Win＋V选择较早项目；Windows历史与Office剪贴板是不同功能。",
        "正常睡眠通常保留当前会话，但不能与关机或重启混为一谈；重启会清除未固定的Windows历史项目，固定项目可保留。",
        "传统Windows截图按键中，Print Screen复制全屏，Alt＋Print Screen复制活动窗口，结果进入剪贴板；重新配置按键行为时按实际设置执行。"
      ],
      "boundary": "文件剪切移动完成后，不能据“文本可重复粘贴”推断必能再次粘贴出文件副本；Windows历史有格式、大小和数量限制，不能保存任意文件。策略、程序行为和手动清除也可能影响内容。",
      "comparison": {
        "headers": [
          "场景",
          "剪切或复制后",
          "粘贴或重启后"
        ],
        "rows": [
          [
            "文本剪切",
            "所选文字通常立即离开源位置",
            "粘贴后通常仍可继续粘贴"
          ],
          [
            "文件剪切",
            "源文件通常仍在，只被标记待移动",
            "粘贴成功后才完成移动，不按重复复制理解"
          ],
          [
            "文件复制",
            "源文件保留，剪贴板提供文件传输信息",
            "目标建立副本，仍依赖源文件可访问"
          ],
          [
            "Windows剪贴板历史",
            "开启后可保留支持的较早项目",
            "重启清除未固定项目，固定项目可保留"
          ]
        ]
      }
    },
    "y2020q3": {
      "conclusion": "本地可回收位置的普通Delete通常将文件移入回收站；Shift＋Delete、网络位置、部分移动介质及容量或策略设置可能使文件绕过回收站。",
      "points": [
        "回收站不是所有存储位置的统一保险箱，是否可回收要结合位置、删除方式和实际提示判断。",
        "移入回收站的文件仍占用本机存储空间；清空回收站或从其中永久删除后，才释放相应文件占用的空间。",
        "从回收站还原通常回到原文件夹；应核对原路径，避免只凭文件名判断恢复位置。",
        "删除快捷方式与删除其目标文件是不同操作，应先确认选中的是哪个对象。",
        "绕过或清空回收站后，不能再用该回收站的还原功能取回文件；其他备份或恢复工具能否恢复取决于具体条件。"
      ],
      "boundary": "“永久删除”不等于已安全擦除全部数据，也不保证还能恢复；题干出现“一定”“所有”时，须检查介质、删除方式、容量和配置。"
    },
    "merged-4": {
      "conclusion": "文件名、扩展名、默认打开程序、只读属性和访问权限分别约束名称、类型识别、打开方式及操作能力；不能把其中一项当成其他各项的替代。",
      "points": [
        "常规Windows文件名不能包含\\ / : * ? \" < > |；连字符和数字可以使用，名称也不应以空格或句点结尾。",
        "CON、PRN、AUX、NUL、COM1至COM9、LPT1至LPT9等是保留设备名，NUL.txt等在保留名后加扩展名的形式也不能作为普通文件名。",
        "扩展名通常参与类型识别和程序关联；显示或隐藏扩展名只改显示，更改默认应用只改打开关联，改扩展名不会转换内部格式。",
        "my.txt与无扩展名的my是不同完整文件名，可在同一文件夹共存；隐藏扩展名可能让它们看起来同名，但不改变实际名称。",
        "只读文件会限制普通写入；直接删除接口也可能因只读而失败，工具可能先处理属性再删除。文件夹只读标记不等于禁止创建子项，创建能力主要取决于目录访问权限。",
        "常见属性还有隐藏、存档等；隐藏不提供保密或访问保护。能否删除还要检查权限及文件打开方式是否允许共享删除。"
      ],
      "boundary": "没有九个禁用字符不等于名称一定合法；基础题可按规范扩展名判断类型，实际格式须结合内容。只读、隐藏都不能替代NTFS等访问权限，也不能提供可靠防误删保证。"
    },
    "y2026q35": {
      "conclusion": "快速访问汇集固定文件夹和常用位置，方便导航；“从快速访问取消固定”只移除固定入口，原文件夹及其内容仍在原处。",
      "points": [
        "可右击文件夹并选择“固定到快速访问”，让其成为方便进入的导航入口。",
        "固定不会移动或复制原文件夹；不再需要该入口时，可执行“从快速访问取消固定”。",
        "常用文件夹和最近文件是否显示，可在文件资源管理器选项中配置。",
        "在文件列表里针对实际文件或文件夹执行“删除”，仍应按普通文件删除规则判断。"
      ],
      "boundary": "不要把“取消固定”“从列表移除”和“删除文件”统称为删除入口；原文件是否保留取决于执行的具体命令。"
    },
    "y2020q11": {
      "conclusion": "普通幻灯片基于所用版式，版式隶属于某组幻灯片母版；统一Logo或固定文字应修改相应母版，作用范围是使用这组母版的页面。",
      "points": [
        "一个母版可关联多个版式，一个演示文稿也可包含多组母版；不能把“本母版下全部页面”理解为文件中的全部页面。",
        "只编辑某个版式影响使用该版式的页面；顶层母版提供其下版式共用的外观，单页或版式上的局部设置可能覆盖继承格式。",
        "母版或版式中的Logo等对象在普通视图不能直接选中修改；要回到“视图→幻灯片母版”并找到实际提供该对象的层级。",
        "修改已有版式的占位符结构后，现有幻灯片可能需要在普通视图重新应用该版式；不能把所有版式变化都理解为立即完整更新。",
        "更换主题可能引入或替换母版；Logo缺失时检查该页实际使用的母版和版式，而不是只检查原先编辑过的母版。",
        "仅让部分页面不显示继承的装饰图形，可启用“隐藏背景图形”；页面仍会放映，本页手动插入的图片不会因此自动隐藏。",
        "PowerPoint区分幻灯片母版、讲义母版和备注母版；普通演示文稿至少有一组幻灯片母版，版式数量并非永远固定。",
        "母版上的普通文本框可以显示固定标识；日期、页脚和编号占位符还需通过“页眉和页脚”启用。"
      ],
      "boundary": "母版管理共用外观，不是逐页正文编辑器；普通视图不能直接改继承的母版对象。固定文本框与自动页脚、日期和编号字段也不能混为一谈。",
      "comparison": {
        "headers": [
          "修改位置",
          "影响范围",
          "典型用途"
        ],
        "rows": [
          [
            "顶层幻灯片母版",
            "使用该母版的页面",
            "共用Logo、字体和背景"
          ],
          [
            "某个版式",
            "使用该版式的页面",
            "标题和内容占位符布局"
          ],
          [
            "普通幻灯片",
            "当前选定页或对象",
            "本页正文、局部格式"
          ]
        ]
      },
      "pointGroups": [
        {
          "title": "先判断影响范围",
          "indices": [
            0,
            1,
            4,
            6
          ]
        },
        {
          "title": "再找到修改位置",
          "indices": [
            2,
            3,
            5,
            7
          ]
        }
      ]
    },
    "y2024q65": {
      "conclusion": "打开“插入→幻灯片编号”，勾选“幻灯片编号”和“标题幻灯片中不显示”，再单击“全部应用”；编号位置与样式由母版或版式控制。",
      "points": [
        "“应用”作用于当前选定幻灯片，“全部应用”作用于整个演示文稿。",
        "编号占位符的位置和样式由版式或母版控制；母版中存在占位符，不等于已经在页面上启用编号。",
        "标题幻灯片的识别与所用版式有关，不能机械地理解为永远只排除文件第1页。",
        "“插入→日期和时间/页眉和页脚”中勾选日期和时间并选择“自动更新”，再“全部应用”，可加入日期字段；手输日期只是固定文字。",
        "自动日期在打开或打印演示文稿时反映当前日期；固定日期保持输入的文字。",
        "页脚文字须在“页眉和页脚”中勾选并填写；母版普通文本框中的固定标识不是同一类页脚字段。"
      ],
      "boundary": "隐藏编号不会删除该幻灯片，也不会改变后续幻灯片的实际编号序列；直接在文本框输入“1”不会成为自动编号。"
    },
    "y2020q53": {
      "conclusion": "先在缩略图窗格选择目标页，再右击主题缩略图并选择“应用于选定幻灯片”，才能明确限定主题的应用范围。",
      "points": [
        "按住Ctrl可选择不相邻幻灯片；应观察缩略图的选中边框，而不是只看中央正在显示哪一页。",
        "直接单击主题通常会影响整套演示文稿；仅选中一页不能代替“应用于选定幻灯片”命令。",
        "主题统一控制颜色、字体和效果，与只更改背景颜色或背景图片不是同一动作。",
        "同一文稿可以使用不同主题，每组主题对应相关母版和版式；添加第二组母版后，已有页面还需使用它的版式才会采用相应设计。",
        "不同主题可满足局部任务要求，但使用过多会降低整套文稿的一致性。"
      ],
      "boundary": "“重设幻灯片”恢复当前版式相关的占位符位置和格式，不负责更换主题，也不会删除已加入的内容。",
      "comparison": {
        "headers": [
          "操作",
          "改变什么"
        ],
        "rows": [
          [
            "应用于选定幻灯片",
            "所选页使用的主题"
          ],
          [
            "只改背景",
            "所选页的背景填充"
          ],
          [
            "重设幻灯片",
            "恢复当前版式的占位符布局和格式"
          ]
        ]
      }
    },
    "y2020q12": {
      "conclusion": "普通视图缩略图窗格和幻灯片浏览视图可选中整页后删除；隐藏则保留源幻灯片，只让常规顺序放映跳过它。",
      "points": [
        "删除整页会从演示文稿中移除该页；隐藏仍保留内容、对象和已有动画供编辑。",
        "Delete作用于当前选择：选缩略图是删除页面，选页内对象是删除对象，文字光标状态下则编辑文字。",
        "隐藏页在缩略图编号处有隐藏标记；取消隐藏会恢复其参与常规顺序放映的资格。",
        "隐藏页面仍可通过特定链接或放映导航访问；隐藏不等于无法打开。",
        "阅读视图和放映视图主要用于观看，不是常规编辑删除入口。",
        "放映黑屏只是临时遮住观众画面，不会把当前幻灯片设置为隐藏。"
      ],
      "boundary": "“正在看到一张幻灯片”不等于已选中整页；所有隐藏或删除操作都应跟随当前真实选择，不能固定作用于示例中的某一页。",
      "comparison": {
        "headers": [
          "操作",
          "改变的状态",
          "源页面"
        ],
        "rows": [
          [
            "隐藏幻灯片",
            "常规放映跳过",
            "保留"
          ],
          [
            "删除缩略图",
            "从文件移除整页",
            "移除"
          ],
          [
            "从自定义放映移除",
            "某方案不再引用该页",
            "保留"
          ],
          [
            "放映黑屏",
            "临时遮蔽观众画面",
            "保留"
          ]
        ]
      }
    },
    "y2026q55": {
      "conclusion": "进入“自定义幻灯片放映”，编辑目标方案并从右侧清单移除目标页；这只改变方案中的引用，原幻灯片仍保留。",
      "points": [
        "自定义放映在当前文件中保存所需页面的引用及播放顺序，不是另存一份演示文稿。",
        "左侧是演示文稿中的源幻灯片，选中后可添加到右侧“自定义放映中的幻灯片”清单。",
        "右侧上移或下移只调整该方案的播放顺序，不改变普通视图中的真实页序。",
        "从右侧清单移除只影响当前方案；源页仍能编辑，也能用于其他方案。",
        "一个文件可建立多个自定义放映方案；编辑完成后选择正确方案并实际放映，核对页序和内容。",
        "通过动作或超链接进入自定义放映时，可根据任务设置“放映并返回”，使辅助放映结束后返回主放映。"
      ],
      "boundary": "从清单移除、删除整个方案和在普通视图删除源幻灯片是不同操作；取消编辑应保留此前已保存的方案。"
    },
    "merged-11": {
      "conclusion": "切换控制整页之间的过渡，动画控制页内对象，动作或超链接可跳到目标页；效果持续时间、动画开始条件和自动换片时间必须分别设置。",
      "points": [
        "切换属于将要进入的页面：修改第2页到第3页的过渡应选第3页；一页同时只有一个切换效果，重新选择效果会替换原切换。",
        "切换“持续时间”控制过渡本身耗时，数值越大通常越慢；“设置自动换片时间”控制何时前进，不能互换。",
        "“单击鼠标时”与自动换片条件可同时启用；允许单击时，可以在自动换片前主动前进。微软说明自动换片计时在本页最后一个动画或其他效果结束后开始。",
        "动画窗格的前后顺序、开始方式、延迟和持续时间共同决定播放过程；位于第2行不代表一定等第1行结束后才运行。",
        "“单击时”等待放映单击；“与上一动画同时”可与前一效果并行；“上一动画之后”等待前一效果结束。延迟从相应开始条件满足时计算。",
        "一个对象可通过“添加动画”保留已有动画并新增效果；直接从动画库重新选效果可能替换原效果。“预览”只用于查看效果，“持续时间”控制效果本身耗时。",
        "普通“单击时”不要理解为必须点击该对象；指定点击某个对象才播放，需要设置相应动画触发器。",
        "动作设置可分别响应鼠标单击和鼠标悬停；动作、超链接和放映导航可以真正跳到目标幻灯片，包括非相邻页面。",
        "对象动画改变对象的进入、强调、退出或运动方式，不负责指定另一页为跳转目标；应在放映中实际触发并核对目标内容。",
        "切换声音可使用受支持的声音文件；同一节内各页仍可采用不同切换效果。“全部应用”会推广到整套演示文稿。"
      ],
      "boundary": "定时值越大不等于切换效果越慢；动画窗格顺序不等于全部效果逐个串行；对象动画也不能代替动作或超链接的目标页跳转。",
      "comparison": {
        "headers": [
          "设置",
          "作用对象",
          "决定什么"
        ],
        "rows": [
          [
            "切换持续时间",
            "进入一页时的过渡",
            "过渡执行多久"
          ],
          [
            "自动换片时间",
            "当前页的放映过程",
            "何时自动前进"
          ],
          [
            "动画开始、延迟、持续时间",
            "页内对象效果",
            "何时开始、等待多久、执行多久"
          ],
          [
            "动作或超链接",
            "可点击或悬停的对象",
            "触发后跳到哪里"
          ]
        ]
      },
      "pointGroups": [
        {
          "title": "整页切换与换片",
          "indices": [
            0,
            1,
            2,
            9
          ]
        },
        {
          "title": "页内对象动画",
          "indices": [
            3,
            4,
            5,
            6
          ]
        },
        {
          "title": "动作与跳转",
          "indices": [
            7,
            8
          ]
        }
      ]
    },
    "y2023q13": {
      "conclusion": "排练计时记录当前页用时和累计用时；结束时保留才保存计时，正式放映是否自动前进还取决于是否启用这些时间。",
      "points": [
        "选择“幻灯片放映→排练计时”后开始计时；暂停期间不累计，继续后恢复记录。",
        "换页后当前页计时重新开始，累计时间继续增长；每张幻灯片分别记录自己的用时。",
        "排练结束时可选择保留或丢弃本次记录；保留后可在浏览视图查看各页时长。",
        "保存后仍可在“切换”中修改单页自动换片时间；排练用时与切换效果持续时间不是同一概念。",
        "“设置幻灯片放映”中选择手动可暂时忽略已保存计时；切回使用已有计时才恢复按计时自动前进。",
        "Office 2016录制放映可记录旁白、墨迹和计时；排练计时不能简单等同于录制全部内容，也不要套用新版摄像头录制界面。"
      ],
      "boundary": "记录、保存和正式放映采用计时是三个状态；关闭使用计时不等于删除已保存时长，保存排练计时也不会立即开始正式自动放映。",
      "comparison": {
        "headers": [
          "阶段",
          "可见结果"
        ],
        "rows": [
          [
            "排练记录",
            "当前页及累计时间增长"
          ],
          [
            "保留计时",
            "每页时长成为已保存设置"
          ],
          [
            "正式放映使用计时",
            "按已保存时间自动前进"
          ],
          [
            "正式放映设为手动",
            "保留时长但暂不自动前进"
          ]
        ]
      }
    },
    "y2020q54": {
      "conclusion": "从“设计→设置背景格式”选择图片或纹理填充，调整透明度及相应填充参数；只有使用“全部应用”才把背景推广到整套幻灯片。",
      "points": [
        "背景填充不是普通图片对象，不会出现在选择窗格，也不能像页内图片一样直接选择并拖动。",
        "图片或纹理填充可从图片来源插入图片，也可选择信纸等内置纹理；需要平铺时再设置平铺偏移等参数。",
        "透明度用于调整背景可见程度，修改后应检查正文对比度和可读性。",
        "默认设置作用于当前页；关闭背景窗格会保留当前修改，但不等于已经应用到所有页。",
        "“全部应用”推广到所有页；“重置背景”用于恢复背景格式，不是确认或保存操作。"
      ],
      "boundary": "插入普通图片并置于底层仍是可选对象，也不会自动覆盖所有幻灯片；更改背景填充并不等于更换完整主题。"
    }
  },
  "references": {
    "y2026q3": [
      [
        "Cornell：存储器与处理器",
        "https://www.cs.cornell.edu/courses/cs316/2007fa/Lectures/Lec7_memoryProc_web.pdf"
      ],
      [
        "Micron：Flash存储技术说明",
        "https://www.micron.com/about/blog/memory/nand/flash-forward-celebrating-40-years-of-memory-innovation"
      ],
      [
        "ST：EEPROM应用说明",
        "https://www.st.com/resource/en/application_note/an2540-eeprom-emulation-in-str91xfxx-devices-stmicroelectronics.pdf"
      ]
    ],
    "merged-1": [
      [
        "Cornell：基本计算机系统",
        "https://www.cs.cornell.edu/courses/cs316/2007fa/Lectures/Lec7_memoryProc_web.pdf"
      ],
      [
        "IBM：CPU组成",
        "https://www.ibm.com/think/topics/central-processing-unit"
      ],
      [
        "Intel：RAM工作方式",
        "https://www.intel.com/content/www/us/en/tech-tips-and-tricks/computer-ram.html"
      ]
    ],
    "y2025q2": [
      [
        "RFC 20：ASCII原始码表",
        "https://www.rfc-editor.org/rfc/rfc20.html"
      ],
      [
        "IBM：EUC-CN编码说明",
        "https://www.ibm.com/docs/en/aix/7.2.0?topic=sets-euccn"
      ],
      [
        "Unicode：编码形式FAQ",
        "https://unicode.org/faq/utf_bom.html"
      ],
      [
        "Unicode：技术介绍",
        "https://www.unicode.org/standard/principles.html"
      ]
    ],
    "y2026q41": [
      [
        "UCR：进制转换课程",
        "https://www.cs.ucr.edu/~ehwang/courses/cs120a/00winter/binary.pdf"
      ],
      [
        "Cornell：小数乘2转换",
        "https://www.cs.cornell.edu/courses/cs3410/2025sp/assignments/minifloat/instructions.html"
      ],
      [
        "CMU：二进制小数课程",
        "https://www.cs.cmu.edu/afs/cs/academic/class/15213-s12/www/lectures/04-float-4up.pdf"
      ]
    ],
    "merged-3": [
      [
        "NIST：二进制前缀",
        "https://physics.nist.gov/cuu/Units/binary.html"
      ],
      [
        "Microsoft：像素格式与位深",
        "https://learn.microsoft.com/en-us/windows/win32/wic/-wic-codec-native-pixel-formats"
      ],
      [
        "Microsoft：位图文件头",
        "https://learn.microsoft.com/en-us/windows/win32/gdi/bitmap-header-types"
      ]
    ],
    "y2022q4": [
      [
        "New Mexico Tech：总线与内存课程",
        "https://www.ee.nmt.edu/~erives/308_13/Lecture25_S13.pdf"
      ],
      [
        "USC：字节寻址与数据总线课程",
        "https://ee.usc.edu/~redekopp/ee457/slides/EE457Unit7b_Interleaving_Notes.pdf"
      ]
    ],
    "y2025q1": [
      [
        "Intel：时钟频率说明",
        "https://www.intel.com/content/www/us/en/gaming/resources/cpu-clock-speed.html"
      ],
      [
        "Cornell：机器结构课程",
        "https://www.cs.cornell.edu/courses/cs3410/2016fa/slides/05-cpu-bw.pdf"
      ]
    ],
    "y2024q41": [
      [
        "RISC-V：官方基础指令集",
        "https://docs.riscv.org/reference/isa/v20260120/unpriv/rv32.html"
      ],
      [
        "Cornell：机器指令及执行课程",
        "https://www.cs.cornell.edu/courses/cs3410/2016fa/slides/05-cpu-bw.pdf"
      ]
    ],
    "y2020q2": [
      [
        "Microsoft：Window Features",
        "https://learn.microsoft.com/en-us/windows/win32/winmsg/window-features"
      ],
      [
        "Microsoft：Keyboard Input Overview",
        "https://learn.microsoft.com/en-us/windows/win32/inputdev/about-keyboard-input"
      ]
    ],
    "y2020q24": [
      [
        "Microsoft：Shell Clipboard Formats",
        "https://learn.microsoft.com/en-us/windows/win32/shell/clipboard"
      ],
      [
        "Microsoft：IDropTarget::DragOver",
        "https://learn.microsoft.com/en-us/windows/win32/api/oleidl/nf-oleidl-idroptarget-dragover"
      ],
      [
        "Microsoft：Handling Shell Data Transfer Scenarios",
        "https://learn.microsoft.com/en-us/windows/win32/shell/datascenarios"
      ],
      [
        "Microsoft：DeleteFile",
        "https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-deletefile"
      ]
    ],
    "y2025q33": [
      [
        "Microsoft：Using the clipboard",
        "https://support.microsoft.com/en-us/windows/apps/using-the-clipboard"
      ],
      [
        "Microsoft：Handling Shell Data Transfer Scenarios",
        "https://learn.microsoft.com/en-us/windows/win32/shell/datascenarios"
      ],
      [
        "Microsoft：Shell Clipboard Formats",
        "https://learn.microsoft.com/en-us/windows/win32/shell/clipboard"
      ]
    ],
    "y2020q3": [
      [
        "Microsoft：Free up drive space in Windows",
        "https://support.microsoft.com/en-us/windows/experience/storage-filemanagement/free-up-drive-space-in-windows"
      ],
      [
        "Microsoft：Windows File Recovery",
        "https://support.microsoft.com/en-us/windows/experience/backup-recovery/windows-file-recovery"
      ],
      [
        "Microsoft：Restore deleted files or folders in OneDrive（含Windows回收站还原）",
        "https://support.microsoft.com/en-us/onedrive/restore-deleted-files-or-folders-in-onedrive"
      ],
      [
        "Microsoft：Delete a file",
        "https://support.microsoft.com/en-us/office/collab-files/delete-a-file"
      ]
    ],
    "merged-4": [
      [
        "Microsoft：Naming Files, Paths, and Namespaces",
        "https://learn.microsoft.com/en-us/windows/win32/fileio/naming-a-file"
      ],
      [
        "Microsoft：Common file name extensions in Windows",
        "https://support.microsoft.com/en-us/windows/experience/storage-filemanagement/common-file-name-extensions-in-windows"
      ],
      [
        "Microsoft：File Attribute Constants",
        "https://learn.microsoft.com/en-us/windows/win32/fileio/file-attribute-constants"
      ],
      [
        "Microsoft：DeleteFile",
        "https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-deletefile"
      ]
    ],
    "y2026q35": [
      [
        "Microsoft：File Explorer in Windows",
        "https://support.microsoft.com/en-us/windows/experience/fileexplorer/file-explorer-in-windows"
      ]
    ],
    "y2020q11": [
      [
        "Microsoft：什么是幻灯片母版",
        "https://support.microsoft.com/en-us/powerpoint/training/what-is-a-slide-master-in-powerpoint"
      ],
      [
        "Microsoft：在一个演示文稿中使用多个母版",
        "https://support.microsoft.com/en-us/powerpoint/use-multiple-slide-masters-in-one-presentation"
      ],
      [
        "Microsoft：添加、编辑或移除版式占位符",
        "https://support.microsoft.com/en-us/powerpoint/add-edit-or-remove-a-placeholder-on-a-slide-layout"
      ]
    ],
    "y2024q65": [
      [
        "Microsoft：插入或更改幻灯片编号、日期及页脚",
        "https://support.microsoft.com/en-us/powerpoint/insert-or-change-the-slide-numbers-date-or-footer-for-on-screen-slides-in-powerpoint"
      ],
      [
        "Microsoft：占位符与页脚启用要求",
        "https://support.microsoft.com/en-us/powerpoint/add-edit-or-remove-a-placeholder-on-a-slide-layout"
      ]
    ],
    "y2020q53": [
      [
        "Microsoft：移除或更改当前主题",
        "https://support.microsoft.com/en-us/powerpoint/remove-or-change-the-current-theme"
      ],
      [
        "Microsoft：在一个演示文稿中使用多个主题",
        "https://support.microsoft.com/en-us/powerpoint/use-multiple-themes-in-one-presentation"
      ],
      [
        "Microsoft：应用幻灯片版式与重设",
        "https://support.microsoft.com/en-us/powerpoint/training/apply-a-slide-layout"
      ]
    ],
    "y2020q12": [
      [
        "Microsoft：隐藏或显示幻灯片",
        "https://support.microsoft.com/en-us/powerpoint/hide-or-show-a-slide"
      ],
      [
        "Microsoft：演示文稿放映快捷键",
        "https://support.microsoft.com/en-us/accessibility/powerpoint/use-keyboard-shortcuts-to-deliver-powerpoint-presentations"
      ]
    ],
    "y2026q55": [
      [
        "Microsoft：创建和演示自定义放映",
        "https://support.microsoft.com/en-us/powerpoint/create-and-present-a-custom-show"
      ]
    ],
    "merged-11": [
      [
        "Microsoft：添加、更改或移除幻灯片切换",
        "https://support.microsoft.com/en-us/powerpoint/training/add-change-or-remove-transitions-between-slides"
      ],
      [
        "Microsoft：设置切换的计时和速度",
        "https://support.microsoft.com/en-us/powerpoint/set-the-timing-and-speed-of-a-transition"
      ],
      [
        "Microsoft：设置动画效果的开始时间和速度",
        "https://support.microsoft.com/en-us/powerpoint/set-the-start-time-and-speed-of-an-animation-effect"
      ],
      [
        "Microsoft：为一个对象应用多个动画效果",
        "https://support.microsoft.com/en-us/powerpoint/apply-multiple-animation-effects-to-one-object"
      ],
      [
        "Microsoft：自定义放映中的动作、超链接与放映后返回",
        "https://support.microsoft.com/en-us/powerpoint/create-and-present-a-custom-show"
      ]
    ],
    "y2023q13": [
      [
        "Microsoft：排练和记录演示文稿计时",
        "https://support.microsoft.com/en-us/powerpoint/training/rehearse-and-time-the-delivery-of-a-presentation"
      ],
      [
        "Microsoft：录制旁白和幻灯片计时",
        "https://support.microsoft.com/en-us/powerpoint/training/record-a-slide-show-with-narration-and-slide-timings"
      ]
    ],
    "y2020q54": [
      [
        "Microsoft：更改幻灯片背景",
        "https://support.microsoft.com/en-us/powerpoint/change-the-background-of-slides"
      ],
      [
        "Microsoft：为幻灯片添加背景图片",
        "https://support.microsoft.com/en-us/powerpoint/training/add-a-background-picture-to-your-slides"
      ]
    ]
  }
};
  const escape = window.NOTE_SIMULATIONS.escapeHTML;
  for (const note of window.NOTES.notes) {
    const patch = data.patches[note.id];
    if (!patch) continue;
    for (const [key,value] of Object.entries(patch)) {
      note[key] = ['comparison','pointGroups'].includes(key) ? value : Array.isArray(value) ? value.map(escape) : escape(value);
    }
  }
  window.NOTE_REFERENCES ||= {};
  for (const [id,links] of Object.entries(data.references)) {
    const all = [...(window.NOTE_REFERENCES[id] || []), ...links];
    window.NOTE_REFERENCES[id] = all.filter((entry,i) => all.findIndex(other=>other[1]===entry[1])===i);
  }
})();
