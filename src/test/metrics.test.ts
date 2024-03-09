import { afterAll, beforeAll, it, describe, beforeEach, expect } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../app'

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

  it('should be able to get metrics', async () => {
    await request(app.server).post('/users/create').send({
      userName: 'username',
      password: 'password',
    })
    const login = await request(app.server).post('/').send({
      userName: 'username',
      password: 'password',
    })
    const completeToken = login.body.token
    const getAllUsers = await request(app.server)
      .get('/users/getAll')
      .set('Authorization', `Bearer ${completeToken}`)
    const userId = getAllUsers.body[0].id
    await request(app.server)
      .post('/meals/create')
      .set('Authorization', `Bearer ${completeToken}`)
      .send({
        name: 'refeição',
        description: 'refeição equilibrada',
        inDiet: true,
      })
    const metrics = await request(app.server)
      .get(`/metrics/${userId}`)
      .set('Authorization', `Bearer ${completeToken}`)
      .expect(200)
    expect(metrics.body.length).toBeGreaterThan(0)
  })
})
