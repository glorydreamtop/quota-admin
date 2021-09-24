import { getQuotaData } from '/@/api/quota';
import { getQuotaDataParams } from '/@/api/quota/model';

export async function fetchQuotaData(params: getQuotaDataParams) {
  const res = await getQuotaData(params);
  return res;
}
