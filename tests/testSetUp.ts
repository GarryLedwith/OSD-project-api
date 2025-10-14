import { initDb } from '../src/database';

beforeAll(async () => {
  console.log('Running before all')
  console.log = () => {};
  await initDb();

});

afterAll(async () => {
  console.log = console.log;
});