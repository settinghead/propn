export default class PropNet {
    static defcells(...args) { _t(); }
    static const(val) { return (c) => _t(); }
    static "-"(a, b, c) {}
    static "*"(a, b, c) {}

    defp(name, defn) { _t(); }
    defEp(name, defn) { _t(); }

    async run() { _t(); }
}

export class E {
    static "*"(first, mutiplier) { _t(); }
    static "-"(first, subtractor) { _t(); }
}

function _t() {
    throw 'not implemented';
}