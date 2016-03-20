'use strict'

var expect = require('chai').expect;
var request = require('supertest');
var mongoose = require('mongoose');

var app = require('../../app');
var db = require('../../test_helpers/db');
var User = require('../../models/user');

describe('User routes', function() {
  db();

  describe('#signup', function() {
    it('should require an email address', function(done) {
      request(app)
        .post('/users/signup')
        .send({email: null, password: 'password'})
        .expect(422)
        .end(function(err, res) {
          if (err) return done(err);

          // Error should be empty.
          expect(err).to.equal(null);

          done();
        })
      ;
    });

    it('should require a password', function(done) {
      request(app)
        .post('/users/signup')
        .send({email: 'test@example.com', password: null})
        .expect(422)
        .end(function(err, res) {
          if (err) return done(err);

          // Error should not be empty.
          expect(err).to.equal(null);

          done();
        })
      ;
    });

    it('should create a user', function(done) {
      request(app)
        .post('/users/signup')
        .send({email: 'test@example.com', password: 'password'})
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);

          // Error should be empty.
          expect(err).to.equal(null);

          // Response should have been successful.
          expect(res.body.success).to.equal(true);

          // Response should include user object.
          expect(res.body.user).to.be.an('object');

          // User object should include email address.
          expect(res.body.user.email).to.equal('test@example.com');

          // User object should have password filtered out.
          expect(res.body.user.password).to.equal(undefined);

          done();
        })
      ;
    });

    it('should not create a duplicate user', function(done) {
      var userParams = {email: 'text@example.com', password: 'password'};

      User.create(userParams, function(err, result) {
        if (err) return done(err);

        request(app)
          .post('/users/signup')
          .send(userParams) // Try to create another user with same params
          .expect(422)
          .end(function(err, res) {
            if (err) return done(err);

            // Error should be empty.
            expect(err).to.equal(null);

            // Response should be unsuccessful.
            expect(res.body.success).to.equal(false);

            // Response should have an error message.
            expect(res.body.error).to.equal('That email address is already in use.');

            // Response should not include user object.
            expect(res.body.user).to.equal(undefined);

            done();
          })
        ;
      });
    });
  });
});
