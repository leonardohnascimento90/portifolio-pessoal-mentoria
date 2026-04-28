const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');

chai.use(chaiHttp);
const { expect } = chai;

describe('Tools', () => {
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

  it('should get all tools', (done) => {
    chai.request(app)
      .get('/tools')
      .set('Authorization', token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should get tool by id', (done) => {
    chai.request(app)
      .get('/tools/1')
      .set('Authorization', token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('id', 1);
        done();
      });
  });
});