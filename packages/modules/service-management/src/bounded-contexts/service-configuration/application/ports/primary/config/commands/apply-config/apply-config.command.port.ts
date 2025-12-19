import { ApplyConfigCommandIn } from './apply-config.command.in';
import { ApplyConfigCommandOut } from './apply-config.command.out';

export interface ApplyConfigCommandPrimaryPort {
  execute(input: ApplyConfigCommandIn): Promise<ApplyConfigCommandOut>;
}
