import { afterAll, beforeAll, it, describe, beforeEach, expect } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/app'

describe('meals routes', () => {
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

  it.skip('should be able to create a meal', async () => {
    // Criar um usuário
    await request(app.server).post('/users/create').send({
      userName: 'userToCreateMeal',
      password: '1234',
    })

    // Obter o token do usuário criado
    const response = await request(app.server).post('/').send({
      userName: 'userToCreateMeal',
      password: '1234',
    })

    const completeToken = response.body.token // Certifique-se de ajustar conforme necessário

    // Criar uma refeição usando o token
    await request(app.server)
      .post('/meals/create')
      .set('Authorization', `Bearer ${completeToken}`)
      .send({
        name: 'banana',
        description: 'fruta',
        inDiet: true,
      })
      .expect(201)
  })

  it.skip('should be able get all meals', async () => {
    // Criar um usuário
    await request(app.server).post('/users/create').send({
      userName: 'userToCreateMeal',
      password: '1234',
    })

    // Obter o token do usuário criado
    const response = await request(app.server).post('/').send({
      userName: 'userToCreateMeal',
      password: '1234',
    })

    const completeToken = response.body.token // Certifique-se de ajustar conforme necessário

    // Criar uma refeição usando o token
    await request(app.server)
      .post('/meals/create')
      .set('Authorization', `Bearer ${completeToken}`)
      .send({
        name: 'banana',
        description: 'fruta',
        inDiet: true,
      })

    const responseGetAll = await request(app.server)
      .get('/meals/getAll')
      .set('Authorization', `Bearer ${completeToken}`)
      .expect(200)

    expect(responseGetAll.body.length).toBeGreaterThan(0)
  })
  it.skip('should be able to get a meals for id', async () => {
    await request(app.server).post('/users/create').send({
      userName: 'userTest777',
      password: '<PASSWORD>',
    })
    const loginResponse = await request(app.server).post('/').send({
      userName: 'userTest777',
      password: '<PASSWORD>',
    })
    const completeToken = loginResponse.body.token
    await request(app.server)
      .post('/meals/create')
      .set('Authorization', `Bearer ${completeToken}`)
      .send({
        name: 'banana',
        description: 'fruta',
        inDiet: true,
      })
    const getAll = await request(app.server)
      .get('/meals/getAll')
      .set('Authorization', `Bearer ${completeToken}`)

    const mealId = getAll.body[0].id

    await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Authorization', `Bearer ${completeToken}`)
    expect(200)
  })
  it.skip('should be able to alter a meals for id', async () => {
    await request(app.server).post('/users/create').send({
      userName: 'userTest777',
      password: '<PASSWORD>',
    })
    const loginResponse = await request(app.server).post('/').send({
      userName: 'userTest777',
      password: '<PASSWORD>',
    })
    const completeToken = loginResponse.body.token
    await request(app.server)
      .post('/meals/create')
      .set('Authorization', `Bearer ${completeToken}`)
      .send({
        name: 'banana',
        description: 'fruta',
        inDiet: true,
      })
    const getAll = await request(app.server)
      .get('/meals/getAll')
      .set('Authorization', `Bearer ${completeToken}`)

    const mealId = getAll.body[0].id

    await request(app.server)
      .put(`/meals/${mealId}/alter`)
      .set('Authorization', `Bearer ${completeToken}`)
      .send({
        name: 'batata',
        description: 'carboidrato',
        inDiet: false,
      })
      .expect(200)
  })
})
