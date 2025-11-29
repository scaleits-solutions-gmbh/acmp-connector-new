import { FindJobCountIn } from './find-job-count.in';
import { FindJobCountOut } from './find-job-count.out';

export interface FindJobCountQueryPrimaryPort {
  execute(input: FindJobCountIn): Promise<FindJobCountOut>;
}
