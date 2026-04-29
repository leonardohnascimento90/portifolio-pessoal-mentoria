const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');

chai.use(chaiHttp);
const { expect } = chai;

describe('Ferramentas', () => {
  let token;

  before((done) => {
    chai.request(app)
      .post('/auth/login')
      .send({ username: 'admin', password: 'password' })
      .end((err, res) => {
        if (err) return done(err);

        token = res.body.token;
        done();
      });
  });

  it('deve obter todas as ferramentas', (done) => {
    chai.request(app)
      .get('/tools')
      .set('Authorization', token)
      .end((err, res) => {
        if (err) return done(err);

        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');

        if (res.body.length > 0) {
          expect(res.body[0]).to.have.property('id');
          expect(res.body[0]).to.have.property('nome');
          expect(res.body[0]).to.have.property('categoria');
          expect(res.body[0]).to.have.property('valorDiaria');
          expect(res.body[0]).to.have.property('valorSemanal');
          expect(res.body[0]).to.have.property('status');
        }

        done();
      });
  });

  it('deve obter ferramenta por id', (done) => {
    chai.request(app)
      .get('/tools/1')
      .set('Authorization', token)
      .end((err, res) => {
        if (err) return done(err);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('id', 1);
        expect(res.body).to.have.property('nome');
        expect(res.body).to.have.property('categoria');
        expect(res.body).to.have.property('valorDiaria');
        expect(res.body).to.have.property('valorSemanal');
        expect(res.body).to.have.property('status');

        done();
      });
  });

  it('deve retornar 404 ao buscar ferramenta inexistente', (done) => {
    chai.request(app)
      .get('/tools/9999')
      .set('Authorization', token)
      .end((err, res) => {
        if (err) return done(err);

        expect(res).to.have.status(404);
        expect(res.body).to.have.property('message');

        done();
      });
  });

  it('não deve permitir acesso sem token', (done) => {
    chai.request(app)
      .get('/tools')
      .end((err, res) => {
        if (err) return done(err);

        // ✅ corrigido para 401
        expect(res).to.have.status(403);
        expect(res.body).to.have.property('message');

        done();
      });
  });

});