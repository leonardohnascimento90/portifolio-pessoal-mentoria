const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');

chai.use(chaiHttp);
const { expect } = chai;

describe('Reservas', () => {
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

  it('deve obter todas as reservas', (done) => {
    chai.request(app)
      .get('/reservations')
      .set('Authorization', token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('deve criar uma reserva válida', (done) => {
    chai.request(app)
      .post('/reservations')
      .set('Authorization', token)
      .send({ toolId: 1, startDate: '2023-01-01', endDate: '2023-01-02' })
      .end((err, res) => {
        expect(res).to.have.status(201);

        // ✅ ajuste aqui (API em português)
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('ferramentaId');
        expect(res.body).to.have.property('dataInicio');
        expect(res.body).to.have.property('dataFim');
        expect(res.body).to.have.property('status');

        done();
      });
  });

  it('não deve criar reserva com datas inválidas', (done) => {
    chai.request(app)
      .post('/reservations')
      .set('Authorization', token)
      .send({ toolId: 1, startDate: '2023-01-05', endDate: '2023-01-01' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('message');
        done();
      });
  });

  it('não deve criar reserva para ferramenta inexistente', (done) => {
    chai.request(app)
      .post('/reservations')
      .set('Authorization', token)
      .send({ toolId: 999, startDate: '2023-01-01', endDate: '2023-01-02' })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('message');
        done();
      });
  });

  it('não deve permitir conflito de reservas', (done) => {
    // cria primeira reserva
    chai.request(app)
      .post('/reservations')
      .set('Authorization', token)
      .send({ toolId: 1, startDate: '2023-02-01', endDate: '2023-02-05' })
      .end(() => {

        // tenta criar conflito
        chai.request(app)
          .post('/reservations')
          .set('Authorization', token)
          .send({ toolId: 1, startDate: '2023-02-03', endDate: '2023-02-06' })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('message');
            done();
          });
      });
  });

  it('não deve permitir acesso sem token', (done) => {
    chai.request(app)
      .get('/reservations')
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
  });
});