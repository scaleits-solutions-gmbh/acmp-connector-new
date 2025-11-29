import { FindClientByIdIn } from './find-client-by-id.in';
import { FindClientByIdOut } from './find-client-by-id.out';

export interface FindClientByIdQueryPrimaryPort {
  execute(input: FindClientByIdIn): Promise<FindClientByIdOut>;
}
