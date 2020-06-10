const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { userOne, userTwo, taskOne, taskTwo, taskThree, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks/')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From my test'
        })
        .expect(201)
    
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('Should not create task with invalid description', async () => {
    await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: {}
        })
        .expect(400)
})

test('Should not create task with invalid completed field', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            completed: 2
        })
        .expect(400)
})

test('Should fetch user tasks', async () => {
    const response = await request(app)
        .get('/tasks/')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)

    expect(response.body.length).toEqual(2)
})

// Should fetch only completed tasks
test('Should fetch only completed tasks', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .query({
            completed: true
        })
        .send()
        .expect(200)

    expect(response.body.length).toEqual(1)
})

test('Should fetch only incomplete tasks', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .query({
            completed: false
        })
        .send()
        .expect(200)

    expect(response.body.length).toEqual(1)
})

test('Should fetch user task by id', async () => {
    const response = await request(app)
        .get(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body).not.toBeNull()
    expect(response.body.description).toEqual(taskOne.description)
})

test('Should not fetch user task by id if unauthenticated', async () => {
    await request(app)
        .get('/tasks')
        .send()
        .expect(401)
})

// Should not fetch other users task by id
test('Should not fetch other users task by id', async () => {
    await request(app)
        .get(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
})

test('Should fetch page of tasks', async () => {    
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .query({
            limit: 1
        })
        .send()
        .expect(200)

    expect(response.body.length).toEqual(1)
})
test('Should sort tasks by description', async () => {
    await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .query({
            sortBy: 'description:desc'
        })
        .send()
        .expect(200)
})

test('Should sort tasks by completed', async () => {    
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .query({
            sortBy: 'completed:desc'
        })
        .send()
        .expect(200)
})

test('Should sort tasks by createdAt', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .query({
            sortBy: 'createdAt'
        })
        .send()
        .expect(200)
})

test('Should sort tasks by updatedAt', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .query({
            sortBy: 'updatedAt'
        })
        .send()
        .expect(200)
})

test('Should delete user task', async () => {
    request(app)
        .delete('/tasks/' + taskOne._id)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not delete user task if authenticated', async () => {
    request(app)
        .delete('/tasks/' + taskOne._id)
        .send()
        .expect(404)
})

test('Should not delete other users tasks', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .expect(404)

    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})


test('Should not update other users task', async () => {
    await request(app)
        .patch(`/tasks/${taskThree._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            completed: true
        })
        .expect(404)
})

// Should not update task with invalid description/completed
test('Should not update task with invalid description', async () => {
    request(app)
        .patch(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 2
        })
        .expect(400)
})

test('Should not update task with invalid completed', async () => {
    request(app)
        .patch(`tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            completed: 2
        })
        .expect(400)
})

//
// Task Test Ideas
//






// Should fetch page of tasks