const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');

chai.use(chaiHttp);
const { expect } = chai;

let token;

describe('Autenticação', () => {

  it('deve fazer login com credenciais válidas', (done) => {
    chai.request(app)
      .post('/auth/login')
      .send({ username: 'admin', password: 'password' })
      .end((err, res) => {
        if (err) return done(err);

        expect(res).to.have.status(200);
        expect(res).to.have.header('content-type');

        expect(res.body).to.have.property('autenticado', true);
        expect(res.body).to.have.property('token');

        expect(res.body.token).to.be.a('string');
        expect(res.body.token.length).to.be.greaterThan(10);

        token = res.body.token;

        done();
      });
  });

  it('não deve fazer login com credenciais inválidas', (done) => {
    chai.request(app)
      .post('/auth/login')
      .send({ username: 'admin', password: 'wrong' })
      .end((err, res) => {
        if (err) return done(err);

        expect(res).to.have.status(401);
        expect(res.body).to.have.property('message', 'Credenciais inválidas');

        done();
      });
  });

  it('não deve fazer login sem enviar dados', (done) => {
    chai.request(app)
      .post('/auth/login')
      .send({})
      .end((err, res) => {
        if (err) return done(err);

        // ✅ CORREÇÃO AQUI (400 ao invés de 401)
        expect(res).to.have.status(400);

        expect(res.body).to.have.property('message');

        done();
      });
  });

});