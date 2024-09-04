export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'calculate' : IDL.Func(
        [IDL.Text, IDL.Float64, IDL.Float64],
        [IDL.Float64],
        [],
      ),
    'clearHistory' : IDL.Func([], [], []),
    'getHistory' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Float64, IDL.Float64, IDL.Float64))],
        ['query'],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
