export default class PropNet {
    static cells(...args) : CellDef[] { _t(); return []; }
    static const(val) { return (c) => _t(); }
    static "-"(a, b, c) {}
    static "*"(a, b, c) {}

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

    async run() { _t(); }
}

export class CellDef {

}

type Propagator = {
    (...cells: Cell[]): void,
    _net: PropNet
};

export class Cell {
    _net: PropNet;
    addContent(val: any):void { _t(); };
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

export const NOTHING = "settinghead.org/prpn/nothing";

function _t() {
    throw 'not implemented';
}