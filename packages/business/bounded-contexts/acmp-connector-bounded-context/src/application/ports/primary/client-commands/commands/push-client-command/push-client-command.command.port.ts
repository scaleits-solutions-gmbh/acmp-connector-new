import { PushClientCommandCommandIn } from './push-client-command.command.in';
import { PushClientCommandCommandOut } from './push-client-command.command.out';

export interface PushClientCommandCommandPrimaryPort {
  execute(input: PushClientCommandCommandIn): Promise<PushClientCommandCommandOut>;
}
