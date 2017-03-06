import { expect } from "chai";
import PN, {E} from "../src/prop-net";

describe("fehrenheit-to-celcius", () =>{
    var prpn;
    beforeEach(() => {
        prpn = new PN();
    })
    it("verbose form", async () => {
        prpn.defp('fahrenheit->celsius', (f, c) => [
            PN.defcells('thirty-two', 'f-32', 'five', 'c*9', 'nine'),
            PN.const(32)('thirty-two'),
            PN.const(5)('five'),
            PN.const(9)('nine'),
            PN['-'](f, 'thirty-two', 'f-32'),
            PN['*']('f-32', 'five', 'c*9'),
        ]);

        prpn.content("f", 77);
        await prpn.run();
        expect(prpn.content("c")).to.equal(25)
    });

    it("expression form", () => {
        prpn.defEp(
            'e:fahrenheit->celcius',
            (f) => E['*'](E['-'](f, 32), 5/9)
        )
    });
});