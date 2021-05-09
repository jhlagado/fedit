/* eslint-disable @typescript-eslint/no-explicit-any */

// eForth by Hanson Ting
// initial version by Cheahshen Yap and Sam Chen
// converte to TypeScript by John Hardy

interface Definition {
  name: string;
  xt: () => void;
  pf?: any[];
  immediate?: boolean;
}

let ip = 0;
let wp = 0;
let w = 0; // instruction and word pointers
let stack: any[] = [];
let rstack: number[] = []; // array allows push and pop
let tib = '';
let ntib = 0;
let base = 10;
let idiom = '';
let compiling = false;
let fence = 0;

export function parse(delimit = ' '): string {
  idiom = '';
  while (tib.charCodeAt(ntib) <= 32) ntib++;
  while (
    ntib < tib.length &&
    tib.substr(ntib, 1) != delimit &&
    tib.substr(ntib, 1) != '\n'
  ) {
    idiom += tib.substr(ntib++, 1);
  }
  if (delimit != ' ') ntib++;
  if (idiom === '') throw ' < ' + stack.join(' ') + ' >ok';
  return idiom;
}

export function find(name: string) {
  for (let i = words.length - 1; i >= 0; i--) {
    if (words[i].name === name) return i;
  }
  return -1;
}

export function dictcompile(n: number | string) {
  words[words.length - 1].pf.push(n);
}

export function compilecode(nword: string | number) {
  let n;
  if (typeof nword === 'string') {
    n = find(nword);
  } else n = nword;
  if (n > -1) dictcompile(n);
  else {
    stack = [];
    throw ' ' + nword + ' ? ';
  }
}

export function exec(n: number) {
  w = n;
  words[n].xt();
}

export function exit() {
  ip = -1;
}

export function nest() {
  // inner interpreter
  rstack.push(wp);
  rstack.push(ip);
  wp = w;
  ip = 0;
  while (ip >= 0) {
    w = words[wp].pf[ip++];
    words[w].xt();
  }
  ip = rstack.pop();
  wp = rstack.pop();
}

export function evaluate() {
  // interpreter/compiler
  let n = parseFloat(String(idiom)); // convert to number
  const nword = find(String(idiom));
  if (base != 10) {
    n = parseInt(String(idiom), base);
  }
  if (nword > -1) {
    if (compiling && !words[nword].immediate) dictcompile(nword);
    else {
      exec(nword);
    }
  } // nest, docon, doconst need pf
  else if (n || idiom === '0') {
    // if the idiom is a number
    if (compiling) {
      compilecode('dolit'); // compile an literal
      dictcompile(n);
    } else {
      stack.push(n);
    }
  } else {
    if (compiling) words.pop(); // error, delete defective word
    stack = [];
    throw ' ' + idiom + ' ? ';
  }
}

export function doconst() {
  stack.push(w);
}

export function docon() {
  stack.push(words[w].pf[0]);
}

export function tick() {
  idiom = parse();
  const i = find(idiom);
  if (i >= 0) stack.push(i);
  else throw ' ' + idiom + ' ? ';
}

// word objects
const words: Definition[] = [
  {
    name: 'quit',
    xt: function () {
      nest();
    },
    pf: [1, 2, 3, 0],
  },
  {
    name: 'parse',
    xt: function () {
      idiom = parse();
    },
  },
  {
    name: 'evaluate',
    xt: function () {
      evaluate();
    },
  },
  {
    name: 'branch',
    xt: function () {
      ip = words[wp].pf[ip];
    },
  },

  // stacks
  {
    name: 'dup',
    xt: function () {
      stack = stack.concat(stack.slice(-1));
    },
  },
  {
    name: 'over',
    xt: function () {
      stack = stack.concat(stack.slice(-2, -1));
    },
  },
  {
    name: '2dup',
    xt: function () {
      stack = stack.concat(stack.slice(-2));
    },
  },
  {
    name: '2over',
    xt: function () {
      stack = stack.concat(stack.slice(-4, -2));
    },
  },
  {
    name: '4dup',
    xt: function () {
      stack = stack.concat(stack.slice(-4));
    },
  },
  {
    name: 'swap',
    xt: function () {
      stack = stack.concat(stack.splice(-2, 1));
    },
  },
  {
    name: 'rot',
    xt: function () {
      stack = stack.concat(stack.splice(-3, 1));
    },
  },
  {
    name: '-rot',
    xt: function () {
      stack.splice(-2, 0, stack.pop());
    },
  },
  {
    name: '2swap',
    xt: function () {
      stack = stack.concat(stack.splice(-4, 2));
    },
  },
  {
    name: '2over',
    xt: function () {
      stack = stack.concat(stack.slice(-4, -2));
    },
  },
  {
    name: 'pick',
    xt: function () {
      const j = stack.pop() + 1;
      stack = [...stack, ...stack.slice(-j, -j + 1)];
    },
  },
  {
    name: 'roll',
    xt: function () {
      const j = stack.pop() + 1;
      stack = [...stack, ...stack.splice(-j, 1)];
    },
  },
  {
    name: 'drop',
    xt: function () {
      stack.pop();
    },
  },
  {
    name: 'nip',
    xt: function () {
      stack[stack.length - 2] = stack.pop();
    },
  },
  {
    name: '2drop',
    xt: function () {
      stack.pop();
      stack.pop();
    },
  },
  {
    name: '>r',
    xt: function () {
      rstack.push(stack.pop());
    },
  },
  {
    name: 'r>',
    xt: function () {
      stack.push(rstack.pop());
    },
  },
  {
    name: 'r@',
    xt: function () {
      stack.push(rstack[rstack.length - 1]);
    },
  },
  {
    name: 'push',
    xt: function () {
      rstack.push(stack.pop());
    },
  },
  {
    name: 'pop',
    xt: function () {
      stack.push(rstack.pop());
    },
  },

  // math
  {
    name: '+',
    xt: function () {
      stack.push(stack.pop() - (0 - stack.pop()));
    },
  },
  {
    name: '-',
    xt: function () {
      const b = stack.pop();
      stack.push(stack.pop() - b);
    },
  },
  {
    name: '*',
    xt: function () {
      stack.push(stack.pop() * stack.pop());
    },
  },
  {
    name: '/',
    xt: function () {
      const b = stack.pop();
      stack.push(stack.pop() / b);
    },
  },
  {
    name: 'mod',
    xt: function () {
      const b = stack.pop();
      stack.push(stack.pop() % b);
    },
  },
  {
    name: 'and',
    xt: function () {
      stack.push(stack.pop() & stack.pop());
    },
  },
  {
    name: 'or',
    xt: function () {
      stack.push(stack.pop() | stack.pop());
    },
  },
  {
    name: 'xor',
    xt: function () {
      stack.push(stack.pop() ^ stack.pop());
    },
  },
  {
    name: 'negate',
    xt: function () {
      stack.push(0 - stack.pop());
    },
  },

  // compare
  {
    name: '0=',
    xt: function () {
      stack.push(fbool(stack.pop() === 0));
    },
  },
  {
    name: '0<',
    xt: function () {
      stack.push(fbool(stack.pop() <= 0));
    },
  },
  {
    name: '0>',
    xt: function () {
      stack.push(fbool(stack.pop() > 0));
    },
  },
  {
    name: '0<>',
    xt: function () {
      stack.push(fbool(stack.pop() !== 0));
    },
  },
  {
    name: '0<=',
    xt: function () {
      stack.push(fbool(stack.pop() <= 0));
    },
  },
  {
    name: '0>=',
    xt: function () {
      stack.push(fbool(stack.pop() >= 0));
    },
  },
  {
    name: '=',
    xt: function () {
      stack.push(fbool(stack.pop() === stack.pop()));
    },
  },
  {
    name: '>',
    xt: function () {
      const b = stack.pop();
      stack.push(fbool(stack.pop() > b));
    },
  },
  {
    name: '<',
    xt: function () {
      const b = stack.pop();
      stack.push(fbool(stack.pop() < b));
    },
  },
  {
    name: '<>',
    xt: function () {
      stack.push(fbool(stack.pop() !== stack.pop()));
    },
  },
  {
    name: '>=',
    xt: function () {
      const b = stack.pop();
      stack.push(fbool(stack.pop() >= b));
    },
  },
  {
    name: '<=',
    xt: function () {
      const b = stack.pop();
      stack.push(fbool(stack.pop() <= b));
    },
  },
  {
    name: '==',
    xt: function () {
      stack.push(fbool(stack.pop() == stack.pop()));
    },
  },

  // output
  {
    name: 'base@',
    xt: function () {
      stack.push(base);
    },
  },
  {
    name: 'base!',
    xt: function () {
      base = stack.pop();
    },
  },
  {
    name: 'hex',
    xt: function () {
      base = 16;
    },
  },
  {
    name: 'decimal',
    xt: function () {
      base = 10;
    },
  },
  {
    name: 'cr',
    xt: function () {
      logtype('<br/>\n');
    },
  },
  {
    name: '.',
    xt: function () {
      logtype(stack.pop().toString(base) + ' ');
    },
  },
  {
    name: '.r',
    xt: function () {
      const n = stack.pop();
      logtype(stack.pop().toString().padStart(n, ' '));
    },
  },
  {
    name: 'emit',
    xt: function () {
      const s = String.fromCharCode(stack.pop());
      logtype(s);
    },
  },
  {
    name: 'space',
    xt: function () {
      const s = '&nbsp;';
      logtype(s);
    },
  },
  {
    name: 'spaces',
    xt: function () {
      const n = stack.pop();
      let s = '';
      for (let i = 0; i < n; i++) s += '&nbsp;';
      logtype(s);
    },
  },

  // strings
  {
    name: '[',
    xt: function () {
      compiling = false;
    },
    immediate: true,
  },
  {
    name: ']',
    xt: function () {
      compiling = true;
    },
  },
  {
    name: 'find',
    xt: function () {
      idiom = parse();
      stack.push(find(idiom));
    },
  },
  {
    name: "'",
    xt: function () {
      tick();
    },
  },
  {
    name: "(')",
    xt: function () {
      stack.push(words[w].pf[ip++]);
    },
  },
  {
    name: "[']",
    xt: function () {
      compilecode("(')");
      tick();
      compilecode(stack.pop());
    },
    immediate: true,
  },
  {
    name: 'dolit',
    xt: function () {
      stack.push(words[wp].pf[ip++]);
    },
  },
  {
    name: 'dostr',
    xt: function () {
      stack.push(words[w].pf[ip++]);
    },
  },
  {
    name: 's"',
    xt: function () {
      const s = parse('"');
      if (compiling) {
        compilecode('dostr');
        dictcompile(s);
      } else {
        stack.push(s);
      }
    },
    immediate: true,
  },
  {
    name: 'dotstr',
    xt: function () {
      const n = words[wp].pf[ip++];
      logtype(n);
    },
  },
  {
    name: '."',
    xt: function () {
      const s = parse('"');
      if (compiling) {
        compilecode('dotstr');
        dictcompile(s);
      } else {
        logtype(s);
      }
    },
    immediate: true,
  },
  {
    name: '(',
    xt: function () {
      parse(')');
    },
    immediate: true,
  },
  {
    name: '.(',
    xt: function () {
      const s = parse(')');
      logtype(s);
    },
    immediate: true,
  },
  {
    name: '\\',
    xt: function () {
      parse('\n');
    },
    immediate: true,
  },

  // structures
  {
    name: 'exit',
    xt: function () {
      exit();
    },
  },
  {
    name: '0branch',
    xt: function () {
      if (stack.pop()) ip++;
      else ip = words[wp].pf[ip];
    },
  },
  {
    name: 'donext',
    xt: function () {
      const i = rstack.pop() - 1;
      if (i >= 0) {
        ip = words[wp].pf[ip];
        rstack.push(i);
      } else {
        ip++;
      }
    },
  },
  {
    name: 'if',
    xt: function () {
      // if    ( -- here )
      compilecode('0branch');
      stack.push(words[words.length - 1].pf.length);
      dictcompile(0);
    },
    immediate: true,
  },
  {
    name: 'else',
    xt: function () {
      // else ( here -- there )
      compilecode('branch');
      const h = words[words.length - 1].pf.length;
      dictcompile(0);
      words[words.length - 1].pf[stack.pop()] =
        words[words.length - 1].pf.length;
      stack.push(h);
    },
    immediate: true,
  },
  {
    name: 'then',
    xt: function () {
      // then    ( there -- )
      words[words.length - 1].pf[stack.pop()] =
        words[words.length - 1].pf.length;
    },
    immediate: true,
  },
  {
    name: 'begin',
    xt: function () {
      // begin    ( -- here )
      stack.push(words[words.length - 1].pf.length);
    },
    immediate: true,
  },
  {
    name: 'again',
    xt: function () {
      // again    ( there -- )
      compilecode('branch');
      compilecode(stack.pop());
    },
    immediate: true,
  },
  {
    name: 'until',
    xt: function () {
      // until    ( there -- )
      compilecode('0branch');
      compilecode(stack.pop());
    },
    immediate: true,
  },
  {
    name: 'while',
    xt: function () {
      // while    ( there -- there here )
      compilecode('0branch');
      stack.push(words[words.length - 1].pf.length);
      dictcompile(0);
    },
    immediate: true,
  },
  {
    name: 'repeat',
    xt: function () {
      // repeat    ( there1 there2 -- )
      compilecode('branch');
      const t = stack.pop();
      compilecode(stack.pop());
      words[words.length - 1].pf[t] = words[words.length - 1].pf.length;
    },
    immediate: true,
  },
  {
    name: 'for',
    xt: function () {
      // for ( -- here )
      compilecode('>r');
      stack.push(words[words.length - 1].pf.length);
    },
    immediate: true,
  },
  {
    name: 'next',
    xt: function () {
      // next ( here -- )
      compilecode('donext');
      compilecode(stack.pop());
    },
    immediate: true,
  },
  {
    name: 'aft',
    xt: function () {
      // aft ( here -- here there )
      stack.pop();
      compilecode('branch');
      const h = words[words.length - 1].pf.length;
      dictcompile(0);
      stack.push(words[words.length - 1].pf.length);
      stack.push(h);
    },
    immediate: true,
  },

  // defining words
  {
    name: ':',
    xt: function () {
      const newname = parse() as string;
      compiling = true;
      words.push({
        name: newname,
        xt: function () {
          nest();
        },
        pf: [],
      });
    },
  },
  {
    name: ';',
    xt: function () {
      compiling = false;
      compilecode('exit');
    },
    immediate: true,
  },
  {
    name: 'create',
    xt: function () {
      const newname = parse() as string;
      words.push({
        name: newname,
        xt: function () {
          doconst();
        },
        pf: [],
      });
    },
  },
  {
    name: 'constant',
    xt: function () {
      const newname = parse() as string;
      words.push({
        name: newname,
        xt: function () {
          docon();
        },
        pf: [stack.pop()],
      });
    },
  },
  {
    name: ',',
    xt: function () {
      dictcompile(stack.pop());
    },
  },
  {
    name: 'allot',
    xt: function () {
      const n = stack.pop();
      for (let i = 0; i < n; i++) words[words.length - 1].pf.push(0);
    },
  },
  {
    name: 'does',
    xt: function () {
      words[words.length - 1].xt = function () {
        nest();
      };
      words[words.length - 1].pf = words[wp].pf.slice(ip);
      ip = -1;
    },
  },
  {
    name: 'q@',
    xt: function () {
      // q@ ( i -- n ) designed for does words
      const i = stack.pop();
      stack.push(words[wp].pf[i]);
    },
  },

  // tools
  {
    name: 'here',
    xt: function () {
      stack.push(words.length);
    },
  },
  {
    name: 'words',
    xt: function () {
      for (let i = words.length - 1; i >= 0; i--) logtype(words[i].name + ' ');
    },
  },
  {
    name: 'dump',
    xt: function () {
      logtype('words[<br/>');
      for (let i = 0; i < words.length; i++) {
        logtype('{name:"' + words[i].name + '", xt:' + words[i].xt.toString());
        if (words[i].pf) logtype(', pf:[' + words[i].pf.toString() + ']');
        if (words[i].pf) logtype(', qf:[' + words[i].pf.toString() + ']');
        if (words[i].immediate) logtype(' ,immediate:' + words[i].immediate);
        logtype('}},<br/>');
      }
      logtype(']<br/>');
    },
  },
  {
    name: 'forget',
    xt: function () {
      tick();
      const n = stack.pop();
      if (n < fence) {
        stack = [];
        throw ' ' + idiom + ' below fence';
      }
      for (let i = words.length - 1; i >= n; i--) words.pop();
    },
  },
  {
    name: 'boot',
    xt: function () {
      for (let i = words.length - 1; i >= fence; i--) words.pop();
    },
  },
  {
    name: 'see',
    xt: function () {
      tick();
      const n = stack.pop();
      const p = words[n].pf;
      let s = '';
      for (let i = 0; i < p.length; i++) {
        if (
          s == 'dolit' ||
          s == 'branch' ||
          s == '0branch' ||
          s == 'donext' ||
          s == 'dostr' ||
          s == 'dotstr'
        ) {
          s = ' ';
          logtype(p[i].toString() + ' ');
        } else {
          s = words[p[i]].name;
          logtype(s + ' ');
        }
      }
    },
  },
  {
    name: 'date',
    xt: function () {
      const d = new Date();
      logtype(d + '<br/>');
    },
  },
  {
    name: '@',
    xt: function () {
      const a = stack.pop();
      stack.push(words[a].pf[0]);
    },
  },
  {
    name: '!',
    xt: function () {
      const a = stack.pop();
      words[a].pf[0] = stack.pop();
    },
  },
  {
    name: '+!',
    xt: function () {
      const a = stack.pop();
      words[a].pf[0] += stack.pop();
    },
  },
  {
    name: '?',
    xt: function () {
      logtype(words[stack.pop()].pf[0].toString(base) + '&nbsp;');
    },
  },
  {
    name: 'array@',
    xt: function () {
      // array@ ( w i -- n )
      const i = stack.pop();
      const a = stack.pop();
      stack.push(words[a].pf[i]);
    },
  },
  {
    name: 'array!',
    xt: function () {
      // array! ( n w i -- )
      const i = stack.pop();
      const a = stack.pop();
      words[a].pf[i] = stack.pop();
    },
  },
  {
    name: 'is',
    xt: function () {
      // ( a -- ) vector a to next word
      tick();
      const b = stack.pop();
      const a = stack.pop();
      words[b].pf = words[a].pf;
    },
  },
  {
    name: 'to',
    xt: function () {
      // ( a -- ) change value of next word
      const a = words[wp].pf[ip++];
      words[a].pf[0] = stack.pop();
    },
  },
];
fence = words.length;

export const logtype = (text: string | number) => console.log(text);
export const fbool = (b: boolean) => (b ? -1 : 0);

export function main(cmd: string) {
  tib = cmd;
  ntib = 0;
  rstack = [];
  wp = 0;
  ip = 0;
  w = 0;
  compiling = false;
  exec(0);
}
