export default {
  quotaView: {
    uniqSelectedQuotaMessage: '选过了',
    toolbar: {
      paintBtn: '绘制',
      saveBtn: '保存',
      saveCopy: '另存为',
      chartTypeSelectPlaceholer: '图表类型',
      chartTypeList: {
        // 单指标季节性序列
        seasonal: '季节性',
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
      advanceDrawerTitle: '高级设置',
    },
    seriesType: {
      line: '折线图',
      bar: '柱状图',
      smoothLine: '平滑曲线图',
      scatter: '散点图',
      area: '面积图',
    },
    quotaSetting: {
      modalTitle: '指标设置',
      name: '指标名称',
      sourceCode: '指标代码',
      sourceType: '指标来源',
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
        scientificNotation: '科学计数法',
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
          lastnotdel: '最后一个Y轴了',
          tip: '新增的轴若最大值最小值均自动，则此轴未被使用时不显示',
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
        },
        sortMonth: '按月过滤',
        startMonth: '季节性序列起点选为',
        startMonthTip: '季节性序列起点月份设置错误',
        sortYear: '按年过滤',
        structuralOffset: '曲线结构日期偏移量',
        structuralOffsetUnit: '曲线结构日期偏移单位',
        structuralOffsetTip: '使用英文逗号分隔，数量不限',
      },
    },
  },
  chart: {
    index: '第',
    unit: '期',
  },
};
