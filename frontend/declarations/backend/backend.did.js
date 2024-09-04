export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Float64, 'err' : IDL.Text });
  return IDL.Service({
    'calculate' : IDL.Func([IDL.Text, IDL.Float64, IDL.Float64], [Result], []),
    'clearHistory' : IDL.Func([], [], []),
    'getHistory' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Float64, IDL.Float64, IDL.Float64))],
        ['query'],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
