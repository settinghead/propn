import { expect } from "chai";
import PN, {E, P, NOTHING} from "../src/prop-net";

describe("fehrenheit-to-celcius", () =>{
    let prpn : PN;
    beforeEach(() => {
        prpn = new PN();
    });

    it.only("sum", async () => {
        const [a, b] = prpn.cells('a', 'b');
        a.addContent(3);
        b.addContent(2);
        const answer = prpn.cell('answer', E['+'](a, b));
        await prpn.run();
        expect(answer.content()).to.equal(5);
    });

    it.only("late binding", async() => {
        const [operation, answer] = prpn.cells("operation", "answer");
        prpn.attach(operation, 3, 4, answer);
        
        await prpn.run();
        expect(answer.content()).to.equal(NOTHING);

        prpn.id(P['*'], operation);
        await prpn.run();
        expect(answer.content()).to.equal(12);
    });

    it("fehrenheit-to-celcius: verbose form", async () => {
        prpn.prop('fahrenheit->celsius', (f, c) => [
            PN.cells('thirty-two', 'f-32', 'five', 'c*9', 'nine'),
            PN.const(32)('thirty-two'),
            PN.const(5)('five'),
            PN.const(9)('nine'),
            PN['-'](f, 'thirty-two')('f-32'),
            PN['*']('f-32', 'five')('c*9'),
        ]);

        const [f, c] = prpn.cells('f', 'c');
        prpn.p['fahrenheit->celsius'](f, c);
        f.addContent(77);
        await prpn.run();

        expect(c.content()).to.equal(25);
    });

    it("fehrenheit-to-celcius: expression form", async () => {
        prpn.eprop(
            'fahrenheit->celcius',
            (f) => E['*'](
                E['-'](f, 32), 
                5/9
            )
        );
        const [f, c] = prpn.cells('f', 'c');
        prpn.e['fahrenheit->celsius'](f, c);
        f.addContent(77);
        await prpn.run();

        expect(c.content()).to.equal(25);
    });
});