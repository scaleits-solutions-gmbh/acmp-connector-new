import { TestSicsConnectionCommandIn } from './test-sics-connection.command.in';
import { TestSicsConnectionCommandOut } from './test-sics-connection.command.out';

export interface TestSicsConnectionCommandPrimaryPort {
  execute(input: TestSicsConnectionCommandIn): Promise<TestSicsConnectionCommandOut>;
}
