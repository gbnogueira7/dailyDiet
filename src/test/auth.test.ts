import { afterAll, beforeAll, it, describe, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../app'

describe('auth route', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  // eslint-disable-next-line no-unused-expressions
  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it.skip('shoud be able to log whit a user exists', async () => {
    await request(app.server).post('/users/create').send({
      userName: 'testNewDb',
      password: '1234',
    })

    await request(app.server)
      .post('/')
      .send({
        userName: 'testNewDb',
        password: '1234',
      })
      .expect(200)
  })
})
