import { FindJobByIdIn } from './find-job-by-id.in';
import { FindJobByIdOut } from './find-job-by-id.out';

export interface FindJobByIdQueryPrimaryPort {
  execute(input: FindJobByIdIn): Promise<FindJobByIdOut>;
}
