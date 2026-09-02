(() => {
  'use strict';

  const GROUPS = [
    {
      id: 'information', short: '信息基础', number: 'A', accent: '#16b8c4',
      title: '信息、技术与计算机发展', route: '从“数据”走到“计算机为什么这样发展”',
      modules: [
        {
          id: 'concept-1', title: '信息、数据与知识', label: '概念起点',
          summary: '数据是记录信息的符号，信息是数据表达出来的意义；同一组数据脱离语境，未必能形成同样的信息。',
          blocks: [
            ['三个层次', ['数据：可被记录、存储和处理的符号，如数值、文字、声音、图像。', '信息：数据经过解释后反映的事实、状态或规律。', '知识：对信息进一步归纳、验证并形成可迁移的认识。']],
            ['信息的常见特征', ['依附载体传播，但信息本身不等同于纸张、磁盘等载体。', '可传递、共享、加工、存储；共享后原持有者通常不会因此失去它。', '具有时效性、价值相对性和真伪性，价值取决于接收者与情境。']]
          ],
          boundary: '“数据就是信息”过于绝对。原始体温数值是数据；结合时间、正常范围和病情解释后，才成为有意义的信息。',
          memory: '数据负责记录，信息负责表达意义，知识负责形成可复用的判断。',
          lab: 'info-chain'
        },
        {
          id: 'concept-2', title: '信息技术', label: '技术体系',
          summary: '信息技术不是“计算机技术”的同义词，而是围绕信息获取、传输、存储、处理、表示和应用形成的技术群。',
          blocks: [
            ['基本环节', ['感测与识别技术负责获取信息，如传感器、扫码与语音识别。', '通信技术负责传递信息；计算机技术负责存储和处理信息。', '控制技术把处理结果作用于设备；显示与交互技术把结果呈现给人。']],
            ['发展主线', ['语言与文字扩展了信息表达；印刷术扩大了复制传播。', '电报、电话、广播电视提高远距离传播速度。', '计算机与互联网使信息处理、复制、共享和协同进入数字化阶段。']]
          ],
          boundary: '传感器采集体温属于信息获取；5G发送数据属于传输；算法识别异常属于处理。题目常把不同环节互换。',
          memory: '获取 → 传输 → 存储 → 处理 → 表示/控制，是信息技术的完整链条。'
        },
        {
          id: 'concept-3', title: '信息社会、信息素养与计算机文化', label: '社会层面',
          summary: '信息社会以信息资源、数字基础设施和知识创新为重要生产要素；信息素养强调能找、能判、能用，也能负责地使用。',
          blocks: [
            ['信息社会', ['生产与服务数字化，网络成为重要基础设施。', '信息资源具有战略价值，但数字鸿沟、隐私泄露与算法偏差也会出现。', '电子政务、远程医疗、在线教育和数字支付都是典型形态。']],
            ['信息素养', ['明确需求并选择合适渠道检索；判断来源、时间和证据质量。', '合法合规地加工、表达和共享信息，尊重隐私与知识产权。', '计算机文化指计算技术进入社会后形成的知识、行为方式、价值观和制度影响。']]
          ],
          boundary: '“会使用某个软件”只是信息素养的一部分；不能核验来源、忽视版权和隐私，仍不算具备完整信息素养。',
          memory: '信息社会描述环境，信息素养描述人的能力与责任，计算机文化描述技术带来的整体社会影响。'
        },
        {
          id: 'concept-4', title: '计算机的概念、起源与四代发展', label: '发展史',
          summary: '电子数字计算机以程序控制方式自动处理数据；代际划分主要依据核心电子元器件，不是依据体积或售价。',
          blocks: [
            ['关键节点', ['1946年投入使用的 ENIAC 通常被视为第一台通用电子数字计算机之一，主要采用电子管并以十进制运算。', '冯·诺依曼体系强调二进制、存储程序和程序控制；不能把这些全部倒贴给 ENIAC。', '我国1958年研制成功第一台通用数字电子计算机103机，随后计算机事业逐步发展。']],
            ['四代划分', ['第一代：电子管；体积大、功耗高，主要使用机器语言。', '第二代：晶体管；可靠性与速度提高。', '第三代：中小规模集成电路；操作系统进一步发展。', '第四代：大规模和超大规模集成电路；微处理器推动微型机普及。']]
          ],
          boundary: '第一代不等于“采用存储程序的第一台计算机”。ENIAC、EDVAC、冯·诺依曼思想的时间与技术属性要分别判断。',
          memory: '电子管 → 晶体管 → 中小规模集成电路 → 大规模/超大规模集成电路。',
          lab: 'generation'
        },
        {
          id: 'concept-5', title: '信息技术企业兴衰与国产计算机', label: '考纲了解',
          summary: '考纲要求理解企业兴衰和国产计算机现状，重点不是背股价和排行榜，而是看技术路线、生态、需求与管理如何共同作用。',
          blocks: [
            ['企业兴衰的观察框架', ['核心技术和产品是否持续创新，能否跨越技术范式变化。', '软件、硬件、开发者与用户形成的生态是否稳定。', '市场需求、供应链、商业模式、组织管理与政策环境共同影响结果。']],
            ['国产计算机', ['通常强调自主可控、安全可靠以及对国产处理器、操作系统和应用软件的适配。', '应用覆盖党政办公、教育、金融、工业与个人终端等场景。', '“国产”不是单一品牌或单一架构，也不意味着所有部件和软件已经完全同质化。']]
          ],
          boundary: '企业“曾经领先”不能推出“必然长期领先”；国产化也不是只更换一个CPU，而是芯片、整机、系统、软件与服务生态的协同。',
          memory: '判断企业看技术、生态、需求和管理；判断国产计算机看自主可控与全栈适配。'
        },
        {
          id: 'concept-6', title: '计算机的特点与分类', label: '分类判断',
          summary: '同一台计算机可以从规模、用途、处理对象等不同角度分类；先找分类标准，再判断选项是否同层。',
          blocks: [
            ['主要特点', ['运算速度快、计算精度高、存储容量大。', '具有逻辑判断能力，能在程序控制下自动连续工作。', '通用性强，但不意味着计算机天然具有人的理解和价值判断。']],
            ['常见分类', ['按处理对象：数字计算机、模拟计算机、混合计算机。', '按用途：通用计算机、专用计算机。', '按规模/性能：巨型机、大型机、小型机、微型机；服务器、工作站等也常按角色和能力描述。', '微型机按形态可包括台式机、便携式计算机和嵌入式设备等。']]
          ],
          boundary: '“通用机/专用机”与“数字机/模拟机”不是同一分类标准；题目把它们并列成一组时要先检查层级。',
          memory: '看到分类题先问“按什么分”：处理对象、用途、规模还是形态。',
          lab: 'classification'
        },
        {
          id: 'concept-7', title: '计算机的应用与发展趋势', label: '应用判断',
          summary: '应用领域按“计算机在完成什么任务”区分；发展趋势则回答系统能力向什么方向演进。',
          blocks: [
            ['典型应用', ['科学计算：数值模拟、工程计算；数据处理：统计、检索和事务处理。', '过程控制：根据传感数据实时控制设备；计算机辅助系统包括CAD、CAM、CAI等。', '人工智能：感知、推理、学习与生成；网络通信与电子商务依赖互联基础设施。']],
            ['发展趋势', ['巨型化面向更强算力和复杂任务；微型化面向小型、低功耗和嵌入式。', '网络化实现资源共享与协同；智能化提升感知、学习与决策辅助能力。', '多媒体化、人机交互自然化、绿色低功耗与泛在计算也在持续发展。']]
          ],
          boundary: '“医院挂号系统”主要是信息/数据处理；“核磁图像辅助诊断”可涉及人工智能；“自动调节输液泵”更接近过程控制。',
          memory: '应用看任务：算、管、控、辅、智、联；趋势看更强、更小、更联、更智能。'
        }
      ]
    },
    {
      id: 'representation', short: '表示与编码', number: 'B', accent: '#3d7bfd',
      title: '数制、存储单位与数据表示', route: '把数字、字符和图像真正放进计算机',
      modules: [
        {
          id: 'concept-8', title: '进位计数制与位权', label: '数制原理',
          summary: 'R进制由R个基本数码组成，逢R进一；某位的数值等于“该位数字 × R的位次幂”。',
          blocks: [
            ['四种常用数制', ['二进制：0、1；八进制：0—7；十进制：0—9；十六进制：0—9、A—F。', '基数是可用数码的个数；位权由位置决定，小数点左侧从0次幂递增，右侧从-1次幂递减。', '书写时用下标或后缀标明进制，避免把“10”误当成固定的十。']],
            ['为什么计算机用二进制', ['二进制状态容易用高/低电平等稳定物理状态实现。', '运算规则简单，适合逻辑代数与数字电路。', '八进制和十六进制可分别把3位、4位二进制压缩成1位，便于人阅读。']]
          ],
          boundary: '十六进制的10代表十进制16；二进制的10代表十进制2。数字串本身不能脱离基数解释。',
          memory: 'R进制：R个数码、逢R进一、位权是R的整数次幂。'
        },
        {
          id: 'concept-9', title: '数制转换', label: '计算核心',
          summary: '其他进制转十进制用按权展开；十进制整数转其他进制用除基取余，小数用乘基取整；二进制与八/十六进制直接分组。',
          blocks: [
            ['稳定算法', ['R进制转十进制：每位乘对应位权后求和。', '十进制整数转R进制：连续除R，余数从下往上读。', '十进制小数转R进制：连续乘R，整数部分从上往下读，可能不能有限表示。']],
            ['快速分组', ['二进制 ↔ 八进制：以小数点为界，分别每3位一组。', '二进制 ↔ 十六进制：分别每4位一组；不足位在整数左侧或小数右侧补0。', '八进制与十六进制互转，通常先转成二进制再重新分组。']]
          ],
          boundary: '分组必须以小数点为界，不能跨过小数点连续分；补0只为凑组，不改变数值。',
          memory: '按权展开回十进制；整数除基倒读，小数乘基顺读；二八三位、二十六四位。',
          lab: 'base-converter'
        },
        {
          id: 'concept-10', title: '位、字节、字与容量换算', label: '存储单位',
          summary: 'bit是最小信息单位，Byte是常用存储容量单位；字由若干字节组成，其位数与机器字长相关。',
          blocks: [
            ['单位体系', ['1 Byte = 8 bit；B与b大小写含义不同。', '教材常按二进制口径换算：1 KB = 1024 B，1 MB = 1024 KB，1 GB = 1024 MB，1 TB = 1024 GB。', '网络速率常用 bit/s，文件容量常用 B；下载时间计算必须先统一单位。']],
            ['字与字长', ['字是CPU一次处理的一组二进制位，字长是一个字包含的位数。', '字长常与CPU一次能处理的数据宽度、寄存器和寻址能力相关，但真实体系结构可能更复杂。', '存储容量与字长不是同一个指标：64位计算机不代表只有64位存储空间。']]
          ],
          boundary: '100 Mbps不是100 MB/s；忽略协议损耗时先除以8才约为12.5 MB/s。',
          memory: '位看b，字节看B；1B=8b；容量逐级×1024，速率与容量先统一单位。',
          lab: 'storage-converter'
        },
        {
          id: 'concept-11', title: '数值在计算机中的表示', label: '数值编码',
          summary: '计算机保存的是有限位二进制编码；位数有限会带来范围、精度和溢出问题，整数与实数的表示方法也不同。',
          blocks: [
            ['机器数基础', ['最高位可用作符号信息：通常0表示正、1表示负；带符号数的实际编码可采用原码、反码、补码。', '补码使加减运算更统一；正数的原码、反码和补码相同，负数补码通常由对应正数按位取反再加1。', 'n位无符号整数范围为0到2ⁿ-1；位数固定时超出范围会溢出。']],
            ['实数与精度', ['实数通常用浮点形式表示，可类比“符号、有效数字、指数”。', '很多十进制小数不能被有限二进制位精确表示，因此计算可能出现微小舍入误差。', '位数更多通常能扩大范围或提高精度，但也增加存储与运算成本。']]
          ],
          boundary: '“计算机中的0.1一定完全精确”不成立；浮点表示的舍入误差不等于程序必然算错，而是需要按任务控制精度。',
          memory: '有限位带来三个边界：表示范围、数值精度、溢出风险。'
        },
        {
          id: 'concept-12', title: '字符与汉字编码', label: '编码体系',
          summary: '字符集规定“有哪些字符及其编号”，编码形式规定“编号怎样变成字节”；ASCII、国标汉字编码和Unicode不能混成一个层次。',
          blocks: [
            ['西文与Unicode', ['标准ASCII使用7位，可表示128个字符；常用一个字节存放，最高位通常为0。', 'Unicode为各类文字分配统一码点；UTF-8、UTF-16、UTF-32是Unicode的不同编码形式。', 'UTF-8为变长编码，ASCII范围字符在UTF-8中仍占1字节。']],
            ['汉字编码四层', ['输入码：便于输入，如拼音码、五笔字型码。', '交换码/国标码：用于交换；区位码用区号和位号定位字符。', '机内码：计算机内部存储和处理汉字；字形码保存显示或打印字形。', 'GB2312、GBK、GB18030覆盖范围逐步扩展；不能把ASCII当作汉字编码。']]
          ],
          boundary: '“字符的Unicode码点”与“这个字符在UTF-8中占几个字节”是两个问题；码点相同，编码字节序列可以不同。',
          memory: '字符集给编号，编码形式变字节；汉字输入、交换、机内、字形各管一层。',
          lab: 'encoding'
        },
        {
          id: 'concept-13', title: '图像、图形与颜色表示', label: '图像数据',
          summary: '位图由像素阵列组成，数据量受像素总数和颜色深度影响；矢量图保存几何描述，放大通常不出现像素锯齿。',
          blocks: [
            ['位图', ['分辨率可指像素尺寸，如1920×1080；像素越多，能表达的空间细节通常越丰富。', '颜色深度表示每个像素使用的位数，24位真彩色通常对应RGB各8位。', '未压缩位图数据量约为：水平像素×垂直像素×颜色深度÷8。']],
            ['图形与压缩', ['矢量图用点、线、曲线和填充等数学对象描述，适合标志、图表与排版。', '无损压缩可完全还原原数据，如PNG常用于界面与透明图；有损压缩允许丢弃部分信息，如JPEG常用于照片。', '文件大小还受文件头、压缩算法、画面复杂度等影响，不能只用扩展名绝对判断。']]
          ],
          boundary: '显示器“分辨率更高”不必然意味着单个文件更大；只有图像本身像素尺寸、位深、压缩等改变时，文件数据量才随之变化。',
          memory: '位图看像素与位深，矢量看几何对象；未压缩量=像素数×位深÷8。',
          lab: 'image-size'
        }
      ]
    },
    {
      id: 'system', short: '计算机系统', number: 'C', accent: '#7757d9',
      title: '体系结构、硬件与软件', route: '从一条指令看懂整台计算机怎样协作',
      modules: [
        {
          id: 'concept-14', title: '计算机系统的组成', label: '总框架',
          summary: '完整计算机系统由硬件系统和软件系统组成；硬件提供物质基础，软件规定任务和使用方式，二者缺一不可。',
          blocks: [
            ['硬件系统', ['运算器、控制器、存储器、输入设备、输出设备构成经典五大部件。', 'CPU主要由运算器、控制器和寄存器等组成；主机常指CPU与主存储器等核心部分。', '外部设备通常包括输入设备、输出设备和外存储器。']],
            ['软件系统', ['系统软件管理和支持计算机运行，如操作系统、语言处理程序、数据库管理系统和常用服务程序。', '应用软件面向具体任务，如文字处理、医学影像分析和财务管理软件。', '程序是指令序列；文档与数据可以被程序处理，但不等同于程序本身。']]
          ],
          boundary: '“计算机系统=主机+外设”只描述硬件层，不是完整计算机系统；完整系统还必须包括软件。',
          memory: '系统分硬件与软件；硬件五大部件，软件分系统软件与应用软件。'
        },
        {
          id: 'concept-15', title: '冯·诺依曼体系与指令周期', label: '工作原理',
          summary: '程序和数据以二进制形式存入存储器，控制器按地址取出指令，经译码后协调各部件执行。',
          blocks: [
            ['核心思想', ['采用二进制表示数据和指令。', '存储程序：程序与数据预先存入存储器，形式上都由二进制代码构成。', '程序控制：通常按地址顺序执行，遇到转移指令可改变执行顺序。']],
            ['指令与执行', ['一条机器指令通常抽象为操作码与地址码/操作数字段。', '基本周期可概括为取指、译码、执行，执行中可能读写数据并更新结果。', '程序计数器保存下一条指令地址；指令寄存器保存当前正在处理的指令。']]
          ],
          boundary: '程序与数据在存储器中形式上都可表现为二进制，但解释方式由上下文和指令决定，不能说二者“完全没有区别”。',
          memory: '二进制 + 存储程序 + 程序控制；CPU循环取指、译码、执行。',
          lab: 'instruction-cycle'
        },
        {
          id: 'concept-16', title: 'CPU、寄存器与系统总线', label: '处理核心',
          summary: 'CPU负责解释并执行指令；寄存器保存当前最急需的数据和状态；总线负责部件间的信息通路。',
          blocks: [
            ['CPU内部', ['运算器完成算术运算与逻辑运算，核心部件可包括算术逻辑单元ALU。', '控制器产生控制信号、解释指令并协调各部件。', '寄存器速度很快、数量有限，用于暂存指令、地址、数据和状态。']],
            ['三类系统总线', ['数据总线传送数据，其宽度影响一次并行传输的数据量。', '地址总线传送地址，位数通常影响可表示的地址空间。', '控制总线传送读写、中断、时序等控制信号。']]
          ],
          boundary: '控制器不负责完成所有算术运算；地址总线也不传输用户数据本身。分类依据是“传什么”。',
          memory: '运算器算，控制器管，寄存器暂存；数据、地址、控制总线各传一类信息。',
          lab: 'bus-router'
        },
        {
          id: 'concept-17', title: '存储系统与层次结构', label: '高频辨析',
          summary: '存储层次用小而快的部件服务当前任务，用大而慢的部件保存更多数据；Cache解决CPU与主存速度不匹配问题。',
          blocks: [
            ['从近到远', ['寄存器位于CPU内部，速度最快、容量最小。', 'Cache位于CPU与主存之间，保存近期可能使用的数据副本。', '主存包括RAM和ROM；RAM通常可读写且断电易失，ROM通常非易失。', '外存如SSD、硬盘、U盘，容量大、可长期保存，但CPU通常不能像访问主存那样直接执行其中指令。']],
            ['存储器分类', ['按断电保持：易失性与非易失性；按访问方式：随机、顺序、直接等。', 'RAM可分SRAM和DRAM；Cache常用SRAM，主存常用DRAM。', 'ROM可有PROM、EPROM、EEPROM/Flash等类型；闪存也广泛用于SSD和U盘。']]
          ],
          boundary: 'SSD虽然比机械硬盘快，仍属于外存；Cache虽然常集成在CPU内或附近，作用仍是缓和CPU与主存的速度矛盾。',
          memory: '寄存器 → Cache → 主存 → 外存：速度递减，容量通常递增，单位容量成本通常递减。',
          lab: 'memory-hierarchy'
        },
        {
          id: 'concept-18', title: '输入、输出设备与常见接口', label: '设备辨析',
          summary: '输入和输出要站在“计算机系统”的角度判断；触摸屏、网卡等设备可能同时承担双向功能。',
          blocks: [
            ['设备角色', ['键盘、鼠标、扫描仪、麦克风、摄像头和传感器主要输入数据。', '显示器、打印机、音箱和绘图仪主要输出信息。', '触摸屏既显示又接收触控；网卡负责网络数据收发；外存设备承担输入/输出式读写。']],
            ['常见接口与指标', ['USB可连接多类外设并支持即插即用；HDMI常传输数字音视频。', '显示设备关注分辨率、刷新率、色彩等；打印机可关注分辨率与打印速度。', '设备正常工作通常需要硬件接口、驱动程序与操作系统协同。']]
          ],
          boundary: '“磁盘是输入设备还是输出设备”若只能二选一容易失真；磁盘读出时像输入，写入时像输出，通常归为外存/输入输出设备。',
          memory: '以系统为参照：进系统是输入，出系统是输出，能读能写就是双向。',
          lab: 'device-sorter'
        },
        {
          id: 'concept-19', title: '软件、程序语言与语言处理', label: '软件层次',
          summary: '程序语言按抽象层次可分机器语言、汇编语言和高级语言；翻译程序把源程序转换或解释为可执行过程。',
          blocks: [
            ['软件分类', ['操作系统管理资源并提供接口；数据库管理系统管理结构化数据；驱动程序连接系统与硬件。', '编译程序、解释程序等语言处理程序属于系统软件范畴。', '应用软件可分通用应用软件和专用应用软件。']],
            ['语言与翻译', ['机器语言由机器指令二进制代码构成，可被CPU直接执行但难编写。', '汇编语言使用助记符，需要汇编程序翻译。', '高级语言更接近人的表达；编译方式通常先整体生成目标程序，解释方式通常边翻译边执行。', '源程序不是机器可直接执行代码；编译、链接后才可能形成可执行程序。']]
          ],
          boundary: '“高级语言必须由解释程序执行”错误；高级语言既可采用编译方式，也可采用解释或混合方式。',
          memory: '机器语言机器直接认；汇编靠汇编；高级语言靠编译或解释。'
        },
        {
          id: 'concept-20', title: '微型计算机、硬件设备与性能指标', label: '整机判断',
          summary: '评价计算机不能只看一个数字；CPU、内存、存储、显卡与任务类型共同决定体验，指标必须连同单位和对象理解。',
          blocks: [
            ['常见硬件', ['主板连接CPU、内存、存储、扩展卡与接口；芯片组和总线协调数据通路。', 'GPU擅长图形和大规模并行计算；独立显卡通常有独立显存。', 'SSD无机械盘片，随机访问延迟低；HDD依靠磁盘和磁头，单位容量成本通常较低。', '台式机、笔记本、一体机、平板及嵌入式微型机面向不同形态与功耗需求。']],
            ['性能指标', ['CPU主频表示时钟频率，但不同架构不能只凭GHz直接比较总体性能。', '字长、核心/线程、Cache、指令系统和工艺等共同影响处理能力。', '内存容量与速度影响并发和数据交换；存储设备关注容量、吞吐、随机访问与耐久。', '整机性能取决于瓶颈与任务：游戏、视频处理、办公和数据库侧重点不同。']]
          ],
          boundary: '“主频越高，计算机一定越快”是典型单指标陷阱；必须控制架构、核心、缓存、任务和散热等条件。',
          memory: '先看任务，再看CPU、内存、存储、GPU是否匹配；单项参数不能代表整机。',
          lab: 'bottleneck'
        }
      ]
    },
    {
      id: 'multimedia', short: '多媒体', number: 'D', accent: '#f16f78',
      title: '多媒体系统与数字媒体处理', route: '从采样、量化到压缩和常用工具',
      modules: [
        {
          id: 'concept-21', title: '多媒体技术与多媒体计算机系统', label: '考纲主干',
          summary: '多媒体把文本、图形、图像、音频、动画和视频等媒体数字化并综合处理，强调集成、交互与实时呈现。',
          blocks: [
            ['概念与特点', ['媒体既可指承载信息的实体，也可指表达信息的形式；多媒体语境常关注后者。', '多样性体现媒体形式丰富；集成性强调统一组织；交互性允许用户参与控制；实时性强调及时处理与呈现。', '文本同样属于媒体元素，多媒体不等于“只有音频和视频”。']],
            ['系统组成与应用', ['硬件包括CPU/GPU、内存、存储、声卡、显示器、麦克风、摄像头和采集设备等。', '软件包括操作系统、驱动、编解码器、播放软件和音频/图像/视频创作工具。', '应用覆盖教育培训、游戏娱乐、数字出版、广告设计、远程医疗和虚拟现实等。']]
          ],
          boundary: '“能够播放视频的电脑就是完整多媒体创作系统”不严谨；创作还需要采集、处理、存储、输出硬件及相应软件。',
          memory: '元素要多样，系统要集成，过程可交互，音视频还常要求实时。'
        },
        {
          id: 'concept-22', title: '音频、图像、视频处理与压缩', label: '处理计算',
          summary: '模拟媒体进入计算机通常经历采样、量化和编码；质量与数据量受采样参数、位深、时长、分辨率、帧率和压缩方式共同影响。',
          blocks: [
            ['数字音视频', ['音频采样频率表示每秒采样次数，量化位数表示每个样本的精细程度，声道数表示并行声音通道。', '未压缩音频量≈采样频率×量化位数×声道数×时长÷8。', '视频可理解为连续图像帧配合音频；分辨率、颜色深度、帧率、时长共同影响原始数据量。']],
            ['格式、压缩与软件', ['压缩分无损和有损；压缩比越高通常体积越小，但有损压缩可能降低质量。', '常见音频格式有WAV、MP3、AAC；图像有BMP、JPEG、PNG、GIF；视频容器有MP4、AVI、MKV等。', 'Audacity等用于音频编辑，Photoshop/GIMP等用于图像处理，Premiere/剪映/DaVinci Resolve等用于视频剪辑；具体版本界面会变化。', '裁剪改变保留范围，缩放改变尺寸或播放比例，转码改变编码/封装；三者结果不同。']]
          ],
          boundary: '扩展名常反映封装或格式，但不能单凭扩展名推出“必然无损”或准确码率；WAV是容器，也可能承载不同编码。',
          memory: '音频看采样率、位深、声道、时长；图像看像素、位深；视频再乘帧率与时长。',
          lab: 'media-size'
        }
      ]
    },
    {
      id: 'thinking', short: '计算思维', number: 'E', accent: '#f7b84b',
      title: '计算思维、算法与程序结构', route: '把问题拆成计算机能明确执行的步骤',
      modules: [
        {
          id: 'concept-23', title: '计算思维与计算机求解问题', label: '思维方法',
          summary: '计算思维不是“像计算机一样机械思考”，而是把问题抽象、分解并形成可由人或计算系统执行和复用的解决方案。',
          blocks: [
            ['核心方法', ['分解：把复杂问题拆成可管理的子问题。', '模式识别：发现不同问题中的重复结构；抽象：保留关键特征，忽略无关细节。', '算法化：把方法写成明确步骤；自动化：交给计算系统重复执行。', '评价与迭代：检查正确性、效率、边界条件并改进方案。']],
            ['求解流程', ['定义问题和输入/输出，明确约束与评价标准。', '建立模型、设计算法，用流程图或伪代码表达。', '编写程序并调试；用正常、边界和异常数据测试。', '分析结果与资源消耗，必要时优化并维护。']]
          ],
          boundary: '抽象不是“把细节全部删掉”，而是围绕目标保留必要特征；忽略了会影响结果的条件，就是错误抽象。',
          memory: '分解问题 → 识别模式 → 抽象建模 → 算法表达 → 自动执行 → 评价改进。',
          lab: 'ct-workflow'
        },
        {
          id: 'concept-24', title: '算法、复杂度、程序结构与面向对象', label: '算法综合',
          summary: '算法是解决一类问题的有限、明确、可执行步骤；程序把算法用语言表达，三种基本控制结构能够组合出复杂流程。',
          blocks: [
            ['算法与策略', ['算法常强调有穷性、确定性、可行性，并具有输入和至少一个输出。', '自然语言、流程图、伪代码和程序语言都可表达算法；E-R图主要描述实体联系，不是常规算法表示。', '典型策略包括穷举、迭代/递推、分治等；选择策略要兼顾正确性与资源。', '时间复杂度关注操作次数随输入规模的增长，空间复杂度关注额外存储需求；二者可能权衡。', '时间优化可减少重复计算、提前结束无效搜索或改用增长更慢的算法；空间优化可复用存储、原地处理或只保留当前必要状态。']],
            ['结构与对象', ['顺序结构依次执行；分支结构根据条件选择路径；循环结构在条件控制下重复。', '流程图常用椭圆表示开始/结束、平行四边形表示输入/输出、矩形表示处理、菱形表示判断。', '伪代码重在清楚表达逻辑，不要求遵守某一种编程语言的全部语法。', '面向对象把数据与操作封装成对象；类是对象的抽象模板，常见思想包括封装、继承和多态。']]
          ],
          boundary: '循环次数少不必然代表算法更快；还要看每次循环的工作量和输入规模。优化也必须先保证结果正确。',
          memory: '算法要明确、可行、会结束；结构只有顺序、分支、循环，复杂流程是三者组合。',
          lab: 'algorithm-runner'
        }
      ]
    }
  ];

  const allModules = GROUPS.flatMap(group => group.modules.map(module => ({ ...module, group })));
  const STORAGE_KEY = 'computer-notes-chapter1-v2-mastery';
  const LAST_KEY = 'computer-notes-chapter1-v2-last';
  let state = loadState();
  let activeFilter = 'all';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const fmt = value => new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 3 }).format(value);

  function loadState() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
  }
  function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  function statusOf(id) { return state[id] || 'new'; }

  function render() {
    $('#route-grid').innerHTML = GROUPS.map(group => `
      <a class="route-card" href="#group-${group.id}" style="--accent:${group.accent}">
        <span>${group.number} · ${group.modules.length}个模块</span><h3>${group.title}</h3><p>${group.route}</p><i>↘</i>
      </a>`).join('');

    $('#filter-pills').innerHTML = `<button class="active" type="button" data-filter="all">全部</button>` + GROUPS.map(group =>
      `<button type="button" data-filter="${group.id}">${group.short}</button>`).join('');

    $('#knowledge-content').innerHTML = GROUPS.map(group => `
      <section class="knowledge-group" id="group-${group.id}" data-group="${group.id}" style="--accent:${group.accent}">
        <header class="group-head"><span class="group-number">${group.number}</span><div><p>${group.short.toUpperCase()} · ${group.modules.length} MODULES</p><h2>${group.title}</h2></div></header>
        ${group.modules.map((module, index) => renderModule(module, group, index)).join('')}
      </section>`).join('') + `
      <section class="chapter-check" id="chapter-finish">
        <div><p class="eyebrow">CHAPTER CHECK</p><h2>学完不等于掌握：把不确定项重新筛出来</h2><p>目录中的黄色标记表示“还不确定”，绿色表示“已掌握”。状态只保存在当前设备中，不上传任何个人数据。</p></div>
        <button type="button" id="show-weak">只看未掌握模块</button>
      </section>
      <footer class="app-footer"><p>范围依据：山东省2026年普通高等教育专科升本科招生考试《计算机（公共课）考试要求》第一、二部分；2027年版本说明保持Office相关版本不变。</p><p><a href="https://www.sdzk.cn/NewsInfo.aspx?BCID=1195&CID=1133&NewsID=7081" target="_blank" rel="noreferrer">查看官方考试要求</a></p></footer>`;

    renderDirectory();
    bindCoreEvents();
    bindLabs();
    updateProgress();
    updateContinue();
    appendMobileNav();
    $('#chapter1-app').dataset.ready = 'true';
  }

  function renderModule(module, group, index) {
    const number = String(allModules.findIndex(item => item.id === module.id) + 1).padStart(2, '0');
    return `<article class="module-card" id="${module.id}" data-group="${group.id}" data-module="${module.id}" style="--accent:${group.accent}">
      <header class="module-top">
        <span class="module-number">${number}</span>
        <div class="module-title"><p>${module.label}</p><h3>${module.title}</h3><p class="module-summary">${module.summary}</p></div>
        ${renderMastery(module.id)}
      </header>
      <div class="module-body">
        <div class="knowledge-grid">${module.blocks.map(([title, points], i) => `<section class="knowledge-block${module.blocks.length === 1 || (module.blocks.length % 2 && i === module.blocks.length - 1) ? ' wide' : ''}"><strong>${title}</strong><ul>${points.map(point => `<li>${point}</li>`).join('')}</ul></section>`).join('')}</div>
        <div class="exam-boundary"><span>易错边界</span><p>${module.boundary}</p></div>
        <div class="memory-line"><span>一条线记住</span><strong>${module.memory}</strong></div>
        ${module.lab ? renderLab(module.lab) : ''}
      </div>
    </article>`;
  }

  function renderMastery(id) {
    const current = statusOf(id);
    const labels = { new: '未学', unsure: '不确定', mastered: '已掌握' };
    return `<div class="mastery-control" role="group" aria-label="学习状态">
      ${Object.keys(labels).map(key => `<button type="button" data-state="${key}" data-module-state="${id}" class="${current === key ? 'active' : ''}" title="${labels[key]}" aria-label="标记为${labels[key]}" aria-pressed="${current === key}">${key === 'new' ? '○' : key === 'unsure' ? '?' : '✓'}</button>`).join('')}
    </div>`;
  }

  function renderDirectory() {
    $('#directory-nav').innerHTML = GROUPS.map(group => `<div class="directory-group" data-directory-group="${group.id}"><strong>${group.number} · ${group.title}</strong>${group.modules.map(module => {
      const n = String(allModules.findIndex(item => item.id === module.id) + 1).padStart(2, '0');
      return `<a href="#${module.id}" data-directory-module="${module.id}" data-state="${statusOf(module.id)}"><span>${n}</span><b>${module.title}</b><i aria-hidden="true"></i></a>`;
    }).join('')}</div>`).join('');
  }

  function renderLab(type) {
    const heads = {
      'info-chain': ['语境实验', '同一组数据，怎样变成不同信息'],
      generation: ['时间轴实验', '按核心元器件辨认计算机代际'],
      classification: ['分类实验', '先选标准，再给计算机归类'],
      'base-converter': ['数制实验', '输入一个数，查看结果与关键步骤'],
      'storage-converter': ['容量实验', '在 bit、Byte、KB、MB、GB 间换算'],
      encoding: ['编码实验', '观察字符的码点与UTF-8字节'],
      'image-size': ['图像实验', '计算未压缩位图的理论数据量'],
      'instruction-cycle': ['执行实验', '逐步运行取指—译码—执行循环'],
      'bus-router': ['总线实验', '判断信号应走哪类总线'],
      'memory-hierarchy': ['层次实验', '按速度排列存储器并查看角色'],
      'device-sorter': ['设备实验', '从系统角度判断输入与输出'],
      bottleneck: ['整机实验', '不同任务的性能瓶颈在哪里'],
      'media-size': ['媒体实验', '计算音频原始数据量与压缩后大小'],
      'ct-workflow': ['抽象实验', '从真实问题提取输入、输出与约束'],
      'algorithm-runner': ['算法实验', '让分支与循环在输入数据上真正运行']
    };
    const [tag, title] = heads[type];
    return `<section class="lab" data-lab="${type}"><header class="lab-head"><div><span>${tag}</span><strong>${title}</strong></div></header><div class="lab-body">${labBody(type)}</div></section>`;
  }

  function labBody(type) {
    const bodies = {
      'info-chain': `<div class="choice-grid" data-info-choice><button type="button" data-context="clinic">体温 39.2℃ · 临床</button><button type="button" data-context="weather">气温 39.2℃ · 天气</button></div><div class="lab-output" data-output>先选择语境。数字相同，但对象、正常范围和决策目的不同。</div>`,
      generation: `<div class="lab-controls" data-generation>${['电子管','晶体管','中小规模集成电路','大规模/超大规模集成电路'].map((x,i)=>`<button type="button" data-gen="${i}">${i+1}代</button>`).join('')}</div><div class="lab-output" data-output>选择一代计算机，查看核心依据。</div>`,
      classification: `<div class="lab-controls"><select data-class-standard aria-label="分类标准"><option value="use">按用途</option><option value="data">按处理对象</option><option value="scale">按规模性能</option></select></div><div class="choice-grid" data-class-options></div><div class="lab-output" data-output>选择分类标准后判断“天气数值预报专用机”。</div>`,
      'base-converter': `<div class="lab-controls"><input data-base-input value="101101.01" inputmode="decimal" aria-label="待转换数字"><select data-base-from aria-label="原进制"><option value="2">二进制</option><option value="8">八进制</option><option value="10">十进制</option><option value="16">十六进制</option></select><select data-base-to aria-label="目标进制"><option value="10">转十进制</option><option value="2">转二进制</option><option value="8">转八进制</option><option value="16" selected>转十六进制</option></select><button type="button" data-run-base>转换</button></div><div class="lab-output" data-output></div>`,
      'storage-converter': `<div class="lab-controls"><input data-storage-value type="number" value="100" min="0" step="any"><select data-storage-from><option>Mbps</option><option>bit</option><option>Byte</option><option>KB</option><option>MB</option><option>GB</option></select><select data-storage-to><option>MB/s</option><option>bit</option><option>Byte</option><option>KB</option><option>MB</option><option>GB</option></select><button type="button" data-run-storage>换算</button></div><div class="lab-output" data-output></div>`,
      encoding: `<div class="lab-controls"><input data-encoding-input value="A医" maxlength="12" aria-label="输入字符"></div><div class="lab-output" data-output></div>`,
      'image-size': `<div class="lab-controls"><input data-image-w type="number" value="1920" min="1" aria-label="水平像素"><input data-image-h type="number" value="1080" min="1" aria-label="垂直像素"><select data-image-depth><option value="1">1位</option><option value="8">8位</option><option value="24" selected>24位</option><option value="32">32位</option></select><button type="button" data-run-image>计算</button></div><div class="lab-output" data-output></div>`,
      'instruction-cycle': `<div class="step-flow" data-cycle>${[['1','PC给出地址'],['2','取入指令'],['3','译码'],['4','执行/访存'],['5','保存结果']].map(([n,t],i)=>`<div class="step-node${i===0?' active':''}"><b>${n} · ${t}</b><small>${['下一条指令在哪里','存入指令寄存器','识别操作码和对象','运算器/存储器工作','更新状态并继续'][i]}</small></div>`).join('')}</div><div class="lab-controls" style="margin-top:12px"><button type="button" data-cycle-next>下一步</button></div><div class="lab-output" data-output>程序计数器 PC 保存下一条指令地址。</div>`,
      'bus-router': `<div class="lab-controls" data-bus-question><button type="button" data-bus="address">CPU指出内存单元 2048</button><button type="button" data-bus="data">把数值37送入CPU</button><button type="button" data-bus="control">发出“写入”信号</button></div><div class="lab-output" data-output>点击一个信号，观察它走哪类总线。</div>`,
      'memory-hierarchy': `<div class="choice-grid" data-memory-choice>${['外存','Cache','寄存器','主存'].map(x=>`<button type="button" data-memory="${x}">${x}</button>`).join('')}</div><div class="lab-output" data-output>请按“通常速度由快到慢”依次点击四层。</div>`,
      'device-sorter': `<div class="lab-controls" data-device-question>${['扫描仪','显示器','触摸屏','SSD'].map(x=>`<button type="button" data-device="${x}">${x}</button>`).join('')}</div><div class="lab-output" data-output>点击设备查看分类理由。</div>`,
      bottleneck: `<div class="lab-controls" data-task-choice>${['同时开很多程序','大型3D游戏','复制超大文件','单线程旧软件'].map((x,i)=>`<button type="button" data-task="${i}">${x}</button>`).join('')}</div><div class="lab-output" data-output>选择任务。这里给出“优先排查项”，不是宣称只有一个因素。</div>`,
      'media-size': `<div class="lab-controls"><select data-audio-rate><option value="44100">44.1 kHz</option><option value="48000" selected>48 kHz</option><option value="96000">96 kHz</option></select><select data-audio-depth><option value="16" selected>16 bit</option><option value="24">24 bit</option></select><select data-audio-channel><option value="1">单声道</option><option value="2" selected>双声道</option></select><input data-audio-time type="number" value="60" min="1" aria-label="秒数"><input data-audio-ratio type="number" value="4" min="1" aria-label="压缩比"><button type="button" data-run-media>计算</button></div><div class="lab-output" data-output></div>`,
      'ct-workflow': `<div class="lab-controls" data-ct-choice>${['判断是否发热','安排一周复习','给照片美化'].map((x,i)=>`<button type="button" data-ct="${i}">${x}</button>`).join('')}</div><div class="lab-output" data-output>选择一个问题，查看怎样抽象成可计算结构。</div>`,
      'algorithm-runner': `<div class="lab-controls"><input data-algo-list value="3,8,1,9,6" aria-label="整数列表"><input data-algo-threshold type="number" value="5" aria-label="阈值"><button type="button" data-run-algo>运行</button></div><div class="lab-output" data-output></div>`
    };
    return bodies[type] || '';
  }

  function bindCoreEvents() {
    $$('[data-module-state]').forEach(button => button.addEventListener('click', () => {
      const id = button.dataset.moduleState;
      state[id] = button.dataset.state;
      saveState();
      $$(`[data-module-state="${id}"]`).forEach(item => {
        item.classList.toggle('active', item.dataset.state === state[id]);
        item.setAttribute('aria-pressed', String(item.dataset.state === state[id]));
      });
      const directoryLink = $(`[data-directory-module="${id}"]`);
      if (directoryLink) directoryLink.dataset.state = state[id];
      updateProgress();
      applySearch();
    }));

    const open = () => { $('#directory-panel').classList.add('open'); $('#directory-scrim').classList.add('open'); $('#open-directory').setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; setTimeout(() => $('#directory-search-input').focus(), 120); };
    const close = () => { $('#directory-panel').classList.remove('open'); $('#directory-scrim').classList.remove('open'); $('#open-directory').setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; };
    $('#open-directory').addEventListener('click', open);
    $('#close-directory').addEventListener('click', close);
    $('#directory-scrim').addEventListener('click', close);
    $('#directory-nav').addEventListener('click', event => { if (event.target.closest('a')) close(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); if (event.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) { event.preventDefault(); $('#content-search').focus(); } });

    $('#content-search').addEventListener('input', applySearch);
    $('#directory-search-input').addEventListener('input', applyDirectorySearch);
    $('#weak-only').addEventListener('change', applyDirectorySearch);
    $('#filter-pills').addEventListener('click', event => {
      const button = event.target.closest('[data-filter]'); if (!button) return;
      activeFilter = button.dataset.filter;
      $$('#filter-pills button').forEach(item => item.classList.toggle('active', item === button));
      applySearch();
    });
    $('#show-weak').addEventListener('click', () => { activeFilter = 'weak'; $('#content-search').value = ''; applySearch(); window.scrollTo({ top: $('#knowledge-content').offsetTop - 110, behavior: 'smooth' }); });
    $('#reset-progress').addEventListener('click', () => {
      if (!confirm('确定清除第一章在本设备上的全部学习标记吗？')) return;
      state = {}; saveState();
      $$('[data-module-state]').forEach(button => { const on = button.dataset.state === 'new'; button.classList.toggle('active', on); button.setAttribute('aria-pressed', String(on)); });
      $$('[data-directory-module]').forEach(link => link.dataset.state = 'new');
      updateProgress(); updateContinue(); applySearch(); toast('学习状态已重置');
    });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const id = visible.target.id; const item = allModules.find(module => module.id === id); if (!item) return;
      localStorage.setItem(LAST_KEY, id); $('#current-module').textContent = `${String(allModules.indexOf(item)+1).padStart(2,'0')} · ${item.title}`;
      updateSectionRail(item.group);
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0,.25,.5] });
    $$('.module-card').forEach(card => observer.observe(card));
  }

  function appendMobileNav() {
    const nav = document.createElement('nav'); nav.className = 'mobile-nav'; nav.setAttribute('aria-label','移动端快捷导航');
    nav.innerHTML = `<a href="#chapter-top"><span>⌂</span>章首</a><button type="button" data-mobile-directory><span>☰</span>目录</button><a id="mobile-continue" href="#concept-1"><span>→</span>继续</a><a href="#chapter-finish"><span>✓</span>状态</a>`;
    document.body.appendChild(nav);
    $('[data-mobile-directory]').addEventListener('click', () => $('#open-directory').click());
  }

  function updateProgress() {
    const mastered = allModules.filter(module => statusOf(module.id) === 'mastered').length;
    const percent = Math.round(mastered / allModules.length * 100);
    $('#mastery-percent').textContent = `${percent}%`;
    $('#progress-ring').style.setProperty('--progress', `${percent * 3.6}deg`);
    $('#directory-progress').textContent = `${mastered} / ${allModules.length}`;
    updateContinue();
  }

  function updateContinue() {
    const last = localStorage.getItem(LAST_KEY);
    const firstWeak = allModules.find(module => statusOf(module.id) !== 'mastered');
    const target = (last && allModules.some(module => module.id === last)) ? allModules.find(module => module.id === last) : firstWeak || allModules[0];
    const link = $('#continue-learning');
    link.href = `#${target.id}`; link.textContent = state[target.id] ? `继续：${target.title}` : `从第1节开始`;
    const mobile = $('#mobile-continue'); if (mobile) mobile.href = `#${target.id}`;
  }

  function updateSectionRail(group) {
    const mastered = group.modules.filter(module => statusOf(module.id) === 'mastered').length;
    const percent = mastered / group.modules.length * 100;
    $('#section-progress').style.width = `${percent}%`;
    $('#section-progress-text').textContent = `${group.short}进度 ${mastered} / ${group.modules.length}`;
  }

  function applySearch() {
    const query = $('#content-search').value.trim().toLowerCase();
    let shown = 0;
    $$('.module-card').forEach(card => {
      const groupMatch = activeFilter === 'all' || activeFilter === 'weak' || activeFilter === card.dataset.group;
      const weakMatch = activeFilter !== 'weak' || statusOf(card.dataset.module) !== 'mastered';
      const textMatch = !query || card.textContent.toLowerCase().includes(query);
      const visible = groupMatch && weakMatch && textMatch;
      card.classList.toggle('search-hidden', !visible); if (visible) shown++;
    });
    $$('.knowledge-group').forEach(group => group.classList.toggle('search-hidden', !$$('.module-card:not(.search-hidden)', group).length));
    $('#result-count').textContent = `显示 ${shown} 个模块`;
  }

  function applyDirectorySearch() {
    const query = $('#directory-search-input').value.trim().toLowerCase(); const weak = $('#weak-only').checked;
    $$('[data-directory-module]').forEach(link => {
      const item = allModules.find(module => module.id === link.dataset.directoryModule);
      const match = (!query || `${item.title} ${item.summary} ${item.memory}`.toLowerCase().includes(query)) && (!weak || statusOf(item.id) !== 'mastered');
      link.classList.toggle('hidden', !match);
    });
    $$('[data-directory-group]').forEach(group => group.hidden = !$$('a:not(.hidden)', group).length);
  }

  function onScroll() {
    const root = document.documentElement; const max = root.scrollHeight - innerHeight;
    $('#reading-progress-bar').style.width = `${max > 0 ? scrollY / max * 100 : 0}%`;
  }

  function bindLabs() {
    bindSimpleLabs();
    bindBaseConverter(); bindStorageConverter(); bindEncoding(); bindImageSize(); bindCycle(); bindMemory(); bindMedia(); bindAlgorithm();
    $$('[data-run-base],[data-run-storage],[data-run-image],[data-run-media],[data-run-algo]').forEach(button => button.click());
    $('[data-encoding-input]').dispatchEvent(new Event('input'));
  }

  function bindSimpleLabs() {
    $('[data-info-choice]').addEventListener('click', event => { const b=event.target.closest('button'); if(!b)return; const clinic=b.dataset.context==='clinic'; setActive(b); output(b, clinic ? '<strong>临床信息：</strong>患者体温39.2℃，高于常见正常范围，提示发热，需要结合症状继续判断。' : '<strong>天气信息：</strong>环境气温39.2℃，属于高温天气，需要关注中暑风险。'); });
    $('[data-generation]').addEventListener('click', event => { const b=event.target.closest('button'); if(!b)return; setActive(b); const rows=[['第一代','电子管','ENIAC是代表之一；体积大、功耗高。'],['第二代','晶体管','可靠性提高，体积和功耗下降。'],['第三代','中小规模集成电路','多个元件集成在芯片上，操作系统进一步发展。'],['第四代','大规模/超大规模集成电路','微处理器出现并推动微型计算机普及。']]; const r=rows[+b.dataset.gen]; output(b, `<span class="result-big">${r[0]} · ${r[1]}</span>${r[2]}`); });
    const classOptions={use:['通用计算机','专用计算机'],data:['数字计算机','模拟计算机','混合计算机'],scale:['巨型机','大型机','小型机','微型机']};
    const classAnswer={use:'专用计算机',data:'数字计算机',scale:'不由题干确定'};
    const classSelect=$('[data-class-standard]'), classGrid=$('[data-class-options]');
    const drawClass=()=>{const k=classSelect.value; classGrid.innerHTML=classOptions[k].map(x=>`<button type="button" data-class="${x}">${x}</button>`).join('')+(k==='scale'?'<button type="button" data-class="不由题干确定">信息不足</button>':''); output(classSelect,'请选择。题干对象是“天气数值预报专用机”。');};
    classSelect.addEventListener('change',drawClass); classGrid.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const answer=classAnswer[classSelect.value],ok=b.dataset.class===answer; b.classList.add(ok?'correct':'wrong'); output(b,ok?`<strong>正确：</strong>按当前标准应判断为“${answer}”。`:`<strong>不对：</strong>按当前标准应判断为“${answer}”。同一对象换标准会得到另一种归类。`);}); drawClass();
    $('[data-bus-question]').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return; const names={address:'地址总线',data:'数据总线',control:'控制总线'}; setActive(b); output(b,`<span class="result-big">${names[b.dataset.bus]}</span>分类依据是传递信息的性质。`);});
    const devices={扫描仪:'主要输入设备：把纸面图像送入计算机。',显示器:'主要输出设备：把处理结果呈现给用户。',触摸屏:'输入/输出设备：既显示，又接收触控坐标。',SSD:'外存储器，也执行读写式输入/输出；不要硬塞进“纯输入”或“纯输出”。'};
    $('[data-device-question]').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return; setActive(b); output(b,`<strong>${b.dataset.device}：</strong>${devices[b.dataset.device]}`);});
    const tasks=[['内存容量与后台占用','如果CPU并不繁忙却频繁换页，优先检查内存。'],['GPU、显存与CPU协同','大型3D游戏还受分辨率、散热和优化影响。'],['存储顺序吞吐与接口','源盘、目标盘、接口和文件系统都可能成为瓶颈。'],['CPU单核性能与程序效率','核心更多未必能让不能并行的旧软件同比加速。']];
    $('[data-task-choice]').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return; setActive(b); const t=tasks[+b.dataset.task]; output(b,`<span class="result-big">优先看：${t[0]}</span>${t[1]}`);});
    const ct=[['输入：体温与测量条件','输出：是否达到设定发热阈值','约束：年龄、部位、误差和临床标准'],['输入：可用时间、任务、截止日','输出：每天的任务安排','约束：课程、睡眠、任务依赖与缓冲'],['输入：原图和目标效果','输出：处理后图像','约束：分辨率、真实度、版权和文件格式']];
    $('[data-ct-choice]').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;setActive(b);output(b,`<strong>${b.textContent}</strong><br>${ct[+b.dataset.ct].join('<br>')}<br><br>抽象保留了影响结果的变量，没有保留无关细节。`);});
  }

  function bindBaseConverter() {
    $('[data-run-base]').addEventListener('click', event => {
      const lab=event.target.closest('.lab'),raw=$('[data-base-input]',lab).value.trim().toUpperCase(),from=+$('[data-base-from]',lab).value,to=+$('[data-base-to]',lab).value;
      try { const decimal=parseBaseNumber(raw,from); const result=formatBaseNumber(decimal,to,12); const step=from===10?`十进制数按目标基数处理；小数部分最多演示12位。`:`先按位权展开得到十进制 ${fmt(decimal)}，再转为${to}进制。`; output(event.target,`<span class="result-big">${raw}<sub>${from}</sub> = ${result}<sub>${to}</sub></span>${step}`); }
      catch(err){output(event.target,`<strong>无法转换：</strong>${err.message}`);}
    });
  }
  function parseBaseNumber(raw,base){if(!raw)throw new Error('请输入数字。');const parts=raw.split('.');if(parts.length>2)throw new Error('只能有一个小数点。');const digits='0123456789ABCDEF';let value=0;for(const ch of(parts[0]||'0')){const d=digits.indexOf(ch);if(d<0||d>=base)throw new Error(`“${ch}”不是${base}进制数码。`);value=value*base+d;}let factor=1/base;for(const ch of(parts[1]||'')){const d=digits.indexOf(ch);if(d<0||d>=base)throw new Error(`“${ch}”不是${base}进制数码。`);value+=d*factor;factor/=base;}return value;}
  function formatBaseNumber(value,base,max){const digits='0123456789ABCDEF';let integer=Math.floor(value),int='';do{int=digits[integer%base]+int;integer=Math.floor(integer/base);}while(integer);let fraction=value-Math.floor(value),frac='';for(let i=0;i<max&&fraction>1e-12;i++){fraction*=base;const d=Math.floor(fraction+1e-12);frac+=digits[d];fraction-=d;}return int+(frac?'.'+frac:'');}

  function bindStorageConverter(){ $('[data-run-storage]').addEventListener('click',e=>{const lab=e.target.closest('.lab'),v=+$('[data-storage-value]',lab).value,from=$('[data-storage-from]',lab).value,to=$('[data-storage-to]',lab).value;if(!Number.isFinite(v)||v<0)return output(e.target,'请输入非负数。');if(from==='Mbps'&&to==='MB/s')return output(e.target,`<span class="result-big">${fmt(v/8)} MB/s</span>${fmt(v)} Mbit/s ÷ 8 = ${fmt(v/8)} MB/s（未扣除协议等损耗）。`);if(from==='Mbps'||to==='MB/s')return output(e.target,'Mbps与MB/s是速率单位，这里只提供二者直接换算；容量请选bit、Byte、KB、MB或GB。');const bits={bit:1,Byte:8,KB:8*1024,MB:8*1024**2,GB:8*1024**3};const r=v*bits[from]/bits[to];output(e.target,`<span class="result-big">${fmt(r)} ${to}</span>${v} ${from} × ${fmt(bits[from]/bits[to])} = ${fmt(r)} ${to}`);}); }
  function bindEncoding(){ $('[data-encoding-input]').addEventListener('input',e=>{const value=e.target.value,rows=[...value].map(ch=>{const cp=ch.codePointAt(0),bytes=[...new TextEncoder().encode(ch)].map(b=>b.toString(16).padStart(2,'0').toUpperCase()).join(' ');return `<tr><td>${ch===' '?'空格':ch}</td><td>U+${cp.toString(16).padStart(4,'0').toUpperCase()}</td><td>${bytes}</td><td>${new TextEncoder().encode(ch).length}</td></tr>`;}).join('');output(e.target,value?`<table class="mini-table"><thead><tr><th>字符</th><th>Unicode码点</th><th>UTF-8字节（十六进制）</th><th>字节数</th></tr></thead><tbody>${rows}</tbody></table>`:'请输入字符。');}); }
  function bindImageSize(){ $('[data-run-image]').addEventListener('click',e=>{const lab=e.target.closest('.lab'),w=+$('[data-image-w]',lab).value,h=+$('[data-image-h]',lab).value,d=+$('[data-image-depth]',lab).value;if(!w||!h)return output(e.target,'像素尺寸必须大于0。');const bytes=w*h*d/8,mib=bytes/1024**2;output(e.target,`<span class="result-big">约 ${fmt(mib)} MiB</span>${fmt(w)} × ${fmt(h)} × ${d} bit ÷ 8 = ${fmt(bytes)} Byte。未计文件头，也未压缩。`);}); }
  function bindCycle(){let step=0;$('[data-cycle-next]').addEventListener('click',e=>{const nodes=$$('.step-node',e.target.closest('.lab'));step=(step+1)%nodes.length;nodes.forEach((n,i)=>n.classList.toggle('active',i===step));const notes=['PC给出下一条指令地址。','控制器从存储器取指，送入指令寄存器。','译码器识别操作码、操作数或地址信息。','相关部件完成运算、传输或存储访问。','结果和状态被保存，PC指向后续指令。'];output(e.target,`<strong>第${step+1}步：</strong>${notes[step]}`);});}
  function bindMemory(){let picks=[];$('[data-memory-choice]').addEventListener('click',e=>{const b=e.target.closest('button');if(!b||picks.includes(b.dataset.memory))return;picks.push(b.dataset.memory);b.classList.add('active');const answer=['寄存器','Cache','主存','外存'];const ok=picks.every((x,i)=>x===answer[i]);if(!ok){output(b,`<strong>顺序中断：</strong>正确主链是寄存器 → Cache → 主存 → 外存。`);$$('[data-memory]',b.parentElement).forEach(x=>x.classList.remove('active'));picks=[];}else if(picks.length===4)output(b,`<span class="result-big">排列正确</span>速度通常递减，容量通常递增。`);else output(b,`前${picks.length}层正确，请继续。`);});}
  function bindMedia(){ $('[data-run-media]').addEventListener('click',e=>{const lab=e.target.closest('.lab'),rate=+$('[data-audio-rate]',lab).value,depth=+$('[data-audio-depth]',lab).value,ch=+$('[data-audio-channel]',lab).value,time=+$('[data-audio-time]',lab).value,ratio=+$('[data-audio-ratio]',lab).value;if(time<=0||ratio<1)return output(e.target,'时长需大于0，压缩比不能小于1。');const raw=rate*depth*ch*time/8/1024**2,compressed=raw/ratio;output(e.target,`<span class="result-big">原始约 ${fmt(raw)} MiB</span>${fmt(rate)} × ${depth} bit × ${ch}声道 × ${time}秒 ÷ 8 ÷ 1024²。<br>若压缩比约${ratio}:1，压缩后约 <strong>${fmt(compressed)} MiB</strong>；实际大小还受编码器与内容影响。`);}); }
  function bindAlgorithm(){ $('[data-run-algo]').addEventListener('click',e=>{const lab=e.target.closest('.lab'),values=$('[data-algo-list]',lab).value.split(',').map(x=>Number(x.trim())).filter(Number.isFinite),threshold=+$('[data-algo-threshold]',lab).value;if(!values.length)return output(e.target,'请输入用英文逗号分隔的整数。');let count=0,trace=[];for(const value of values){const hit=value>threshold;if(hit)count++;trace.push(`${value}${hit?' > ':' ≤ '}${threshold}${hit?'，计数+1':''}`);}output(e.target,`<span class="result-big">结果：${count}个数大于${threshold}</span><code>count ← 0<br>FOR 每个数 x<br>　IF x &gt; ${threshold} THEN count ← count + 1</code><br><br>${trace.join('；')}。<br>这里同时出现顺序、分支和循环；扫描${values.length}个输入，时间随输入数量线性增长，可记作 O(n)，额外只使用计数器等少量变量，可记作 O(1) 额外空间。`);}); }

  function setActive(button){$$('button',button.parentElement).forEach(b=>b.classList.toggle('active',b===button));}
  function output(source,html){const lab=source.closest('.lab');const el=$('[data-output]',lab);if(el)el.innerHTML=html;}
  function toast(message){let el=$('.toast');if(!el){el=document.createElement('div');el.className='toast';document.body.appendChild(el);}el.textContent=message;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),1800);}

  render();
})();
