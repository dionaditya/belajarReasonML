open Belt;

type movie = {
  title: string
};

type state =
  | Loading
  | Error
  | Loaded(array(movie));

type action =
  | MoviesFetch
  | MoviesFetched(array(movie))
  | MoviesFailedToFetch;

module Decode = {
  let movie = json =>
    Json.Decode.{
      title: json |> field("title", string),
    };
    let all =
    Json.Decode.array(movie)
};

[@react.component]
let make = () => {
  let (state, dispatch) =
    React.useReducer(
      (_state, action) =>
        switch (action) {
        | MoviesFetch => Loading
        | MoviesFetched(movies) => Loaded(movies)
        | MoviesFailedToFetch => Error
        },
      Loading,
    );

  React.useEffect0(() => {
    Js.Promise.(
      Fetch.fetch("http://localhost:3000/api/movies")
      |> then_(Fetch.Response.json)
      |> then_(json =>
           json
           |> Decode.all
           |> (movies => dispatch(MoviesFetched(movies)))
           |> resolve
         )
      |> catch(_err => Js.Promise.resolve(dispatch(MoviesFailedToFetch)))
      |> ignore
    );

    None;
  });

  <div>
    {switch (state) {
    | Error => <div> {ReasonReact.string("An error occurred!")} </div>
    | Loading => <div> {ReasonReact.string("Loading...")} </div>
    | Loaded(movies) =>
       movies
       ->Belt.Array.mapWithIndex((i, movie) => {
           <div>
             {ReasonReact.string(movie.title)}
           </div>
         })
       ->React.array
    }}
  </div>
};