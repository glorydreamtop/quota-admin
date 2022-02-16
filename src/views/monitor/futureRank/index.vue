<template>
  <div class="h-layout-full flex flex-col gap-4 p-4 w-full">
    <div class="flex items-center h-3/5 gap-4">
      <div class="w-60 h-full bg-white shadow-md p-4 flex flex-col gap-2">
        <RadioGroup size="small" v-model:value="searchParams.type" button-style="solid">
          <RadioButton value="contract">{{ t('monitor.futureRank.contract') }}</RadioButton>
          <RadioButton value="productId">{{ t('monitor.futureRank.productName') }}</RadioButton>
        </RadioGroup>
        <AutoComplete
          size="small"
          v-model:value="searchParams.key"
          show-search
          :options="searchParams.searchResult"
          @search="handleSearch"
          @select="handleSelect"
          :placeholder="t('monitor.futureRank.serachPlaceholder')"
        />
        <div class="h-8 pl-2">{{ rankParams.tradeDate }}</div>
        <DatePicker
          :getCalendarContainer="getCalendarContainer"
          valueFormat="YYYY-MM-DD"
          :disabled-date="disabledDate"
          size="small"
          :show-today="false"
          v-model:value="rankParams.tradeDate"
          open
        >
          <div ref="calendar" class="-mt-2"></div>
          <template #dateRender="{ current }">
            <div
              :class="[
                avalidDate.includes(current.format('YYYY-MM-DD')) ? 'avalid-date' : 'disabled',
                current.format('YYYY-MM-DD') === rankParams.tradeDate ? 'selected-date' : '',
              ]"
            >
              {{ current.date() }}
            </div>
          </template>
        </DatePicker>
      </div>
      <div
        class="flex justify-start gap-4 flex-grow h-full children:bg-white children:shadow-md children:h-full children:flex-grow"
      >
        <TopList :data-list="rankList.done" />
        <TopList :data-list="rankList.buy" />
        <TopList :data-list="rankList.sale" />
      </div>
    </div>
    <div class="flex-grow bg-white shadow-md flex items-center justify-between p-4 w-full">
      <RankChart class="w-1/2" :data-list="rankList.buy" :title="chartTitle.buy" :size="10" />
      <RankChart class="w-1/2" :data-list="rankList.sale" :title="chartTitle.sale" :size="10" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, watch, ref } from 'vue';
  import TopList from './components/TopList.vue';
  import RankChart from './components/RankChart.vue';
  import { RankResult } from '/@/api/future/model';
  import { getFutureRankList, getProOrConValidDate, getSearchInfoList } from '/@/api/future';
  import { openInterestEnum } from '/@/enums/monitorEnum';
  import { daysAgo, formatToDate } from '/@/utils/dateUtil';
  import { Radio, AutoComplete, DatePicker } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDebounceFn } from '@vueuse/shared';
  import { cloneDeep } from 'lodash-es';
  import dayjs from 'dayjs';

  const RadioGroup = Radio.Group;
  const RadioButton = Radio.Button;

  const { t } = useI18n();

  const rankList = reactive({
    done: [] as RankResult,
    buy: [] as RankResult,
    sale: [] as RankResult,
  });
  const rankParams = reactive({
    tradeDate: daysAgo(1),
    contract: '',
    productId: 'RB',
  });
  watch(
    rankParams,
    async (val, pre) => {
      if (val.contract !== pre.contract || val.productId !== pre.productId) {
        await updateValidDate();
      }
      await getRankList();
    },
    { deep: true },
  );
  const chartTitle = reactive({
    buy: '买入',
    sale: '持卖量',
  });
  async function getRankList() {
    const params = cloneDeep(rankParams);
    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key) && params[key] === '') {
        Reflect.deleteProperty(params, key);
      }
    }
    rankList.done = await getFutureRankList({ ...params, rankType: openInterestEnum.Done });
    rankList.buy = await getFutureRankList({ ...params, rankType: openInterestEnum.Buy });
    rankList.sale = await getFutureRankList({ ...params, rankType: openInterestEnum.Done });
  }
  const searchParams = reactive({
    type: 'productId',
    key: '',
    typeList: ['productId', 'contract'],
    searchResult: [] as LabelValueOptions,
  });
  async function search() {
    searchParams.searchResult = (
      await getSearchInfoList({
        type: searchParams.typeList.indexOf(searchParams.type),
        key: searchParams.key,
      })
    ).map((item) => {
      if (typeof item === 'string') {
        return { value: item, label: item, key: item };
      } else {
        return { value: item.productName, label: item.productName, key: item.productId };
      }
    });
  }
  const handleSearch = useDebounceFn(search, 300);
  async function handleSelect(value: string) {
    rankParams.productId = '';
    rankParams.contract = '';
    rankParams[searchParams.type] = searchParams.searchResult.find(
      (item) => item.value === value,
    )!.key;
  }
  function disabledDate(cur: dayjs.Dayjs) {
    const date = cur.format('YYYY-MM-DD');
    return !avalidDate.value.includes(date);
  }
  const avalidDate = ref(['']);
  async function updateValidDate() {
    avalidDate.value = (
      await getProOrConValidDate({
        [searchParams.type]: rankParams[searchParams.type],
      })
    ).map((day) => formatToDate(day));
  }
  getRankList();
  updateValidDate();
  const calendar = ref();
  function getCalendarContainer() {
    return calendar.value;
  }
</script>

<style lang="less" scoped>
  ::v-deep(.ant-calendar.ant-calendar-picker-container-content) {
    width: 100%;
    box-shadow: none;
    border: 1px solid #e0e0e0;
  }

  ::v-deep(.ant-calendar-input-wrap) {
    display: none;
  }

  ::v-deep(.ant-calendar-disabled-cell) {
    cursor: not-allowed;
  }

  .avalid-date {
    @apply text-gray-700;

    cursor: pointer;
    text-align: center;
  }

  .disabled {
    background-color: #eee;
    color: #b0b0b0;
    text-align: center;
  }

  .selected-date {
    background-color: rgba(@primary-color, 0.25);
    color: @primary-color;
  }
</style>
