import { afterAll, beforeAll, it, describe, beforeEach, expect } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/app'

describe('users routes', () => {
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

  it.skip('should be able to create users', async () => {
    await request(app.server).post('/users/create').send({
      userName: 'testNewDb',
      password: '1234',
    })
    const getToken = await request(app.server).post('/').send({
      userName: 'testNewDb',
      password: '1234',
    })
    const completeToken = getToken.body.token
    const getUsers = await request(app.server)
      .get('/users/getAll')
      .set('Authorization', `Bearer ${completeToken}`)
      .expect(200)
    const user = await getUsers.body[0]
    expect(user.userName).toBe('testNewDb')
  })

  it.skip('should be able to get all users', async () => {
    await request(app.server).post('/users/create').send({
      userName: 'username',
      password: 'password',
    })
    const login = await request(app.server).post('/').send({
      userName: 'username',
      password: 'password',
    })
    const completeToken = login.body.token

    await request(app.server)
      .get('/users/getAll')
      .set('Authorization', `Bearer ${completeToken}`)
      .expect(200)
  })
})
