const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');

chai.use(chaiHttp);
const { expect } = chai;

describe('Auth', () => {
  it('should login with valid credentials', (done) => {
    chai.request(app)
      .post('/auth/login')
      .send({ username: 'admin', password: 'password' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('auth', true);
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('should not login with invalid credentials', (done) => {
    chai.request(app)
      .post('/auth/login')
      .send({ username: 'admin', password: 'wrong' })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('message', 'Invalid credentials');
        done();
      });
  });
});