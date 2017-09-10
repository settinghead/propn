import { union, map, includes, each } from "lodash";

export default class PropNet {
    static cells(...names: string[]) : Cell<any>[] { _t(); return []; }
    static const<T>(val: T) { return (c : any) => _t(); }
    static "-"(a: number, b: number, c: number) {}
    static "*"(a: number, b: number, c: number) {}
    static "+"(a: number, b: number, c: number) {}
    private _propagatorsEverAlerted: PropagatorCell[] = [];
    private _alertedPropagators : PropagatorCell[] = [];
    private _registry: {[name:string] : Cell<any>} = {};

    alertPropagator(pCell: PropagatorCell) {
        this.alertPropagators([pCell]);
    }

    alertPropagators(propagators: PropagatorCell[]) {
        
        this._propagatorsEverAlerted = union(this._propagatorsEverAlerted, propagators);
        this._alertedPropagators = union(this._alertedPropagators, propagators);
    }
    addPropagator(_neighbors: Cell<any>[], p: ExecFn) {
        const pCell = new PropagatorCell(this, p);
       _neighbors.forEach((cell) => {
           cell.addNeighbor(pCell);
       });
       this.alertPropagator(pCell);
   }
    prop(name: string, defn: any) { _t(); }
    eprop(name: string, defn: any) { _t(); }
    cells(...names: string[]) : Cell<any>[] { 
        const r : Cell<any>[] = [];
        names.forEach(n => {
            r.push(this.cell(n));
        });
        return r;
    }
    cell<T>(name: string, cell?: Cell<T>) : Cell<T> { 
        let r : Cell<T>;
        if(!cell) {
            r = new Cell(this);            
        } else {
            r = cell;
        }
        this._registry[name] = r;
        return r; 
    }
    attach(...cells: (Cell<any> | any)[]) : void {
        _t();
    }
    id(op: POp, c:Cell<any>) : void { _t(); }

    p: { [key: string]: Propagator }
    e: { [key: string]: Propagator }

    async run() : Promise<number> { 
        let ticks = 0;
        while(this._alertedPropagators.length > 0) {
            ticks ++;
            (this._alertedPropagators.pop() as PropagatorCell).exec();
        }
        return ticks;
     }
}

type Propagator = (...cells: Cell<any>[]) => void;

export type Nothing = "settinghead.org/prpn/nothing";
export type Contradiction = "settinghead.org/prpn/contradiction";
export const NOTHING : Nothing = "settinghead.org/prpn/nothing";
export const CONTRADICTION : Contradiction = "settinghead.org/prpn/contradiction";

export class Cell<T> {
    constructor(net: PropNet, v? : T | Nothing) {
        this._net = net;
        if(v === undefined) {
            this._content = NOTHING;
        } else {
            this._content = v;
        }
    }
    _net: PropNet;
    private _content: T | Nothing;
    private _neighbors: PropagatorCell[] = [];
    addContent(increment: any):void { 
        let answer = merge(this._content, increment);

        if (answer === CONTRADICTION) {
            throw new ContradictionError(this._content, increment);
        }

        if (answer !== this._content) {
            this._content = answer;
            this._net.alertPropagators(this._neighbors);
        }
     };
    addNeighbor(neighbor: PropagatorCell) {
        this._neighbors = union(this._neighbors, [neighbor]);
    }
    content() : T | Nothing { return this._content; };
}

type ExecFn = () => void;

export class PropagatorCell extends Cell<ExecFn> {
    constructor(net: PropNet, p: ExecFn) {
        super(net, p);
    }

    exec() {
        (this.content() as ExecFn)();
    }
}

export class E {
    static "*"(first: Cell<number>, mutiplier: Cell<number>) { _t(); }
    static "-"(first: Cell<number>, subtractor: Cell<number>) { _t(); }
    static "+" = 
        functionCallPropagator((a, b) => {
            return a + b;
        }, true)
}

function functionCallPropagator(f: (...vals: any[]) => any, strict: boolean) {
    return function(...inputs: Cell<any>[]) : Cell<any> {
        const net = inputs[0]._net;
        const answerCell = new Cell(net);
        net.addPropagator(inputs, toDo);
        
        function toDo() : void {
            const inputContent = inputs.map( (cell: Cell<any>) => { 
                return cell.content();
            });

            if (strict && includes(inputContent, NOTHING)) {
                return;
            }

            const answer = f.apply(undefined, inputContent);
            
            answerCell.addContent(answer);
        }

        return answerCell;
    };
}

type POp = (...vals: any[]) => any; //TODO

export const P: { [key: string]: POp } =  {
    "*": (first, mutiplier, result) => { _t(); },
    "-": (first, subtractor, result) => { _t(); },
    "+": (first, second, sum) => { _t(); },
}

function merge<T>(content: T, increment: T) {
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


function equivalent<T>(a: T, b: T) {
	const matchers : [Function, Function, Function][] = [
		[hasType("number"), hasType("number"), floatEq],
	];

	// try the matchers in order
	for (let i = 0; i < matchers.length; i++) {
		const matcher = matchers[i];
		if (matcher[0](a) && matcher[1](b)) {
			return matcher[2](a, b);
		}
	}

	return a === b;

	function floatEq(a: T, b: T) {
		// TODO: if problems arise from floating points, uncomment this check
		// if (typeof a === 'number' && typeof b === 'number') {
		// 	return Math.abs(a - b) < 0.00001; // XXX
		// }
		return a === b;
	}
}

function anything() { return function () { return true } }
function left<T>(a: T, b: T) { return a; }
function right<T>(a: T, b: T) { return b; }
function mustEq<T>(a: T, b: T) { return equivalent(a, b) ? b : CONTRADICTION }
function hasType(t: string) { return function (v: any) { return typeof v === t } }
function eq<T>(v: T) { return function(v2: T) { return v2 === v } }

class ContradictionError extends Error {
    constructor(oldVal: any, newVal: any) {
        super(oldVal + " contradicts " + newVal);
        Error.captureStackTrace(this, this.constructor);
    }
}

function _t() {
    throw 'not implemented';
}