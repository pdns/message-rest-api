var request = require('request');
var assert = require('assert');
var utils = require('../utils');

var isPalindrome = utils.isPalindrome;

describe('isPalindrome()', function() {
  it("determines '' (empty string) is a palindrome", function() {
    assert.equal(isPalindrome(''), true);
  });
  it("determines 'a' is a palindrome", function() {
    assert.equal(isPalindrome('a'), true);
  });
  it("determines 'aba' is a palindrome", function() {
    assert.equal(isPalindrome('aba'), true);
  });
  it("determines 'abba' is a palindrome", function() {
    assert.equal(isPalindrome('abba'), true);
  });
  it("determines 'racecar' is a palindrome", function() {
    assert.equal(isPalindrome('racecar'), true);
  });
  it("determines '121' (integer) is a palindrome", function() {
    assert.equal(isPalindrome(121), true);
  });
  it("determines 'ab' is NOT a palindrome", function() {
    assert.equal(isPalindrome('ab'), false);
  });
  it("determines 'abb' is NOT a palindrome", function() {
    assert.equal(isPalindrome('abb'), false);
  });
  it("determines 'race car' is NOT a palindrome", function() {
    assert.equal(isPalindrome('race car'), false);
  });
  it("determines '123' (integer) is NOT a palindrome", function() {
    assert.equal(isPalindrome(123), false);
  });
});

describe('Message model', function() {
  before(function() {
    return require('../models/models').sync();
  });

  beforeEach(function() {
    this.messages = require('../models/models').models.Message;
  });

  it("creates a new Message", function(done) {
    this.messages.create({'message': "Testing 1 2 3"}).then(
        function(newMsg) {
            assert.equal(newMsg.message, "Testing 1 2 3");
            assert('id' in newMsg);
            assert('createdAt' in newMsg);
            done();
        } 
    )
  });

  it("asJson() returns detailed JSON data", function(done) {
    this.messages.create({'message': "racecar"}).then(
        function(newMsg) {
            var json = newMsg.asJson;
            var expected = {'id': newMsg.id,
                            'date_created': newMsg.createdAt,
                            'message': "racecar",
                            'palindrome': true };
            assert.deepEqual(json, expected);
            done();
        }
    )
  });
});

describe("Message REST API", function() {
    before(function() {
        this.host = 'localhost';
        this.port = 3001;
        this.fullHost = 'http://' + this.host + ':' + String(this.port);
        this.fullUrl = this.fullHost + '/api/message';
        var app = require('../app');
        var http = require('http');
        this.server = http.createServer(app);
        this.server.listen(this.port);
    });

    after(function() {
        this.server.close();
    });

    it("gets Message list", function(done) {
        var fullUrl = this.fullUrl;
        var options = {'url': fullUrl, 'method': 'GET'};
        request(options, function(err, res, body) {
            var data = JSON.parse(body);
            assert.equal(data.count, 2);
            assert.equal(data.results[0].message, 'Testing 1 2 3');
            assert.equal(data.results[1].message, 'racecar');
            assert('url' in data.results[0]);
            assert(data.results[1].url.startsWith(fullUrl));
            done();
        });
    });

    it("creates posted Message and returns Message details", function(done) {
        var fullUrl = this.fullUrl;
        var options = {
            'url': fullUrl,
            'method': 'POST',
            'json': {'message': 'abcdef'}};
        request(options, function(err, res, body) {
            assert.equal(body.message, 'abcdef');
            assert.equal(body.palindrome, false);
            assert(body.url.startsWith(fullUrl));
            done();
        });
    });

    it("extends Message list after create", function(done) {
        var fullUrl = this.fullUrl;
        var options = {'url': fullUrl, 'method': 'GET'};
        request(options, function(err, res, body) {
            var data = JSON.parse(body);
            assert.equal(data.count, 3);
            assert(data.results[2].url.startsWith(fullUrl));
            done();
        });
    });

    it("gets requested Message details", function(done) {
        var fullUrl = this.fullUrl;
        var options = {'url': fullUrl, 'method': 'GET'};
        request(options, function(err, res, body) {
            var data = JSON.parse(body);
            options.url = data.results[1].url;
            request(options, function(err, res, body) {
                var data = JSON.parse(body);
                assert.equal(data.palindrome, true);
                assert.equal(data.message, 'racecar');
                assert(data.url.startsWith(fullUrl));
                done();
            });
        });
    });

    it("deletes specified Message and returns success", function(done) {
        var fullUrl = this.fullUrl;
        var options = {'url': fullUrl, 'method': 'GET'};
        request(options, function(err, res, body) {
            var data = JSON.parse(body);
            options.url = data.results[0].url;
            options.method = 'DELETE';
            request(options, function(err, res, body) {
                var data = JSON.parse(body);
                assert('success' in data);
                done();
            });
        });
    });

    it("reduces Message list after delete", function(done) {
        var fullUrl = this.fullUrl;
        var options = {'url': fullUrl, 'method': 'GET'};
        request(options, function(err, res, body) {
            var data = JSON.parse(body);
            assert.equal(data.count, 2);
            assert.equal(data.results[0].message, 'racecar');
            done();
        });
    });

    it("returns error if requested Message does not exist", function(done) {
        var fullUrl = this.fullUrl;
        var options = {'url': fullUrl + '/doesnotexist', 'method': 'GET'};
        request(options, function(err, res, body) {
            var data = JSON.parse(body);
            assert(data.error);
            done();
        });
    });

    it("returns error if Message to delete does not exist", function(done) {
        var fullUrl = this.fullUrl;
        var options = {'url': fullUrl + '/doesnotexist', 'method': 'DELETE'};
        request(options, function(err, res, body) {
            var data = JSON.parse(body);
            assert(data.error);
            done();
        });
    });
});