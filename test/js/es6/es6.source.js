"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _templateObject = _taggedTemplateLiteral(["In JavaScript this is\n not legal."], ["In JavaScript this is\n not legal."]),
    _templateObject2 = _taggedTemplateLiteral(["http://foo.org/bar?a=", "&b=", "\n    Content-Type: application/json\n    X-Credentials: ", "\n    { \"foo\": ", ",\n      \"bar\": ", "}"], ["http://foo.org/bar?a=", "&b=", "\n    Content-Type: application/json\n    X-Credentials: ", "\n    { \"foo\": ", ",\n      \"bar\": ", "}"]);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var test = {};
(function () {
  var SkinnedMesh = (function (_THREE$Mesh) {
    _inherits(SkinnedMesh, _THREE$Mesh);

    function SkinnedMesh(geometry, materials) {
      _classCallCheck(this, SkinnedMesh);

      _get(Object.getPrototypeOf(SkinnedMesh.prototype), "constructor", this).call(this, geometry, materials);
      this.idMatrix = SkinnedMesh.defaultMatrix();
      this.bones = [];
      this.boneMatrices = [];
      //...
    }

    // Expression bodies

    _createClass(SkinnedMesh, [{
      key: "update",
      value: function update(camera) {
        //...
        _get(Object.getPrototypeOf(SkinnedMesh.prototype), "update", this).call(this);
      }
    }, {
      key: "boneCount",
      get: function get() {
        return this.bones.length;
      }
    }, {
      key: "matrixType",
      set: function set(matrixType) {
        this.idMatrix = SkinnedMesh[matrixType]();
      }
    }], [{
      key: "defaultMatrix",
      value: function defaultMatrix() {
        return new THREE.Matrix4();
      }
    }]);

    return SkinnedMesh;
  })(THREE.Mesh);

  var odds = evens.map(function (v) {
    return v + 1;
  });
  var nums = evens.map(function (v, i) {
    return v + i;
  });
  var pairs = evens.map(function (v) {
    return { even: v, odd: v + 1 };
  });
  // Statement bodies
  nums.forEach(function (v) {
    if (v % 5 === 0) fives.push(v);
  });
  // Lexical this
  var bob = {
    _name: "Bob",
    _friends: [],
    printFriends: function printFriends() {
      var _this = this;

      this._friends.forEach(function (f) {
        return console.log(_this._name + " knows " + f);
      });
    }
  };
})();
(function () {
  var SkinnedMesh = (function (_THREE$Mesh2) {
    _inherits(SkinnedMesh, _THREE$Mesh2);

    function SkinnedMesh(geometry, materials) {
      _classCallCheck(this, SkinnedMesh);

      _get(Object.getPrototypeOf(SkinnedMesh.prototype), "constructor", this).call(this, geometry, materials);
      this.idMatrix = SkinnedMesh.defaultMatrix();
      this.bones = [];
      this.boneMatrices = [];
      //...
    }

    // Basic literal string creation

    _createClass(SkinnedMesh, [{
      key: "update",
      value: function update(camera) {
        //...
        _get(Object.getPrototypeOf(SkinnedMesh.prototype), "update", this).call(this);
      }
    }, {
      key: "boneCount",
      get: function get() {
        return this.bones.length;
      }
    }, {
      key: "matrixType",
      set: function set(matrixType) {
        this.idMatrix = SkinnedMesh[matrixType]();
      }
    }], [{
      key: "defaultMatrix",
      value: function defaultMatrix() {
        return new THREE.Matrix4();
      }
    }]);

    return SkinnedMesh;
  })(THREE.Mesh);

  "In JavaScript '\n' is a line-feed."
  // Multiline strings
  (_templateObject);
  // String interpolation
  var name = "Bob",
      time = "today";
  "Hello " + name + ", how are you " + time + "?";
  // Construct an HTTP request prefix is used to interpret the replacements and construction
  GET(_templateObject2, a, b, credentials, foo, bar)(myOnReadyStateChangeHandler);
  // list matching
  var _ref = [1, 2, 3];
  var a = _ref[0];
  var b = _ref[2];

  // object matching

  var _getASTNode = getASTNode();

  var a = _getASTNode.op;
  var b = _getASTNode.lhs.op;
  var c = _getASTNode.rhs;

  // object matching shorthand
  // binds `op`, `lhs` and `rhs` in scope

  var _getASTNode2 = getASTNode();

  var op = _getASTNode2.op;
  var lhs = _getASTNode2.lhs;
  var rhs = _getASTNode2.rhs;

  // Can be used in parameter position
  function g(_ref2) {
    var x = _ref2.name;

    console.log(x);
  }
  g({ name: 5 });
  // Fail-soft destructuring
  var _ref3 = [];
  var a = _ref3[0];

  a === undefined;
  // Fail-soft destructuring with defaults
  var _ref4 = [];
  var _ref4$0 = _ref4[0];
  var a = _ref4$0 === undefined ? 1 : _ref4$0;

  a === 1;
})();