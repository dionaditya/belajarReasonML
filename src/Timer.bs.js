'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Belt_Array = require("bs-platform/lib/js/belt_Array.js");
var Json_decode = require("@glennsl/bs-json/src/Json_decode.bs.js");

function movie(json) {
  return {
          title: Json_decode.field("title", Json_decode.string, json)
        };
}

function all(param) {
  return Json_decode.array(movie, param);
}

var Decode = {
  movie: movie,
  all: all
};

function Timer(Props) {
  var match = React.useReducer((function (_state, action) {
          if (typeof action === "number") {
            if (action !== 0) {
              return /* Error */1;
            } else {
              return /* Loading */0;
            }
          } else {
            return /* Loaded */[action[0]];
          }
        }), /* Loading */0);
  var dispatch = match[1];
  var state = match[0];
  React.useEffect((function () {
          fetch("http://localhost:3000/api/movies").then((function (prim) {
                      return prim.json();
                    })).then((function (json) {
                    var movies = Json_decode.array(movie, json);
                    return Promise.resolve(Curry._1(dispatch, /* MoviesFetched */[movies]));
                  })).catch((function (_err) {
                  return Promise.resolve(Curry._1(dispatch, /* MoviesFailedToFetch */1));
                }));
          return ;
        }), ([]));
  return React.createElement("div", undefined, typeof state === "number" ? (
                state !== 0 ? React.createElement("div", undefined, "An error occurred!") : React.createElement("div", undefined, "Loading...")
              ) : Belt_Array.mapWithIndex(state[0], (function (i, movie) {
                      return React.createElement("div", undefined, movie.title);
                    })));
}

var make = Timer;

exports.Decode = Decode;
exports.make = make;
/* react Not a pure module */
