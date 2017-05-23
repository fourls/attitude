var levels = [
    "1111111111111111111110000000000000100001100000000000001004011000000000000000000110200000000000000001111111000000001111111000000000000000000110000000002000000001100000000111000000011000000000000000000110200000000000000201111111000000001111111000000000000000000110000000002000000001100000000111000000011000000000000000000110000000000000000001100000000000000000011020000000000000020111111133311333111111",
    "1111111111111111111114000003000000000001100000000000000000011000000200000000000110000000000000000001100000030000200000011111111100000000000110000000000000000001120000000000000000011100000000000000000110000000000000000001100000010000002000011000000000000000000111000000000000000001100000200000000000011000011110000000000110000100100000000001100111000000000000011000000000000002000111111111133333313331",
    "1111111111111111111110000000000000000001100000000200000000011000000000000000000110000000000000000001100000001111000000011000020000000020000110000100040000100001111000000000000001111000000011110000000110000000000000000001100033330200333300011000000001000000000110000000000000000001100000000110000000011000001000000100000111100000000000000111100000000000000000011000000000200000000111111111111111111111",
    "1111111111111111111110000000001000000001100010000000002000011000000111111111111111000000000000000001100000200000000000011000000000000000000111133330000000200001100000000111111113311000000000000000000110000000000000000001100111111020000000011000000013331000000110002000100010000001100000000000111000011111111110001000000110000000000000000111104000000000000000011000000000000000000111111111111111111111",
    "1111111111111111111110000000000000000001100001111111110000011020010000000002000111111100000000000001100000000000000001111000000000020000000110000111111111111111100000000400000000011100000000000000000110000000000000000001100000000000020000011111111000000000000110000000000000000001133333333333003333311000000000000000000110000200000000000001100000000000000000011000000000002000000111111111111111111111",
    "1111111111111111111110004100000000000001101111000200000000011000000011100000000110000000000000000001131111000000000002011000000000000001111110000200000000000001100111111000000000011000000000000000000110000000000000000001100000000000000000011100000000000000000110000000000000000001100020000000000000011000100000000000000110000000111110000001100000000000000000011200000000000000020113333333333333331131",
    "1111111111111111111110000000000000000001100000000000000000211000000000000000011110000100010001000001110000000000000000011000000000000000000110200000000000000001111111100000000000011400000000110000000110000000000000000001100000000000000020011111110001111111111110000100000000000001100001000000000000011002010000000000000110111100000000000001101000000000000000011000000000000000020111111111133333311111",
    "3333333333333333333330004000000000000003300000000000000000033000000000000000000330000000000000000003300002000000000000033000010000020000000330000000000000000003300000000000000000033000000000000020000330000000000000100003300000000000000000033000000010000000000332000000000000000003310000000000000000033000020000000000000330000000000000000003300000000000000000033000000200000000000333333333333333333333",
    "1111111111111111111114001001000100010001100010010201020102011100100000000000000110001000011111111111100000000200000000031011111111000000000310000100000000000003111121000000000000031000000000000000000310000002000000000003100000000000000000031111110000200000000330000000011110000003300000000000000000033000000000000000000330000000000000000003300000000000000000033020000000000000020333133331333313333133",
    "0000000000011111111100000000000100000041000000000001020000010000000000010000000111111111111100111111100000000000001000001000000200000010000010000000000000100000100111111111111111111000100010000000000110001020000020000001100000000000000000011000000000000000020111100111111111001111001001000100010000010010000200000100000100100000000001002001001001000100000000010012013331000000000100133133311111111111",
    "1111111111111111111110000000000000000001104000000200000000011000000000000000000110002000000000000001111111100000000000011000000000002000000110111110000000000001100000000000000000011000000002000000000111000000000000000001100000000000000000011020000000000200000111110000000000000001101002000000000000011010111000000000000111100100200000000001100001011100000000011000010010000200000113333133133311133331",
    "1111111111311111111110000000000000000001120000000000000020011000000000300000000110400000003000000001130311111131110000011000000000300000011110200000003000000001100000000030000000011000000000300011000110000000003000000001102000000032000000011000000000311000000110000000003000000001100000000030000002011020000000000111111110000000000000000001100000000000000000011000000000111100000113331111111001133331",
    "1000000000000111111110000000000001000001100000000000010400011000000000000100000110000000000001111001120000000000000000011100000111000000002110000000100000000001120000001000111110011100000010000010000110000000100000100001120000001000001000211100000010000010000110000000100000100001120000001000001000011100000010000010000110000000100000100021100000001000001000011000000010000010000113333333133333133331",
    "1111111111111111111110000000000000000001104001000000000000011222000000000000000110000000100000000001100000222222100000011000002000020000000110000000000000000001100000001100011000011000002222222220000110000020000000000101100022200000000022211000000000000010000110100000000002200001122200000000000001011000000000000000222110000110000000100001100022220000000000011000200200010000000111111111111111111111",
    "1111111111111111111110000010000100000001104000100011100000011000001000000000000110000010001110000001100000102000000000011000501333000006600110011111110000000001100010000600660000011000100006000000000110201050066000000001100010000600000005011000100011111111111110001000000000000003100066000000000000031000660000000000000310006605000000000203100011111666666666631000100010000000000313331000133333333333",
    "1111111111111111111114100000000000000001100000000000000000511611111331133113311110100000000000000001101000000000000000011000000000000000005117111133113311331111101000100010001000011010101010101010100110001000100010001051161111111111111111111010013333331313100110100000330000000001100001000000011110511711111111111111111110100075700000000001101011161111111111011000127222222222270111111111111111111111",
];

var tests = [
    "1111111111111111111110000010000100000001104000100011100000011000001000000000000110000010001110000001100000102000000000011000501333000006600110011111110000000001100010000600660000011000100006000000000110201050066000000001100010000600000005011000100011111111111110001000000000000003100066000000000000031000660000000000000310006605000000000203100011111666666666631000100010000000000313331000133333333333",
];
