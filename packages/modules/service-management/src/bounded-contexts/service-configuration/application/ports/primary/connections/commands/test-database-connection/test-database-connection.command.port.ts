import { TestDatabaseConnectionCommandIn } from './test-database-connection.command.in';
import { TestDatabaseConnectionCommandOut } from './test-database-connection.command.out';

export interface TestDatabaseConnectionCommandPrimaryPort {
  execute(input: TestDatabaseConnectionCommandIn): Promise<TestDatabaseConnectionCommandOut>;
}
