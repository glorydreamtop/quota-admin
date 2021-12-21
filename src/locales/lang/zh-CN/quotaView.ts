export default {
  uniqSelectedQuotaMessage: '选过了',
  quotaList: {
    formula: '添加公式',
    updateQuota: '更新选中指标',
    checkAll: '全选/取消全选',
    delChecked: '移除选中',
    cardUI: '切换到卡片视角',
    listUI: '切换到列表视角',
    getXLSX: '数据导出为表格',
  },
  toolbar: {
    paintBtn: '绘制',
    saveBtn: '保存',
    saveCopy: '另存为',
    chartTypeSelectPlaceholer: '图表类型',
    chartTypeList: {
      // 单指标季节性序列
      seasonal: '单指标季节性',
      // 单指标季节性农历序列
      seasonalLunar: '季节性农历',
      // 多指标定基序列
      fixedbase: '定基',
      // 多指标柱状图
      bar: '柱状图',
      // 普通多指标数据序列
      normal: '多指标数据',
      // 普通多指标雷达图
      normalRadar: '多指标最新值',
      // 多指标分位数雷达图
      quantileRadar: '多指标分位数',
      // 多指标曲线结构折线图
      structural: '曲线结构',
      // 多指标单饼图
      pie: '多指标比例',
    },
    startDatePicker: '选择开始日期',
    endDatePicker: '选择结束日期',
    year: '年',
    month: '月',
    week: '周',
    day: '日',
    advanceDrawerTitle: '高级设置',
    downloadImg: '保存图片',
    downloadXLSX: '导出表格',
    noQuotaListTip: '至少勾选一个指标',
    tableView: '数据表格',
    chartView: '回到图表',
    quotaDataTableHeader: {
      date: '日期',
    },
    realTimeSave: '实时保存成功',
  },
  seriesType: {
    line: '折线图',
    bar: '柱状图',
    smoothLine: '平滑曲线图',
    scatter: '散点图',
    area: '面积图',
  },
  quotaSetting: {
    formulaModalTitle: '公式编辑',
    modalTitle: '指标设置',
    name: '指标名称',
    sourceCode: '指标代码',
    sourceType: '指标来源',
    formula: '公式编辑',
    autofill: '快捷填充',
    autofillTip: '公式指标点击左半区可获取公式内容',
    formulaWithoutId: '临时公式没有ID',
    noName: '需要一个名字',
    setting: {
      yAxisIndex: '适用Y轴',
      type: '适用图形',
    },
  },
  advance: {
    show: '显示',
    hide: '隐藏',
    use: '启用',
    stop: '停用',
    rectSetting: {
      title: '模块设置',
      lastest: '最新值',
      highest: '最高值',
    },
    valueFormatter: {
      title: '数字格式设置',
      afterDot: '位小数',
      normalized: '初值归一',
    },
    timeSeries: {
      title: '时间序列设置',
      startMonth: '起始月份',
    },
    axisSetting: {
      title: '直角坐标轴设置',
      yAxis: {
        index: '序号',
        min: '最小值',
        max: '最大值',
        position: '位置',
        inverse: '逆序',
        createY: '创建Y轴',
        left: '左',
        right: '右',
        offset: '偏移',
        offsetTip: '如非轴显示重叠，请勿手动修改智能推断值',
        showLine: '显示轴线',
        magnitude: '数量级',
        lastnotdel: '最后一个Y轴了',
        tip: '新增的轴若最大值最小值均自动，则此轴未被使用时不显示',
        tip2: '已有轴的编辑请直接在图中右键该轴',
        cannotdel: '依赖于本轴，暂不可删除',
      },
    },
    datasourceSetting: {
      title: '获取数据量设置',
      tip: '设为0则是起止日期内全部',
      past: '最近',
      pastUnit: {
        day: '日',
        last: '期',
        month: '月',
        year: '年',
      },
      sortMonth: '按月过滤',
      startMonth: '季节性序列起点选为',
      startMonthTip: '季节性序列起点月份设置错误',
      sortYear: '按年过滤',
      structuralOffset: '曲线结构日期偏移量',
      structuralOffsetUnit: '曲线结构日期偏移单位',
      structuralOffsetTip: '使用英文逗号分隔，数量不限',
      quantileOffset: '多年分位数',
    },
    dataEdit: {
      title: '数据处理',
      startSelect: '开始选择',
      removePoint: '智能抹去',
      xFilter: 'X轴范围',
      xTip: '输入X轴的范围如 2015-02-03<x<2015-03-01,或x=2019-02-01，多段用逗号分隔',
      seriesFilter: '所属序列',
      seriesTip: '先绘图再选择数据所属序列，可多选',
    },
  },
  chart: {
    index: '第',
    inserveIndex: '前',
    unit: '期',
    quantile: '年分位数',
  },

  quotaCard: {
    alldel: '都扔掉了~',
    name: '指标全称',
    id: '指标ID',
    sourceCode: '指标代码',
    shortName: '指标简称',
    updateOn: '更新于',
    calculate: '非指标，实时计算',
    formulaTip: '这只是一个公式，不是公式指标',
    formulaWithoutId: '临时公式',
    contextMenu: {
      edit: '编辑指标',
      copyId: '拷贝指标ID',
      copyShortName: '拷贝指标简称',
      saveInMyFolder: '保存到个人',
      noShortName: '该指标没有录入简称',
    },
  },
  management: {
    search: {
      btn: '高级搜索',
      title: '高级搜索',
    },
    clearData: {
      btn: '清空指标数据',
    },
    move: {
      btn: '批量移动到...',
    },
    calcData: {
      btn: '重算指标数据',
    },
    edit: '编辑指标',
    remove: '移除指标',
    delete: '删除指标',
  },
  seriesEdit: {
    seriesType: '序列类型',
    lineType: '线型',
    lineShadow: '阴影',
    lineWidth: '粗细',
    yAxisIndex: 'Y轴序号',
    xAxisIndex: 'X轴序号',
    seriesTypeList: {
      line: '折线图',
      smoothLine: '曲线图',
      bar: '柱状图',
      scatter: '散点图',
      area: '面积图',
      radar: '雷达图',
      pie: '饼图',
    },
    lineTypeList: {
      solid: '实线',
      dashed: '段虚线',
      dotted: '点虚线',
    },
  },
};
