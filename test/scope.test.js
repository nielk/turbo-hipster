var chai   = require('chai')
    assert = chai.assert,
    expect = chai.expect,
    should = chai.should(),
    _      = require('lodash-node'),
    Scope  = require('../src/scope.js');

/**
 * @name: Jasmine test - scope.js
 **/
describe('Scope', function() {
    var scope,
        flag;

    beforeEach(function() {
        scope = new Scope();
    });
    
    it('scope', function() {
        expect(Scope).to.exist;
        expect(scope).to.be.an.instanceof(Scope);

        // scope.name
        scope.name = 'Bob';
        expect(scope).to.include.keys("name");
        expect(scope.name).to.equal('Bob');

        // $$watchers
        expect(scope).to.include.keys("$$watchers");
        expect(scope.$$watchers).to.be.an("array");
        scope.$$watchers.push('an item');
        expect(scope.$$watchers).to.contain("an item");
        scope.$$watchers.pop();

        // $watch function
        expect(scope.$watch).to.exist;
        expect(scope.$watch).to.be.a("function");
        scope.$watch(function(scope){
            return scope.name;
        }, function(){ 
            flag = !flag; 
        });
        expect(scope.$$watchers).to.have.length(1);

        // $digest function
        expect(scope.$digest).to.exist;
        expect(scope.$digest).to.be.a("function");
        expect(flag).to.be.undefined;
        scope.name = 'Luc';
        scope.$digest();
        expect(flag).to.be.true;
        scope.$digest();
        expect(flag).to.be.true;
        scope.name = 'Joe';
        scope.$digest();
        expect(flag).to.be.false;

        scope.nb = 0;
        scope.$watch(function(scope){
            return scope.nb;
        }, function(newValue, oldValue, scope){ 
            scope.nb === 3 ? '' : scope.nb++ ;
        });
        scope.$digest();
        expect(scope.nb).to.equal(3);

        // ValueEqual
        var nbChange = 0;
        scope.anArray = [12, 23, 34, 45];
        scope.$watch(function(scope) {
            return scope.anArray;
        }, function(newValue, oldValue, scope) {
            nbChange++;
        });
        scope.$digest(); // ngChange = 1
        scope.anArray.push(56);
        scope.$digest(); // ngChange = 2
        expect(nbChange).to.equal(2);

        // ttl : time to live digest
        scope.infinite = 0;
        scope.$watch(function(scope) {
            return scope.infinite;
        }, function(newValue, oldValue, scope) {
            scope.infinite++;
        });

        expect(function() {scope.$digest()}).to.throw("10 digest iterations reached");
        expect(scope.infinite).to.equal(11); // @todo
    });
});