const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');

chai.use(chaiHttp);
const { expect } = chai;

describe('Autenticação', () => {
  it('deve fazer login com credenciais válidas', (done) => {
    chai.request(app)
      .post('/auth/login')
      .send({ username: 'admin', password: 'password' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('autenticado', true);
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('não deve fazer login com credenciais inválidas', (done) => {
    chai.request(app)
      .post('/auth/login')
      .send({ username: 'admin', password: 'wrong' })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('message', 'Credenciais inválidas');
        done();
      });
  });
});