const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');

chai.use(chaiHttp);
const { expect } = chai;

describe('Reservations', () => {
  let token;

  before((done) => {
    chai.request(app)
      .post('/auth/login')
      .send({ username: 'admin', password: 'password' })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  it('should get all reservations', (done) => {
    chai.request(app)
      .get('/reservations')
      .set('Authorization', token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should create a reservation', (done) => {
    chai.request(app)
      .post('/reservations')
      .set('Authorization', token)
      .send({ toolId: 1, startDate: '2023-01-01', endDate: '2023-01-02' })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('id');
        done();
      });
  });
});