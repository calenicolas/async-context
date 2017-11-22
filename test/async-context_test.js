describe('async-context_test', function() {

    var should = require('should');

    var EventEmitter = require('events');

    var context = require('mobile-adk_context');
    var async = require('../index');
    var async_u = require('async-utils');

    var fooObject = {
        bar: 'foobar'
    };

    function assertContextValues() {

        should(context.get('roman')).be.eql(10);
        should(context.get('palermo')).be.eql(9);

        should(context.get('foo')).be.eql(fooObject);

        should(context.get('another')).be.eql(1);
    }

    function one(callback) {

        context.set('roman', 10);
        context.set('palermo', 9);

        context.set('foo', fooObject);

        callback();
    }

    function two(callback) {

        context.set('another', 1);
        callback(undefined, context.get('two'));
    }

    function three(twoResponse, callback) {

        assertContextValues();

        should(twoResponse).be.eql(2);

        callback();
    }

    var ignoredErrorTask = async_u.applyIE(function(callback) {

        should(context.get('another')).be.eql(1);
        should(context.get('credentials')).be.eql({
            token: '1234'
        });

        callback(/* here must be an error, but for some reason applyIE does not ignore it */);
    });

    it('should not loose context between async auto flow', function(done) {

        var req = new EventEmitter();
        var res = new EventEmitter();

        context.createMeliContext(req, res, function(error) {

            should.not.exists(error);

            context.set('two', 2);
            context.set('credentials', {

                token: '1234'
            });

            var flow = {
                one: async.apply(one),
                two: async.apply(two),
                error: ignoredErrorTask,
                three: async_u.applyAuto(['two', async.apply(three)])
            };

            async.auto(flow, function(error) {

                should.not.exists(error);

                assertContextValues();

                should(context.get('two')).be.eql(2);

                done();
            });
        });
    });

    it('should not loose context beetween async series flow', function(done) {

        var req = new EventEmitter();
        var res = new EventEmitter();

        context.createMeliContext(req, res, function(error) {

            context.set('two', 2);
            should.not.exists(error);

            var flow = [
                async.apply(one),
                async.apply(two),
                async.apply(function three(callback) {

                    assertContextValues();
                    callback();
                })
            ];

            async.series(flow, function(error) {

                should.not.exists(error);

                assertContextValues();

                should(context.get('two')).be.eql(2);

                done();
            });
        });
    });
    
    it('should not loose context between async parallel flow', function(done) {

        var req = new EventEmitter();
        var res = new EventEmitter();

        context.createMeliContext(req, res, function(error) {

            context.set('two', 2);
            should.not.exists(error);

            var flow = [
                async.apply(one),
                async.apply(two),
                async.apply(function three(callback) {

                    assertContextValues();
                    callback();
                })
            ];

            async.parallel(flow, function(error) {

                should.not.exists(error);

                assertContextValues();

                should(context.get('two')).be.eql(2);

                done();
            });
        });
    });
});