import type {
  barChartConfigType,
  chartConfigType,
  normalChartConfigType,
  pieChartConfigType,
  quantileRadarChartConfigType,
  radarChartConfigType,
  seasonalChartConfigType,
  structuralChartConfigType,
} from '/#/chart';
import { today, yearsAgo } from '/@/utils/dateUtil';
import { timeConfigEnum, chartTypeEnum, structuralOffsetUnitEnum } from '/@/enums/chartEnum';
import { quotaDataPastUnitTypeEnum } from '/@/api/quota';
import { h, onMounted, Ref, ref, render, unref } from 'vue';
import Icon from '/@/components/Icon';

export function getChartDefaultConfig(type: chartTypeEnum): chartConfigType {
  const defaultConfig = {
    normal: {
      title: '',
      name: '',
      timeConfig: {
        startDate: yearsAgo(5),
        endDate: today(),
        type: timeConfigEnum.default,
        sortMonth: [],
        startMonth: 1,
        sortYear: [],
        pastUnit: quotaDataPastUnitTypeEnum.last,
        pastValue: 0,
      },
      selfColorScheme: '',
      type: chartTypeEnum.normal,
      showLastest: true,
      showHighest: false,
      quotaList: [],
      valueFormatter: {
        afterDot: 2,
        normalized: false,
      },
      yAxis: [
        {
          min: undefined,
          max: undefined,
          inverse: false,
          offset: 0,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#999999',
            },
          },
          position: 'left',
          axisLabel: {
            formatter: '{value}',
          },
        },
      ],
      seriesSetting: [],
    } as normalChartConfigType,
    seasonal: {
      title: '',
      name: '',
      timeConfig: {
        startDate: yearsAgo(5),
        endDate: today(),
        type: timeConfigEnum.default,
        sortMonth: [],
        startMonth: 1,
        sortYear: [],
        pastUnit: quotaDataPastUnitTypeEnum.last,
        pastValue: 0,
      },
      selfColorScheme: '',
      type: chartTypeEnum.seasonal,
      showLastest: true,
      showHighest: false,
      quotaList: [],
      valueFormatter: {
        afterDot: 2,
        normalized: false,
      },
      yAxis: [
        {
          min: undefined,
          max: undefined,
          inverse: false,
          offset: 0,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#999999',
            },
          },
          position: 'left',
          axisLabel: {
            formatter: '{value}',
          },
        },
      ],
      seriesSetting: [],
    } as seasonalChartConfigType,
    bar: {
      title: '',
      name: '',
      timeConfig: {
        startDate: yearsAgo(1),
        endDate: today(),
        type: timeConfigEnum.default,
        pastUnit: quotaDataPastUnitTypeEnum.last,
        pastValue: 3,
        startMonth: 1,
      },

      selfColorScheme: '',
      type: chartTypeEnum.bar,
      showLastest: true,
      showHighest: false,
      quotaList: [],
      valueFormatter: {
        afterDot: 2,
        normalized: false,
      },
      yAxis: [
        {
          min: undefined,
          max: undefined,
          inverse: false,
          offset: 0,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#999999',
            },
          },
          position: 'left',
          axisLabel: {
            formatter: '{value}',
          },
        },
      ],
      seriesSetting: [],
    } as barChartConfigType,
    normalRadar: {
      title: '',
      name: '',
      timeConfig: {
        startDate: yearsAgo(1),
        endDate: today(),
        type: timeConfigEnum.default,
        pastUnit: quotaDataPastUnitTypeEnum.last,
        pastValue: 3,
      },
      selfColorScheme: '',
      type: chartTypeEnum.normalRadar,
      showLastest: true,
      showHighest: false,
      quotaList: [],
      valueFormatter: {
        afterDot: 2,
        normalized: false,
      },
      seriesSetting: [],
    } as radarChartConfigType,
    quantileRadar: {
      title: '',
      name: '',
      timeConfig: {
        startDate: yearsAgo(5),
        endDate: today(),
        type: timeConfigEnum.default,
      },

      selfColorScheme: '',
      type: chartTypeEnum.quantileRadar,
      showLastest: false,
      showHighest: false,
      quotaList: [],
      valueFormatter: {
        afterDot: 2,
        normalized: false,
      },
      quantileOffset: '1,2,3,5',
      seriesSetting: [],
    } as quantileRadarChartConfigType,
    structural: {
      title: '',
      name: '',
      timeConfig: {
        startDate: yearsAgo(1),
        endDate: today(),
        type: timeConfigEnum.default,
        pastUnit: quotaDataPastUnitTypeEnum.last,
        pastValue: 3,
      },

      selfColorScheme: '',
      type: chartTypeEnum.structural,
      showLastest: true,
      showHighest: false,
      quotaList: [],
      valueFormatter: {
        afterDot: 2,
        normalized: false,
      },
      structuralOffset: '30,15,7,1,0',
      structuralOffsetUnit: structuralOffsetUnitEnum.natureDay,
      yAxis: [
        {
          min: undefined,
          max: undefined,
          inverse: false,
          offset: 0,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#999999',
            },
          },
          position: 'left',
          axisLabel: {
            formatter: '{value}',
          },
        },
      ],
      seriesSetting: [],
    } as structuralChartConfigType,
    pie: {
      title: '',
      name: '',
      timeConfig: {
        startDate: yearsAgo(1),
        endDate: today(),
        type: timeConfigEnum.default,
        pastUnit: quotaDataPastUnitTypeEnum.last,
        pastValue: 1,
      },

      selfColorScheme: '',
      type: chartTypeEnum.pie,
      showLastest: true,
      showHighest: false,
      quotaList: [],
      valueFormatter: {
        afterDot: 2,
        normalized: false,
      },
      seriesSetting: [],
    } as pieChartConfigType,
  };
  return defaultConfig[type];
}

export function useDrawer(container: Ref<HTMLElement | undefined>) {
  const containerHidden = ref(false);
  const icon = h(Icon, {
    icon: 'ant-design:right-outlined',
    class: 'arrow-icon',
  });
  const line = h(
    'div',
    {
      onClick: hide,
      class: 'line',
    },
    [icon],
  );
  function init() {
    const parent = unref(container)!;
    render(line, parent);
    const shadow = document.createElement('div') as HTMLElement;
    const startWidth = `${parent.offsetWidth}px`;
    const startHeight = `${parent.offsetHeight}px`;
    Object.assign(shadow.style, {
      width: startWidth,
      height: '100%',
      transition: 'width .3s',
    });
    Object.assign(parent.style, {
      width: startWidth,
      height: startHeight,
      position: 'absolute',
      right: '1rem',
      transition: 'right .3s',
    });
    shadow.className = 'shadow-box';
    parent.parentElement?.appendChild(shadow);
  }
  function hide() {
    const parent = unref(container)!;
    const line = parent.getElementsByClassName('line')[0] as HTMLElement;
    const shadow = parent.parentElement?.getElementsByClassName('shadow-box')[0] as HTMLElement;
    const startWidth = parent.offsetWidth;
    const remainWidth = line.offsetWidth;
    if (containerHidden.value) {
      // 移动本体，缩小影子
      parent.style.right = '1rem';
      shadow.style.width = `${startWidth}px`;
      line.classList.remove('gray-shadow');
      line.classList.add('hover-gray-shadow');
      containerHidden.value = false;
    } else {
      parent.style.right = `calc(-${startWidth - remainWidth}px + 1rem)`;
      shadow.style.width = `${remainWidth}px`;
      line.classList.remove('hover-gray-shadow');
      line.classList.add('gray-shadow');
      containerHidden.value = true;
    }
    icon.el!.classList.toggle('rotate');
  }
  onMounted(init);
}
