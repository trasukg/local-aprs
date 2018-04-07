
describe('the Map class', () => {
  it('lets you set and get items', () => {
    let UUT=new Map();
    UUT.set('a', 'sample');
    expect(UUT.get('a')).toBe('sample');
  });

  it('returns the size using the size property', ()=>{
    let UUT=new Map();
    UUT.set('a', 'case1');
    UUT.set('b', 'case2');
    expect(UUT.size).toBe(2);
  });

  it('returns a keys property', () => {
    let UUT=new Map();
    UUT.set('a', 'case1');
    UUT.set('b', 'case2');
    var keys=UUT.keys();
    expect(keys).toBeDefined();
    expect(Array.from(keys)).toContain('a');
  });
})
