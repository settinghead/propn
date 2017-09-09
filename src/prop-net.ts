export default class PropNet {
    static cells(...args) : CellDef[] { _t(); return []; }
    static const(val) { return (c) => _t(); }
    static "-"(a, b, c) {}
    static "*"(a, b, c) {}
    private alertedPropagators : Propagator[] = [];

    prop(name, defn) { _t(); }
    eprop(name, defn) { _t(); }
    cells(...names: String[]) : Cell[] { _t(); return []; }
    cell(name: String, propagator?: Propagator) : Cell { _t(); return new Cell(); }
    attach(...cells: (Cell | any)[]) : void {
        _t();
    }
    id(op: POp, c:Cell) : void { _t(); }

    p: { [key: string]: Propagator }
    e: { [key: string]: Propagator }

    async run() : Promise<number> { 
        let ticks = 0;
        while(this.alertedPropagators.length > 0) {
            ticks ++;
            (this.alertedPropagators.pop() as Propagator)();
        }
        return ticks;
     }
}

export class CellDef {

}

type Propagator = {
    (...cells: Cell[]): void,
    _net: PropNet
};

export type Nothing = "settinghead.org/prpn/nothing";
export type Contradiction = "settinghead.org/prpn/contradiction";
export const NOTHING : Nothing = "settinghead.org/prpn/nothing";
export const CONTRADICTION : Contradiction = "settinghead.org/prpn/contradiction";

export class Cell {
    _net: PropNet;
    private _content: any;
    addContent(increment: any):void { 
        let answer = merge(this._content, increment);
     };
    content() : any { _t(); };
}

export class E {
    static "*"(first, mutiplier) { _t(); }
    static "-"(first, subtractor) { _t(); }
}

type POp = (...vals) => any; //TODO

export const P: { [key: string]: POp } =  {
    "*": (first, mutiplier, result) => { _t(); },
    "-": (first, subtractor, result) => { _t(); },
    "+": (first, second, sum) => { _t(); },
}

function merge(content, increment) {
	var matchers : [Function, Function, Function][] = [
		[hasType("number"), hasType("number"), mustEq],
		[hasType("string"), hasType("string"), mustEq],
		[hasType("boolean"), hasType("boolean"), mustEq],

		[eq(NOTHING), anything, right],
		[anything, eq(NOTHING), left],
	];

	// try the matchers in order
	for (var i = 0; i < matchers.length; i++) {
		var matcher = matchers[i];
		if (matcher[0](content) && matcher[1](increment)) {
			return matcher[2](content, increment);
		}
	}

	return CONTRADICTION;
}


function equivalent(a, b) {
	const matchers : [Function, Function, Function][] = [
		[hasType("number"), hasType("number"), floatEq],
	];

	// try the matchers in order
	for (var i = 0; i < matchers.length; i++) {
		var matcher = matchers[i];
		if (matcher[0](a) && matcher[1](b)) {
			return matcher[2](a, b);
		}
	}

	return a === b;

	function floatEq(a, b) {
		// TODO: if problems arise from floating points, uncomment this check
		// if (typeof a === 'number' && typeof b === 'number') {
		// 	return Math.abs(a - b) < 0.00001; // XXX
		// }
		return a === b;
	}
}

function anything() { return function () { return true } }
function left(a, b) { return a; }
function right(a, b) { return b; }
function mustEq(a, b) { return equivalent(a, b) ? b : CONTRADICTION }
function hasType(t) { return function (v) { return typeof v === t } }
function eq(v) { return function(v2) { return v2 === v } }

function _t() {
    throw 'not implemented';
}